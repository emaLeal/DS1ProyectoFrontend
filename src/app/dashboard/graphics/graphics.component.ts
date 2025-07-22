import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import 'chartjs-adapter-date-fns';
import { BaseChartDirective } from 'ng2-charts';
import {
  Chart,
  BarController,
  BarElement,
  CategoryScale,
  LinearScale,
  LineController,
  LineElement,
  PointElement,
  DoughnutController,
  ArcElement,
  Filler,
  Tooltip,
  Legend, ChartOptions, ChartDataset, TimeScale
} from 'chart.js';

Chart.register(
  BarController, BarElement,
  CategoryScale, LinearScale,
  LineController, LineElement, PointElement,
  DoughnutController, ArcElement,
  Filler, TimeScale,

  Tooltip, Legend
);
import { ChartConfiguration, ChartType } from 'chart.js';
import { UsuariosService } from '../usuarios/usuarios.service';
import { OfertasService } from '../../services/ofertas.service';
import { PostulantesService } from '../../services/postulantes.service';
import TranslateLogic from '../../lib/translate/translate.class';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-graphics',
  standalone: true,
  imports: [BaseChartDirective, CommonModule, TranslateModule],
  templateUrl: './graphics.component.html',
  styleUrls: ['./graphics.component.css']
})
export class GraphicsComponent extends TranslateLogic implements OnInit {

  @ViewChild('chartUsuarios') chartUsuarios?: BaseChartDirective;
  @ViewChild('chartOfertas') chartOfertas?: BaseChartDirective;
  @ViewChild('chartPostulaciones') chartPostulaciones?: BaseChartDirective;
  @ViewChild('chartStatusOferta') chartStatusOferta?: BaseChartDirective;
  @ViewChild('chartStacked') chartStacked?: BaseChartDirective;




  usuarios: any[] = [];
  postulantes: any[] = [];
  director: any[] = [];
  administrador: any = [];
  ofertas: any[] = [];
  ofertas2: any[] = [];
  postulaciones: any[] = [];
  user: any = null;
  isAdmin: boolean = false;

  labels: string[] = [];
  data = {
    administrador: [] as number[],
    director: [] as number[],
    postulante: [] as number[]
  };


  constructor(
    private userService: UsuariosService,
    private ofertasService: OfertasService,
    private postulantesService: PostulantesService,
    translate: TranslateService
  ) { 
    super(translate)
  }

  ngOnInit() {
    this.user = JSON.parse(localStorage.getItem('user_data')!);
    this.isAdmin = this.user?.role === 1 || this.user?.role?.id === 1;
    this.cargarUsuarios();
    this.cargarOfertas();
    this.cargarPostulaciones();
  }



  // Donut: Ticket Volume by Priority
  donutChart = {
    data: {
      labels: ['Urgent', 'High', 'Medium', 'Low'],
      datasets: [
        {
          data: [15, 25, 40, 20],
          backgroundColor: ['#F44336', '#FF9800', '#FFC107', '#8BC34A']
        }
      ]
    },
    type: 'doughnut' as ChartType
  };



