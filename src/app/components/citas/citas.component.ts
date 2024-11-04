import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import citasData from '../../interfaces/citasData.interface';
import { CitasDataService } from '../../services/citasData.service';
import { ClientesDataService } from '../../services/clientesData.service';

@Component({
  selector: 'app-citas',
  templateUrl: './citas.component.html',
  styleUrl: './citas.component.css'
})
export class CitasComponent implements OnInit {

  formulario: FormGroup;
  citasData: citasData[];
  citaDatos: any[] = [];
  clientes: any[] = []; // Array para almacenar la lista de clientes
  clienteSeleccionado: any = null; // Para guardar el cliente completo

  constructor(
    private citasService: CitasDataService,
    private clientesService: ClientesDataService // Inyectar el servicio de clientes
  ) {
    this.formulario = new FormGroup({
      selectedCliente: new FormControl(''), // Nuevo control para el select
      idCliente: new FormControl(''),
      nombresCliente: new FormControl(''), // Campo adicional para el nombre      
      fechaYHora: new FormControl(),
      tipoPago: new FormControl(),
      monto: new FormControl(),
    })

    this.citasData = [{
      idCliente: "Unu",
      nombresCliente: "Pepo",
      fechaYHora: "19-20-2020",
      tipoPago: "Anticipo",
      monto: 0
    }];

    this.citaDatos = [{
      idCliente: "Unu",
      nombresCliente: "Pepo",
      fechaYHora: "19-20-2020",
      tipoPago: "Anticipo",
      monto: 0
    }];
  }

  ngOnInit(): void {
    this.citasService.getCitas().subscribe(citas => {
      this.citasData = citas;
      console.log('Citas cargadas:', citas);
    });

    this.clientesService.getClientes().subscribe(clientes => {
      this.clientes = clientes;
      console.log('Clientes cargados:', clientes);
    });

    // Suscribirse a los cambios del select
    this.formulario.get('selectedCliente')?.valueChanges.subscribe(cliente => {
      if (cliente) {
        this.formulario.patchValue({
          idCliente: cliente.id,
          nombresCliente: cliente.nombres
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

    async onSubmit() {
      if (this.formulario.valid) {
        const nuevaCita: citasData = {
          idCliente: this.formulario.get('idCliente')?.value,
          nombresCliente: this.formulario.get('nombresCliente')?.value,
          fechaYHora: this.formulario.get('fechaYHora')?.value,
          tipoPago: this.formulario.get('tipoPago')?.value,
          monto: Number(this.formulario.get('monto')?.value)
        };
  
        console.log('Nueva cita a guardar:', nuevaCita);
        try {
          const response = await this.citasService.addCita(nuevaCita);
          console.log('Cita guardada exitosamente:', response);
          this.formulario.reset();
        } catch (error) {
          console.error('Error al guardar la cita:', error);
        }
      }
    }

  async onClickDelete(cita: citasData) {
    const response = await this.citasService.deleteCita(cita);
    console.log(this.citaDatos);
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
