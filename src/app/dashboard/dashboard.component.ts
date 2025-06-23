import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { RouterModule } from '@angular/router';
import { AuthService } from '../authentication/auth.service';
import { SearchService, SearchResult } from '../services/search.service';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import TranslateLogic from '../lib/translate/translate.class';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterModule,
    FormsModule,
    HttpClientModule,
    TranslateModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent extends TranslateLogic implements OnInit, OnDestroy {
  isMenuOpen = false;
  user: any;
  searchTerm: string = '';
  searchResults: SearchResult[] = [];
  showSearchResults = false;
  isSearching = false;
  private searchSubscription?: Subscription;
  menuOpen = false;
  isLoading = false;
  private routerSubscription?: Subscription;

  // Nuevas propiedades para el manejo de menús colapsables
  mainMenuCollapsed = false;
  directorMenuCollapsed = false;
  adminMenuCollapsed = false;

  constructor(
    private router: Router, 
    private authService: AuthService,
    private searchService: SearchService,
    translate: TranslateService
  ) {
    super(translate);
    console.log('Dashboard component constructed');
    this.user = this.authService.getProfile;
  }

  ngOnInit() {
    console.log('Dashboard component initialized');
    this.searchSubscription = this.searchService.getSearchResults().subscribe({
      next: (results) => {
        console.log('Search results received:', results);
        this.searchResults = results;
        this.showSearchResults = results.length > 0;
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error getting search results:', error);
        this.isSearching = false;
      }
    });

    // Suscribirse a los eventos del router para mostrar/ocultar el loading
    this.routerSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        this.isLoading = true;
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        // Simular un pequeño delay para que la animación sea visible
        setTimeout(() => {
          this.isLoading = false;
        }, 500);
      }
    });
  }

  ngOnDestroy() {
    if (this.searchSubscription) {
      this.searchSubscription.unsubscribe();
    }
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }

  // Métodos para manejar los menús colapsables
  toggleMainMenu() {
    this.mainMenuCollapsed = !this.mainMenuCollapsed;
  }

  toggleDirectorMenu() {
    this.directorMenuCollapsed = !this.directorMenuCollapsed;
  }

  toggleAdminMenu() {
    this.adminMenuCollapsed = !this.adminMenuCollapsed;
  }

  onSearch(event: any): void {
    console.log('Search event triggered:', event.target.value);
    const term = event.target.value;
    this.searchTerm = term;
    this.isSearching = true;
    this.showSearchResults = true;
    this.searchService.search(term);
  }

  selectResult(result: SearchResult): void {
    console.log('Result selected:', result);
    this.searchService.navigateToResult(result);
    this.showSearchResults = false;
    this.searchTerm = '';
  }

  closeSearchResults(): void {
    setTimeout(() => {
      this.showSearchResults = false;
    }, 200);
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  toggleLangMenu() {
    this.menuOpen = !this.menuOpen;
  }

  closeMenu() {
    setTimeout(() => {
      this.isMenuOpen = false;
    }, 200);
  }

  closeLangMenu() {
    setTimeout(() => {
      this.menuOpen = false;
    }, 200);
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
