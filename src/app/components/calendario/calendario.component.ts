import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import eventosData from '../../interfaces/eventosData.interface';
import { ClientesDataService } from '../../services/clientesData.service';
import { EventosDataService } from '../../services/eventosData.service';
import { PaquetesDataService } from '../../services/paquetesData.service';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { updateDoc } from '@angular/fire/firestore';


@Component({
  selector: 'app-calendario',
  templateUrl: './calendario.component.html',
  styleUrl: './calendario.component.css'
})
export class CalendarioComponent {
  formulario: FormGroup;
  eventosData: eventosData[];
  eventosDataOriginal: eventosData[]; // Guardamos la lista original
  eventoDatos: any[] = [];
  mezez: any[] = [];
  showPagoPopup = false;
  eventoSeleccionado: eventosData | null = null;

  constructor(
    private eventosService: EventosDataService,
    private clientesService: ClientesDataService,
    private paquetesService: PaquetesDataService
  ) {
    this.formulario = new FormGroup({
      selectedCliente: new FormControl(''),
      idCliente: new FormControl(''),
      nombresCliente: new FormControl(''),
      nombreEvento: new FormControl(''),
      dirEvento: new FormControl(''),    
      fechaYHora: new FormControl(''),
      selectedPaquete: new FormControl(''),
      idPaquete: new FormControl(''),
      nombrePaquete: new FormControl(''),
      monto: new FormControl(),
      montoPagado: new FormControl(0), // Inicializado en 0
    });

    this.eventosData = [{
      idCliente: "Cargando...",
      nombresCliente: "Cargando...",
      nombreEvento: "Cargando...",
      dirEvento: "Cargando...",
      fechaYHora: "Cargando...",
      idPaquete: "Cargando...",
      nombrePaquete: "Cargando...",
      monto: 42,
      montoPagado : 42
    }];

    this.eventosDataOriginal = [...this.eventosData];


    this.mezez = 
    ["Enero", "Febrero", "Marzo", 
      "Abril", "Mayo", "Junio", 
      "Julio", "Agosto", "Septiembre", 
      "Octubre", "Noviembre", "Diciembre"];

    this.eventoDatos = [{
      idCliente: "...",
      nombresCliente: "Cargando...",
      nombreEvento: "Cargando...",
      dirEvento: "Cargando...",
      fechaYHora: "Cargando...",
      idPaquete: "Cargando...",
      nombrePaquete: "Cargando...",
      monto: 42
    }];

  }

  calcularColorFila(evento: eventosData): string {
    if (evento.montoPagado >= evento.monto) {
      return '#90EE90'; // Verde claro
    } else if (evento.montoPagado > 0) {
      return '#FFD700'; // Amarillo
    }
    return ''; // Color por defecto
  }

  estaCompletamentePagado(evento: eventosData): boolean {
    return (evento.montoPagado || 0) >= evento.monto;
  }

  abrirPopupPago(evento: eventosData) {
    this.eventoSeleccionado = evento;
    this.showPagoPopup = true;
  }

  async registrarPago(cantidad: number) {
    if (this.eventoSeleccionado) {
      const montoActual = this.eventoSeleccionado.montoPagado || 0;
      const montoTotal = this.eventoSeleccionado.monto;
      const nuevoMonto = montoActual + cantidad;
      
      // Validar que no exceda el monto total
      if (nuevoMonto > montoTotal) {
        alert(`El pago excede el monto total. Máximo a pagar: $${montoTotal - montoActual}`);
        return;
      }

      await this.eventosService.actualizarEvento({
        ...this.eventoSeleccionado,
        montoPagado: nuevoMonto
      });
      this.showPagoPopup = false;
      this.eventoSeleccionado = null;
    }
  }

