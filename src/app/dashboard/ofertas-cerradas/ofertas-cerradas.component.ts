import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { OfertasService, JobOffer } from '../../services/ofertas.service';
import { OfertaDetalleModalComponent } from '../ofertas/ofertas-lista/oferta-detalle-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-ofertas-cerradas',
  standalone: true,
  imports: [CommonModule, FormsModule, TranslateModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatButtonModule, MatIconModule, MatCardModule],
  templateUrl: './ofertas-cerradas.component.html',
  styleUrls: ['./ofertas-cerradas.component.css']
})
export class OfertasCerradasComponent {
  filtroPalabra = '';
  filtroCargo = '';
  filtroRango = '';
  filtroSalario: number | null = null;

  tiposCargo: string[] = [];
  rangos: string[] = [
    'Junior', 'Semi Senior', 'Senior', 'Lead'
  ];

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
        this.tiposCargo = [...new Set(this.ofertasOriginales.map(o => o.title))];
      },
      error: (error) => {
        console.error('Error al cargar ofertas cerradas:', error);
      }
    });
  }

  aplicarFiltros() {
    this.ofertas = this.ofertasOriginales.filter(oferta => {
      // Convertir salario a número entero robustamente
      let salario = oferta.salary;
      if (typeof salario === 'string') {
        // Elimina todo lo que no sea dígito o punto decimal
        salario = parseFloat(String(salario).replace(/[^0-9.]/g, ''));
      } else if (typeof salario === 'number') {
        salario = Math.floor(salario);
      } else {
        salario = 0;
      }
      // Si el filtro está vacío, mostrar todas
      if (this.filtroSalario === null || this.filtroSalario === undefined || String(this.filtroSalario) === '' || isNaN(Number(this.filtroSalario))) {
        return (
          (!this.filtroPalabra || oferta.title.toLowerCase().includes(this.filtroPalabra.toLowerCase())) &&
          (!this.filtroCargo || oferta.title === this.filtroCargo) &&
          (!this.filtroRango || oferta.rank === this.filtroRango)
        );
      }
      // Comparar salario convertido con el filtro
      return (
        (!this.filtroPalabra || oferta.title.toLowerCase().includes(this.filtroPalabra.toLowerCase())) &&
        (!this.filtroCargo || oferta.title === this.filtroCargo) &&
        (!this.filtroRango || oferta.rank === this.filtroRango) &&
        (salario >= Number(this.filtroSalario))
      );
    });
  }

  verDetallesOferta(oferta: JobOffer) {
    this.dialog.open(OfertaDetalleModalComponent, {
      width: '500px',
      data: oferta
    });
  }
}
