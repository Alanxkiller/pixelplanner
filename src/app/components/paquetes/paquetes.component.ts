import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';
import paquetesData from '../../interfaces/paquetesData.interface';
import { PaquetesDataService } from '../../services/paquetesData.service';

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styleUrl: './paquetes.component.css'
})
export class PaquetesComponent {

  formulario: FormGroup;
  paquetesData: paquetesData[];
  paqueteDatos: any[] = [];

  constructor(
    private paquetesService: PaquetesDataService
  ) {
    this.formulario = new FormGroup({
      nomPaquete: new FormControl(),
      descPaquete: new FormControl(),
    })

    this.paquetesData = [{
      nomPaquete: "Cargando...",
      descPaquete: "Cargando...",
    }];

    this.paqueteDatos = [{
      nomPaquete: "Cargando...",
      descPaquete: "Cargando...",
    }];
  }

  ngOnInit(): void {
    this.paquetesService.getPaquetes().subscribe(paquetes => {
      this.paquetesData = paquetes;
      console.log(paquetes);
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
    const response = await this.paquetesService.addPaquete(this.formulario.value);
    console.log(response);
  }

  async onClickDelete(paquete: paquetesData) {
    const response = await this.paquetesService.deletePaquete(paquete);
    console.log(this.paqueteDatos);
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