  exportarPDF() {
    const doc = new jsPDF();
    const tableColumn = ["Cliente", "Evento", "Dirección", "Fecha", "Paquete", "Monto", "Pagado"];
    const tableRows: any[] = [];

    // Agregar logo
    const logoUrl = 'assets/PPLogo.png'; // Asegúrate de tener el logo en esta ruta
    doc.addImage(logoUrl, 'PNG', 10, 10, 30, 30);

    // Calcular totales
    let totalMonto = 0;
    let totalPagado = 0;

    this.eventosData.forEach(evento => {
      const eventoData = [
        evento.nombresCliente,
        evento.nombreEvento,
        evento.dirEvento,
        evento.fechaYHora,
        evento.nombrePaquete,
        `$${evento.monto}`,
        `$${evento.montoPagado || 0}`
      ];
      tableRows.push(eventoData);

      totalMonto += evento.monto;
      totalPagado += (evento.montoPagado || 0);
    });

    // Configurar el título (ajustado para dejar espacio al logo)
    doc.setFontSize(16);
    doc.text('Reporte de Eventos', 105, 35, { align: 'center' });
    
    // Agregar la tabla principal (ajustada para empezar después del logo)
    (doc as any).autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 45,
      styles: {
        fontSize: 8,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [66, 66, 66],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold'
      }
    });

    // Obtener la posición Y donde terminó la tabla
    const finalY = (doc as any).lastAutoTable.finalY || 60;

    // Agregar el resumen financiero
    doc.setFontSize(12);
    doc.text('Resumen Financiero', 14, finalY + 20);

    // Agregar línea separadora
    doc.setLineWidth(0.5);
    doc.line(14, finalY + 22, 196, finalY + 22);

    // Configurar el estilo para los totales
    doc.setFontSize(10);
    const porPagar = totalMonto - totalPagado;
    
    // Agregar los totales
    const summaryData = [
        ['Total Monto Eventos:', `$${totalMonto.toFixed(2)}`],
        ['Total Monto Pagado:', `$${totalPagado.toFixed(2)}`],
        ['Total Por Pagar:', `$${porPagar.toFixed(2)}`]
    ];

    (doc as any).autoTable({
        startY: finalY + 25,
        head: [],
        body: summaryData,
        theme: 'plain',
        styles: {
            fontSize: 10,
            cellPadding: 3
        },
        columnStyles: {
            0: { cellWidth: 100, fontStyle: 'bold' },
            1: { cellWidth: 50, halign: 'right' }
        },
        margin: { left: 14 }
    });

    // Agregar pie de página con fecha de generación
    const fecha = new Date().toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
    doc.setFontSize(8);
    doc.text(`Reporte generado el: ${fecha}`, 14, doc.internal.pageSize.height - 10);

    doc.save('eventos.pdf');
}

  ngOnInit(): void {
    this.eventosService.getEventos().subscribe(eventos => {
      this.eventosData = eventos;
      this.eventosDataOriginal = [...eventos]; // Guardamos una copia
      console.log('eventos cargados:', eventos);
    });
  }

    async onSubmit() {
      const fechaFrom = new Date(this.formulario.get('fechaFrom')?.value);
      const fechaTo = new Date(this.formulario.get('fechaTo')?.value);
      
      // Validar que ambas fechas sean válidas
      if (!fechaFrom || !fechaTo) {
        console.error('Por favor seleccione ambas fechas');
        return;
      }
  
      // Ajustar fechaTo al final del día para incluir todos los eventos de ese día
      fechaTo.setHours(23, 59, 59, 999);
  
      // Filtrar los eventos que estén dentro del rango de fechas
      this.eventosData = this.eventosDataOriginal.filter(evento => {
        const fechaEvento = new Date(evento.fechaYHora);
        return fechaEvento >= fechaFrom && fechaEvento <= fechaTo;
      });
  
      console.log('Eventos filtrados:', this.eventosData);
    }

    async onClickDelete(evento: eventosData) {
      const response = await this.eventosService.deleteEvento(evento);
      // Actualizar ambas listas después de eliminar
      this.eventosDataOriginal = this.eventosDataOriginal.filter(e => e !== evento);
      this.eventosData = this.eventosData.filter(e => e !== evento);
      console.log('Evento eliminado:', response);
    }

  obtenerFechaHoraActual(): void {
    const fechaHoraActual = new Date();
    console.log('La fecha y hora actual es:', fechaHoraActual);
    // Aquí puedes hacer lo que necesites con la fecha y hora actual
  }

  private formatearFecha(fecha: Date): string {
    const dia = fecha.getDate().toString().padStart(2, '0');
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0');
    const año = fecha.getFullYear();
    return `${dia}/${mes}/${año}`;
  }

  private formatearHora(fecha: Date): string {
    const hora = fecha.getHours().toString().padStart(2, '0');
    const minutos = fecha.getMinutes().toString().padStart(2, '0');
    const segundos = fecha.getSeconds().toString().padStart(2, '0');
    return `${hora}:${minutos}:${segundos}`;
  }

  private convertirStringAHora(horaString: string): Date {
    const partesHora = horaString.split(':');
    const hora = parseInt(partesHora[0], 10);
    const minutos = parseInt(partesHora[1], 10);
    const segundos = parseInt(partesHora[2], 10);

    return new Date(0, 0, 0, hora, minutos, segundos); // Año y mes 0 representan la fecha base
  }

}
