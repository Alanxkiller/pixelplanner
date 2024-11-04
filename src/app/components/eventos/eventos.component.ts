import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import eventosData from '../../interfaces/eventosData.interface';
import { ClientesDataService } from '../../services/clientesData.service';
import { EventosDataService } from '../../services/eventosData.service';
import { PaquetesDataService } from '../../services/paquetesData.service';

@Component({
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrl: './eventos.component.css'
})
export class EventosComponent implements OnInit {

  formulario: FormGroup;
  eventosData: eventosData[];
  eventoDatos: any[] = [];
  clientes: any[] = []; // Array para almacenar la lista de clientes
  clienteSeleccionado: any = null; // Para guardar el cliente completo
  paquetes: any[] = []; // Array para almacenar la lista de clientes
  paqueteSeleccionado: any = null; // Para guardar el cliente completo

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
    })

    this.eventosData = [{
      idCliente: "Cargando...",
      nombresCliente: "Cargando...",
      nombreEvento: "Cargando...",
      dirEvento: "Cargando...",
      fechaYHora: "Cargando...",
      idPaquete: "Cargando...",
      nombrePaquete: "Cargando...",
      monto: 42
    }];

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

  ngOnInit(): void {
    this.eventosService.getEventos().subscribe(eventos => {
      this.eventosData = eventos;
      console.log('eventos cargadas:', eventos);
    });

    this.clientesService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      console.log('Clientes cargados:', clientes);
    });

    this.paquetesService.getPaquetes().subscribe(paquetes => {
      this.paquetes = paquetes;
      console.log('Paquetes cargados:', paquetes);
    });

    // Suscribirse a los cambios del select de clientes
    this.formulario.get('selectedCliente')?.valueChanges.subscribe(cliente => {
      if (cliente) {
        this.formulario.patchValue({
          idCliente: cliente.id,
          nombresCliente: cliente.nombres
        });
      }
    });

    // Suscribirse a los cambios del select de paquetes
    this.formulario.get('selectedPaquete')?.valueChanges.subscribe(paquete => {
      if (paquete) {
        this.formulario.patchValue({
          idPaquete: paquete.id,
          nombrePaquete: paquete.nomPaquete
        });
      }
    });
  }

  // Modificar el método onClienteChange para usar el nuevo enfoque
  onClienteChange(event: any): void {
    const cliente = this.formulario.get('selectedCliente')?.value;
    if (cliente) {
      this.formulario.patchValue({
        idCliente: cliente.id,
        nombresCliente: cliente.nombres
      });
    }
  }

  // Modificar el método onClienteChange para usar el nuevo enfoque
  onPaqueteChange(event: any): void {
    const paquete = this.formulario.get('selectedPaquete')?.value;
    if (paquete) {
      this.formulario.patchValue({
        idPaquete: paquete.id,
        nombrePaquete: paquete.nomPaquete
      });
    }
  }

    async onSubmit() {
      if (this.formulario.valid) {
        const nuevoEvento: eventosData = {
          idCliente: this.formulario.get('idCliente')?.value,
          nombresCliente: this.formulario.get('nombresCliente')?.value,
          nombreEvento: this.formulario.get('nombreEvento')?.value,
          dirEvento: this.formulario.get('dirEvento')?.value,
          fechaYHora: this.formulario.get('fechaYHora')?.value,
          idPaquete: this.formulario.get('idPaquete')?.value,
          nombrePaquete: this.formulario.get('nombrePaquete')?.value,
          monto: Number(this.formulario.get('monto')?.value)
        };
  
        console.log('Nueva evento a guardar:', nuevoEvento);
        try {
          const response = await this.eventosService.addEvento(nuevoEvento);
          console.log('Evento guardada exitosamente:', response);
          this.formulario.reset();
        } catch (error) {
          console.error('Error al guardar la evento:', error);
        }
      }
    }

  async onClickDelete(evento: eventosData) {
    const response = await this.eventosService.deleteEvento(evento);
    console.log(this.eventoDatos);
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
