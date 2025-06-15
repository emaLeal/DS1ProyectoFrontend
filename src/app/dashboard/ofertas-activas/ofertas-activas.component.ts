import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { JobOffer, OfertasService } from '../../services/ofertas.service';

@Component({
  selector: 'app-ofertas-activas',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    MatSnackBarModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './ofertas-activas.component.html',
  styleUrls: ['./ofertas-activas.component.css']
})
export class OfertasActivasComponent implements OnInit {
  filtroPalabra = '';
  filtroCargo = '';
  filtroRango = '';
  filtroSalario: number | null = null;

  ofertas: JobOffer[] = [];
  ofertasFiltradas: JobOffer[] = [];

  private ofertasService = inject(OfertasService);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  ngOnInit() {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.ofertasService.getOfertas().subscribe({
      next: (ofertas: JobOffer[]) => {
        this.ofertas = ofertas.filter(oferta => oferta.status === 'active');
        this.ofertasFiltradas = [...this.ofertas];
        this.aplicarFiltros();
      },
      error: (error: Error) => {
        console.error('Error al cargar las ofertas:', error);
        this.mostrarMensaje('Error al cargar las ofertas', 'error');
      }
    });
  }

  aplicarFiltros() {
    this.ofertasFiltradas = this.ofertas.filter(oferta => {
      return (
        (!this.filtroPalabra || 
          oferta.title.toLowerCase().includes(this.filtroPalabra.toLowerCase()) ||
          oferta.responsibilities.toLowerCase().includes(this.filtroPalabra.toLowerCase())
        ) &&
        (!this.filtroCargo || oferta.title === this.filtroCargo) &&
        (!this.filtroRango || oferta.rank === this.filtroRango) &&
        (this.filtroSalario === null || oferta.salary >= this.filtroSalario)
      );
    });
  }

  editarOferta(id: number) {
    this.router.navigate(['/dashboard/editar-oferta', id]);
  }

  private mostrarMensaje(mensaje: string, tipo: 'success' | 'error') {
    this.snackBar.open(mensaje, 'Cerrar', {
      duration: 5000,
      panelClass: tipo === 'success' ? ['success-snackbar'] : ['error-snackbar'],
      horizontalPosition: 'center',
      verticalPosition: 'bottom'
    });
  }
}
