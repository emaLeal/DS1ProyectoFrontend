import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin, of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';

export interface SearchResult {
  title: string;
  description: string;
  route: string;
  icon: string;
  type: string;
  id?: string | number;
  highlightedText?: string;
  elementId?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private searchResults = new BehaviorSubject<SearchResult[]>([]);
  private searchTerm = new BehaviorSubject<string>('');
  private apiUrl = 'http://localhost:8000/api'; // URL del backend
  private lastHighlightedElement: HTMLElement | null = null;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {
    console.log('SearchService initialized');
  }

  search(term: string): void {
    console.log('Search initiated with term:', term);
    this.searchTerm.next(term);
    
    if (!term.trim()) {
      console.log('Empty search term, clearing results');
      this.searchResults.next([]);
      return;
    }

    // Realizar búsquedas en paralelo
    const searches = {
      postulantes: this.searchPostulantes(term),
      ofertas: this.searchOfertas(term),
      usuarios: this.searchUsuarios(term)
    };

    forkJoin(searches).pipe(
      tap(results => console.log('Raw search results:', results)),
      catchError(error => {
        console.error('Error in search:', error);
        return of({
          postulantes: [],
          ofertas: [],
          usuarios: []
        });
      })
    ).subscribe(results => {
      const allResults = [
        ...results.postulantes,
        ...results.ofertas,
        ...results.usuarios
      ];
      console.log('Combined search results:', allResults);
      this.searchResults.next(allResults);
    });
  }

  private searchPostulantes(term: string): Observable<SearchResult[]> {
    console.log('Searching postulantes with term:', term);
    return this.http.get<any[]>(`${this.apiUrl}/postulantes`).pipe(
      tap(response => console.log('Postulantes API response:', response)),
      map(postulantes => postulantes
        .filter(p => this.matchesSearch(p, term))
        .map(p => ({
          title: p.nombre,
          description: `${p.cargo} - ${p.experiencia}`,
          route: `/dashboard/postulantes`,
          icon: 'fa-user',
          type: 'postulante',
          id: p.id,
          elementId: `postulante-${p.id}`,
          highlightedText: this.getHighlightedText(p, term)
        }))
      ),
      catchError(error => {
        console.error('Error searching postulantes:', error);
        return of([]);
      })
    );
  }

  private searchOfertas(term: string): Observable<SearchResult[]> {
    console.log('Searching ofertas with term:', term);
    return this.http.get<any[]>(`${this.apiUrl}/ofertas`).pipe(
      tap(response => console.log('Ofertas API response:', response)),
      map(ofertas => ofertas
        .filter(o => this.matchesSearch(o, term))
        .map(o => ({
          title: o.titulo,
          description: `Salario: ${o.salario} - Estado: ${o.estado}`,
          route: o.estado === 'activa' ? '/dashboard/ofertas-activas' : '/dashboard/ofertas-cerradas',
          icon: o.estado === 'activa' ? 'fa-pen-to-square' : 'fa-xmark',
          type: 'oferta',
          id: o.id,
          elementId: `oferta-${o.id}`,
          highlightedText: this.getHighlightedText(o, term)
        }))
      ),
      catchError(error => {
        console.error('Error searching ofertas:', error);
        return of([]);
      })
    );
  }

  private searchUsuarios(term: string): Observable<SearchResult[]> {
    console.log('Searching usuarios with term:', term);
    return this.http.get<any[]>(`${this.apiUrl}/usuarios`).pipe(
      tap(response => console.log('Usuarios API response:', response)),
      map(usuarios => usuarios
        .filter(u => this.matchesSearch(u, term))
        .map(u => ({
          title: u.nombre,
          description: `${u.email} - Rol: ${u.rol}`,
          route: '/dashboard/usuarios',
          icon: 'fa-user-circle',
          type: 'usuario',
          id: u.id,
          elementId: `usuario-${u.id}`,
          highlightedText: this.getHighlightedText(u, term)
        }))
      ),
      catchError(error => {
        console.error('Error searching usuarios:', error);
        return of([]);
      })
    );
  }

  private matchesSearch(item: any, term: string): boolean {
    const searchTerm = term.toLowerCase();
    return Object.values(item).some(value => 
      value && value.toString().toLowerCase().includes(searchTerm)
    );
  }

  private getHighlightedText(item: any, term: string): string {
    const searchTerm = term.toLowerCase();
    let highlightedText = '';
    
    Object.entries(item).forEach(([key, value]) => {
      if (value && typeof value === 'string' && value.toLowerCase().includes(searchTerm)) {
        const text = value.toString();
        const index = text.toLowerCase().indexOf(searchTerm);
        highlightedText = text.substring(Math.max(0, index - 20), Math.min(text.length, index + searchTerm.length + 20));
        if (index > 20) highlightedText = '...' + highlightedText;
        if (index + searchTerm.length + 20 < text.length) highlightedText += '...';
      }
    });

    return highlightedText;
  }

  getSearchResults(): Observable<SearchResult[]> {
    return this.searchResults.asObservable();
  }

  getCurrentSearchTerm(): Observable<string> {
    return this.searchTerm.asObservable();
  }

  navigateToResult(result: SearchResult): void {
    // Remover el resaltado anterior si existe
    if (this.lastHighlightedElement) {
      this.lastHighlightedElement.classList.remove('highlight-search');
    }

    this.router.navigate([result.route]).then(() => {
      setTimeout(() => {
        // Esperar a que la navegación se complete y el DOM se actualice
        const element = document.getElementById(result.elementId || '');
        if (element) {
          element.classList.add('highlight-search');
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          this.lastHighlightedElement = element;
        }
      }, 500);
    });
    this.clearSearch();
  }

  clearSearch(): void {
    this.searchTerm.next('');
    this.searchResults.next([]);
  }
} 