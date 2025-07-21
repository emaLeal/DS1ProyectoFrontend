import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OfertasService, JobOffer } from '../../services/ofertas.service';
import { OfertaDetalleModalComponent } from '../ofertas/ofertas-lista/oferta-detalle-modal.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-ofertas-cerradas',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule],
  templateUrl: './ofertas-cerradas.component.html',
  styleUrls: ['./ofertas-cerradas.component.css']
})
export class OfertasCerradasComponent {
  filtroPalabra = '';
  filtroCargo = '';
  filtroRango = '';
  filtroSalario: number | null = null;

  ofertas: JobOffer[] = [];
  ofertasOriginales: JobOffer[] = [];

  constructor(private ofertasService: OfertasService, private dialog: MatDialog) {
    this.cargarOfertas();
  }

  cargarOfertas() {
    this.ofertasService.getOfertas().subscribe({
      next: (data) => {
        this.ofertasOriginales = data.filter(oferta => oferta.status === 'closed');
        this.ofertas = [...this.ofertasOriginales];
      },
      error: (error) => {
        console.error('Error al cargar ofertas cerradas:', error);
      }
    });
  }

  aplicarFiltros() {
    this.ofertas = this.ofertasOriginales.filter(oferta => {
      let salario = 0;
      if (typeof oferta.salary === 'string') {
        salario = parseInt((oferta.salary as string).replace(/\D/g, ''), 10);
      } else if (typeof oferta.salary === 'number') {
        salario = oferta.salary;
      }
      return (
        (!this.filtroPalabra || oferta.title.toLowerCase().includes(this.filtroPalabra.toLowerCase())) &&
        (!this.filtroCargo || oferta.title === this.filtroCargo) &&
        (!this.filtroRango || oferta.rank === this.filtroRango) &&
        (this.filtroSalario === null || salario >= this.filtroSalario)
      );
    });
  }

  verDetallesOferta(id: number) {
    this.ofertasService.getOferta(id).subscribe({
      next: (oferta) => {
        this.dialog.open(OfertaDetalleModalComponent, {
          width: '500px',
          data: oferta
        });
      },
      error: () => {
        // Puedes mostrar un mensaje de error si lo deseas
      }
    });
  }
}
