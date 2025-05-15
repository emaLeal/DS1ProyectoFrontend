import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-ofertas-activas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ofertas-activas.component.html',
  styleUrls: ['./ofertas-activas.component.css']
})
export class OfertasActivasComponent {
  filtroPalabra = '';
  filtroCargo = '';
  filtroRango = '';
  filtroSalario: number | null = null;

  ofertasOriginales = [
    { cargo: 'Analista de Datos', empresa: 'TechSoft', salario: '$3.000.000', ubicacion: 'Bogotá', rango: 'Junior' },
    { cargo: 'Desarrollador Frontend', empresa: 'Innovatech', salario: '$4.500.000', ubicacion: 'Medellín', rango: 'Senior' },
    { cargo: 'Back-End', empresa: 'DevCorp', salario: '$3.800.000', ubicacion: 'Cali', rango: 'Senior' }
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
