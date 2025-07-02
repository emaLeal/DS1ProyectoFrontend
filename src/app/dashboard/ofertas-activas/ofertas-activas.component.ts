import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { OfertasService, JobOffer } from '../../services/ofertas.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
@Component({
  selector: 'app-ofertas-activas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatDialogModule,
    MatSnackBarModule,
    TranslateModule
  ],
  templateUrl: './ofertas-activas.component.html',
  styleUrls: ['./ofertas-activas.component.css']
})
export class OfertasActivasComponent {
  filtroPalabra = '';
  filtroCargo = '';
  filtroRango = '';
  filtroSalario: number | null = null;
  ofertas: JobOffer[] = [];
  ofertasFiltradas: JobOffer[] = [];

  constructor(
    private ofertasService: OfertasService,
    private dialog: MatDialog
  ) {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.ofertasService.getOfertas().subscribe({
      next: (ofertas) => {
        this.ofertas = ofertas;
        this.aplicarFiltros();
      },
      error: (error) => {
        console.error('Error al cargar ofertas:', error);
      }
    });
  }

  aplicarFiltros() {
    this.ofertasFiltradas = this.ofertas.filter(oferta => {
      const salario = oferta.salary;
      const rango = oferta.rank === 'SemiSenior' ? 'Semi Senior' : oferta.rank;
      return (
        (!this.filtroPalabra || oferta.title.toLowerCase().includes(this.filtroPalabra.toLowerCase())) &&
        (!this.filtroCargo || oferta.title === this.filtroCargo) &&
        (!this.filtroRango || rango === this.filtroRango) &&
        (this.filtroSalario === null || salario >= this.filtroSalario)
      );
    });
  }

  editarOferta(id: number) {
    // Implementar lógica de edición
    console.log('Editar oferta:', id);
  }
}