  cargarUsuarios() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.usuarios = data;
        this.postulantes = this.usuarios.filter(usuario => usuario.role === 3);
        this.director = this.usuarios.filter(usuario => usuario.role === 2);
        this.administrador = this.usuarios.filter(usuario => usuario.role === 1);
        this.graficoUsuario();
      },
      error: (error) => {
        console.error('Error al cargar usuarios:', error);
      }
    });
  }

  //Grafico de usuarios
  chartData: ChartConfiguration<'bar'>['data'] = {
    labels: [],
    datasets: [
      { data: [], label: 'Administrador', backgroundColor: '#28a745' },
      { data: [], label: 'Director', backgroundColor: '#007bff' },
      { data: [], label: 'Postulante', backgroundColor: '#ffc107' }
    ]
  };

  chartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Registros por tipo de usuario por mes' }
    }
  };
  graficoUsuario() {

    const agrupado: { [mes: string]: { [role: number]: number } } = {};

    for (const user of this.usuarios) {
      const date = new Date(user.date_joined);
      const mes = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;

      if (!agrupado[mes]) agrupado[mes] = {};
      if (!agrupado[mes][user.role]) agrupado[mes][user.role] = 0;

      agrupado[mes][user.role]++;
    }

    const mesesOrdenados = Object.keys(agrupado).sort();
    this.chartData.labels = mesesOrdenados;

    this.chartData.datasets[0].data = mesesOrdenados.map(mes => agrupado[mes][1] || 0); // Administrador
    this.chartData.datasets[1].data = mesesOrdenados.map(mes => agrupado[mes][2] || 0); // Director
    this.chartData.datasets[2].data = mesesOrdenados.map(mes => agrupado[mes][3] || 0); // Postulante

    this.chartUsuarios?.update();
  }

  //Grafico de ofestas
  chartOfertasData: ChartConfiguration<'line'>['data'] = {
    datasets: []
  };

  chartOfertasOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: { display: false },
      title: { display: true, text: 'Duración de las ofertas' }
    },
    scales: {
      x: {
        type: 'time',
        title: {
          display: true,
          text: 'Fecha'
        },
        time: {
          unit: 'day',
          tooltipFormat: 'dd/MM/yyyy'
        }
      },
      y: {
        title: {
          display: true,
          text: 'Ofertas'
        },
        ticks: {
          callback: (value) => {
            const idx = Number(value) - 1;
            return this.ofertas[idx]?.nombre || '';
          }
        }
      }
    }
  };

  graficoOfertas() {
    this.chartOfertasData.datasets = this.ofertas.map((oferta, index) => ({
      label: oferta.title,
      data: [
        { x: oferta.start_date, y: index + 1 },
        { x: oferta.end_date, y: index + 1 }
      ],
      borderColor: 'rgba(54, 162, 235, 1)',
      backgroundColor: 'rgba(54, 162, 235, 0.3)',
      stepped: true,
      fill: false,
      tension: 0
    }));

    this.chartOfertas?.update();


  }

  //Grafico de postulaciones

  chartPostulacionesData: ChartConfiguration<'line'>['data'] = {
    datasets: []
  };

  chartPostulacionesOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: 'Postulaciones por mes (2025)'
      }
    },
    scales: {
      x: {
        type: 'category',
        title: {
          display: true,
          text: 'Meses'
        },
        labels: [
          'Enero', 'Febrero', 'Marzo', 'Abril',
          'Mayo', 'Junio', 'Julio', 'Agosto',
          'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
        ]
      },
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Cantidad de postulaciones'
        }
      }
    }
  };


  graficoPostulaciones() {
    const postulacionesPorMes = new Array(12).fill(0);

    // Simulamos un arreglo de postulaciones:
    this.postulaciones.forEach((p) => {
      const fecha = new Date(p.application_date);
      const mes = fecha.getMonth(); // 0 = Enero, 11 = Diciembre
      postulacionesPorMes[mes]++;
    });

    this.chartPostulacionesData.datasets = [
      {
        label: 'Postulaciones',
        data: postulacionesPorMes,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        stepped: true,
        fill: false,
        tension: 0
      }
    ];

    this.chartPostulaciones?.update();
  }

  // Grafico de ofertas activas y cerradas 
  chartOfertasDonutData: ChartConfiguration<'doughnut'>['data'] = {
    labels: ['Activas', 'Cerradas'],
    datasets: [
      {
        data: [0, 0], // se actualiza luego
        backgroundColor: ['#00c50aff', '#fa1313ff'],
        borderColor: ['#ffffff', '#ffffff'],
        borderWidth: 1
      }
    ]
  };
  chartOfertasDonutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    plugins: {
      legend: {
        position: 'left',
        labels: {
          color: '#333'
        }
      },
      title: {
        display: true,
        text: 'Estado de las Ofertas Laborales'
      }
    }
  };
  graficoOfertasActivasCerradas() {
    const activas = this.ofertas.filter(o => o.status === 'active').length;
    const cerradas = this.ofertas.filter(o => o.status === 'closed').length;

    this.chartOfertasDonutData.datasets[0].data = [activas, cerradas];
    this.chartStatusOferta?.update();
  }

  // Gráfico de barras apiladas: Ofertas lanzadas, cerradas y postulaciones por mes
  chartStackedData: ChartConfiguration<'bar'>['data'] = {
    labels: [
      'Enero', 'Febrero', 'Marzo', 'Abril',
      'Mayo', 'Junio', 'Julio', 'Agosto',
      'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ],
    datasets: [
      { label: 'Ofertas lanzadas', data: [], backgroundColor: '#1976d2' },
      { label: 'Ofertas cerradas', data: [], backgroundColor: '#fa1313' },
      { label: 'Postulaciones', data: [], backgroundColor: '#ffc107' }
    ]
  };

  chartStackedOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      title: { display: true, text: 'Ofertas lanzadas, cerradas y postulaciones por mes' }
    },
    scales: {
      x: { stacked: true },
      y: { stacked: true, beginAtZero: true }
    }
  };

  actualizarGraficoStacked() {
    // Inicializar arrays de 12 meses
    const lanzadas = new Array(12).fill(0);
    const cerradas = new Array(12).fill(0);
    const postulaciones = new Array(12).fill(0);

    // Ofertas lanzadas por mes (start_date)
    this.ofertas.forEach(oferta => {
      if (oferta.start_date) {
        const mes = new Date(oferta.start_date).getMonth();
        lanzadas[mes]++;
      }
      if (oferta.status === 'closed' && oferta.end_date) {
        const mesCierre = new Date(oferta.end_date).getMonth();
        cerradas[mesCierre]++;
      }
    });

    // Postulaciones por mes
    this.postulaciones.forEach(p => {
      if (p.application_date) {
        const mes = new Date(p.application_date).getMonth();
        postulaciones[mes]++;
      }
    });

    this.chartStackedData.datasets[0].data = lanzadas;
    this.chartStackedData.datasets[1].data = cerradas;
    this.chartStackedData.datasets[2].data = postulaciones;
    this.chartStacked?.update();
  }

  // Llamar a actualizarGraficoStacked después de cargar datos
  cargarOfertas() {
    this.ofertasService.getOfertas().subscribe({
      next: (data) => {
        if (this.isAdmin) {
          this.ofertas = data;
        } else {
          this.ofertas = data.filter(oferta => oferta.talent_director_document === this.user.document_id);
        }
        this.graficoOfertas();
        this.graficoOfertasActivasCerradas();
        this.actualizarGraficoStacked();
        console.log("Ofertas recibidas:", this.ofertas);
      },
      error: (error) => {
        console.error('Error al cargar ofertas:', error);
      }
    });
  }

  cargarPostulaciones() {
    this.postulantesService.getPostulaciones().subscribe({
      next: (data) => {
        this.postulaciones = data;
        this.graficoPostulaciones();
        this.actualizarGraficoStacked();
        console.log("Ofertas postulaciones:", this.postulaciones);
      },
      error: (error) => {
        console.error('Error al cargar ofertas:', error);
      }
    });
  }
}

