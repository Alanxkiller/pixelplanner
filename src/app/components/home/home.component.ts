import { Component, OnInit } from '@angular/core';
import { EventosDataService } from '../../services/eventosData.service';
import eventosData from '../../interfaces/eventosData.interface';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit{

  eventos: eventosData[] = [];
  stats = {
    totalEventos: 0,
    ingresoTotal: 0,
    ingresoPendiente: 0,
    proximoEvento: null as eventosData | null
  };
  monthlyRevenue: any[] = [];
  recentEvents: eventosData[] = [];
  weeklyEvents: eventosData[] = [];
  upcomingEvents: eventosData[] = [];
  monthlyStats: any[] = [];
  revenueChart: any;
  monthlyAnalysisChart: any;
  recentPayments: any[] = [];
  chart: any;

  constructor(private eventosService: EventosDataService) {}

  ngOnInit() {
    this.eventosService.getEventos().subscribe(eventos => {
      this.eventos = eventos;
      this.calculateStats();
      this.calculateMonthlyRevenue();
      this.calculateMonthlyStats();
      this.setRecentEvents();
      this.setWeeklyEvents();
      this.setUpcomingEvents();
      this.setRecentPayments();
      this.initializeCharts();
    });
  }

  private setRecentPayments() {
    // Filtramos eventos que tienen pagos registrados
    const eventsWithPayments = this.eventos
      .filter(evento => evento.montoPagado > 0)
      .map(evento => ({
        ...evento,
        porcentajePagado: (evento.montoPagado / evento.monto) * 100,
        pendiente: evento.monto - evento.montoPagado
      }))
      .sort((a, b) => b.montoPagado - a.montoPagado) // Ordenamos por monto pagado
      .slice(0, 5); // Tomamos los 5 pagos más recientes

    this.recentPayments = eventsWithPayments;
  }

  getPaymentStatusClass(porcentajePagado: number): string {
    if (porcentajePagado >= 100) {
      return 'bg-green-100 text-green-800';
    } else if (porcentajePagado >= 50) {
      return 'bg-blue-100 text-blue-800';
    } else {
      return 'bg-yellow-100 text-yellow-800';
    }
  }

  getPaymentStatusText(porcentajePagado: number): string {
    if (porcentajePagado >= 100) {
      return 'Pagado completo';
    } else if (porcentajePagado >= 50) {
      return 'Pago parcial';
    } else {
      return 'Pago inicial';
    }
  }

  getProgressBarClass(porcentajePagado: number): string {
    if (porcentajePagado >= 100) {
      return 'bg-green-500';
    } else if (porcentajePagado >= 50) {
      return 'bg-blue-500';
    } else {
      return 'bg-yellow-500';
    }
  }

  private calculateMonthlyStats() {
    const monthlyData = this.eventos.reduce((acc: any, evento) => {
      const date = new Date(evento.fechaYHora);
      const month = date.toLocaleString('es-MX', { month: 'long' });
      const year = date.getFullYear();
      const key = `${month}-${year}`;

      if (!acc[key]) {
        acc[key] = {
          name: month,
          year: year,
          totalEventos: 0,
          ingresoTotal: 0,
          ingresoPagado: 0,
          promedioPorEvento: 0
        };
      }

      acc[key].totalEventos++;
      acc[key].ingresoTotal += evento.monto;
      acc[key].ingresoPagado += evento.montoPagado || 0;
      acc[key].promedioPorEvento = acc[key].ingresoTotal / acc[key].totalEventos;

      return acc;
    }, {});

    this.monthlyStats = Object.values(monthlyData)
      .sort((a: any, b: any) => b.ingresoTotal - a.ingresoTotal);
  }

  private initializeCharts() {
    this.initializeRevenueChart();
    this.initializeMonthlyAnalysisChart();
  }

  private calculateStats() {
    const total = this.eventos.length;
    const ingresos = this.eventos.reduce((sum, ev) => sum + ev.monto, 0);
    const pendiente = this.eventos.reduce((sum, ev) => 
      sum + (ev.monto - (ev.montoPagado || 0)), 0);
    
    const today = new Date();
    const proximo = this.eventos
      .filter(ev => new Date(ev.fechaYHora) > today)
      .sort((a, b) => 
        new Date(a.fechaYHora).getTime() - new Date(b.fechaYHora).getTime()
      )[0];

    this.stats = {
      totalEventos: total,
      ingresoTotal: ingresos,
      ingresoPendiente: pendiente,
      proximoEvento: proximo
    };
  }

  private calculateMonthlyRevenue() {
    this.monthlyRevenue = this.eventos.reduce((acc: any[], ev) => {
      const month = new Date(ev.fechaYHora)
        .toLocaleString('es-MX', { month: 'long' });
      
      const existing = acc.find(m => m.name === month);
      if (existing) {
        existing.monto += ev.monto;
        existing.pagado += (ev.montoPagado || 0);
      } else {
        acc.push({ 
          name: month, 
          monto: ev.monto, 
          pagado: ev.montoPagado || 0 
        });
      }
      return acc;
    }, []);
  }

  private setRecentEvents() {
    this.recentEvents = [...this.eventos]
      .sort((a, b) => new Date(b.fechaYHora).getTime() - new Date(a.fechaYHora).getTime())
      .slice(0, 5);
  }

  private initializeRevenueChart() {
    const ctx = document.getElementById('revenueChart') as HTMLCanvasElement;
    if (this.revenueChart) {
      this.revenueChart.destroy();
    }

    this.revenueChart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: this.monthlyRevenue.map(item => item.name),
        datasets: [
          {
            label: 'Monto Total',
            data: this.monthlyRevenue.map(item => item.monto),
            borderColor: '#2563eb',
            backgroundColor: '#2563eb20',
            tension: 0.4,
            fill: true
          },
          {
            label: 'Monto Pagado',
            data: this.monthlyRevenue.map(item => item.pagado),
            borderColor: '#16a34a',
            backgroundColor: '#16a34a20',
            tension: 0.4,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Ingresos Mensuales'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => this.formatCurrency(Number(value))
            }
          }
        }
      }
    });
  }

  private initializeMonthlyAnalysisChart() {
    const ctx = document.getElementById('monthlyAnalysisChart') as HTMLCanvasElement;
    if (this.monthlyAnalysisChart) {
      this.monthlyAnalysisChart.destroy();
    }

    const topMonths = this.monthlyStats.slice(0, 6); // Tomamos los 6 mejores meses

    this.monthlyAnalysisChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: topMonths.map(month => `${month.name} ${month.year}`),
        datasets: [
          {
            label: 'Ingreso Total',
            data: topMonths.map(month => month.ingresoTotal),
            backgroundColor: '#2563eb80',
            borderColor: '#2563eb',
            borderWidth: 1
          },
          {
            label: 'Promedio por Evento',
            data: topMonths.map(month => month.promedioPorEvento),
            backgroundColor: '#16a34a80',
            borderColor: '#16a34a',
            borderWidth: 1
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
          },
          title: {
            display: true,
            text: 'Análisis de Mejores Meses'
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: (value) => this.formatCurrency(Number(value))
            }
          }
        }
      }
    });
  }


  private setWeeklyEvents() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Domingo
    startOfWeek.setHours(0, 0, 0, 0);

    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sábado
    endOfWeek.setHours(23, 59, 59, 999);

    this.weeklyEvents = this.eventos
      .filter(evento => {
        const eventDate = new Date(evento.fechaYHora);
        return eventDate >= startOfWeek && eventDate <= endOfWeek;
      })
      .sort((a, b) => new Date(a.fechaYHora).getTime() - new Date(b.fechaYHora).getTime());
  }

  private setUpcomingEvents() {
    const today = new Date();
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14);

    this.upcomingEvents = this.eventos
      .filter(evento => {
        const eventDate = new Date(evento.fechaYHora);
        return eventDate > today && eventDate <= twoWeeksFromNow;
      })
      .sort((a, b) => new Date(a.fechaYHora).getTime() - new Date(b.fechaYHora).getTime());
  }

  getDayName(date: string): string {
    return new Date(date).toLocaleDateString('es-MX', { weekday: 'long' });
  }

  getEventTime(date: string): string {
    return new Date(date).toLocaleTimeString('es-MX', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(value);
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getPaymentStatus(evento: eventosData): string {
    return evento.montoPagado >= evento.monto ? 'bg-green-500' : 'bg-yellow-500';
  }

}
