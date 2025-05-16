import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ofertas-cerradas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ofertas-cerradas.component.html',
  styleUrls: ['./ofertas-cerradas.component.css']
})
export class OfertasCerradasComponent {
  filtroPalabra = '';
  filtroCargo = '';
  filtroRango = '';
  filtroSalario: number | null = null;

  ofertasOriginales = [
    { cargo: 'Analista UI/UX', empresa: 'Creativa Studio', salario: '$2.500.000', ubicacion: 'Bogotá', rango: 'Junior' },
    { cargo: 'Back-End', empresa: 'CodeWorks', salario: '$4.000.000', ubicacion: 'Medellín', rango: 'Senior' },
    { cargo: 'Comercial', empresa: 'VentasPro', salario: '$3.200.000', ubicacion: 'Cali', rango: 'Junior' }
  ];

  ofertas = [...this.ofertasOriginales];

  aplicarFiltros() {
    this.ofertas = this.ofertasOriginales.filter(oferta => {
      const salario = parseInt(oferta.salario.replace(/\D/g, ''), 10);
      return (
        (!this.filtroPalabra || oferta.cargo.toLowerCase().includes(this.filtroPalabra.toLowerCase())) &&
        (!this.filtroCargo || oferta.cargo === this.filtroCargo) &&
        (!this.filtroRango || oferta.rango === this.filtroRango) &&
        (this.filtroSalario === null || salario >= this.filtroSalario)
      );
    });
  }
}
