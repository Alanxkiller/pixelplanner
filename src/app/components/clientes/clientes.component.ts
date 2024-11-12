import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import clientesData from '../../interfaces/clientesData.interface';
import { ClientesDataService } from '../../services/clientesData.service';


@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.css'
})
export class ClientesComponent implements OnInit {

  formulario: FormGroup;
  clientesData: clientesData[];
  clienteDatos: any[] = [];


  constructor(
    private clientesService: ClientesDataService
  ) {
    this.formulario = new FormGroup({
      nombres: new FormControl(),
      apellidos: new FormControl(),
      telefono: new FormControl(),
      correo: new FormControl(),
    })

    this.clientesData = [{
      nombres: "Cargando...",
      apellidos: "Cargando...",
      telefono: 0,
      correo: "Cargando..."
    }];

    this.clienteDatos = [{
      nombres: "Cargando...",
      apellidos: "Cargando...",
      telefono: 0,
      correo: "Cargando..."
    }];
  }

  ngOnInit(): void {
    this.clientesService.getClientes().subscribe(clientes => {
      this.clientesData = clientes;
      console.log(clientes);
    })
  }

  async onSubmit() {
    console.log(this.formulario.value)
    //const fechaHoraActual = new Date();
    //const fechaFormateada = this.formatearFecha(fechaHoraActual);
    //const horaFormateada = this.formatearHora(fechaHoraActual);
    //console.log('La fecha y hora actual es:', fechaFormateada, horaFormateada);
    //console.log('La fecha y hora actual es:', fechaHoraActual);
    //this.formulario.value.entrada = horaFormateada;
    const response = await this.clientesService.addCliente(this.formulario.value);
    console.log(response);
  }

  async onClickDelete(cliente: clientesData) {
    const response = await this.clientesService.deleteCliente(cliente);
    console.log(this.clienteDatos);
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
