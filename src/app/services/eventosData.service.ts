import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { updateDoc } from '@angular/fire/firestore';
import eventosData from '../interfaces/eventosData.interface';

@Injectable({
  providedIn: 'root'
})
export class EventosDataService {

  constructor(private firestore: Firestore) { }

  addEvento(data: eventosData) {
    const placeRef = collection(this.firestore, 'eventos');
    return addDoc(placeRef, data);
  }

  getEventos(): Observable<eventosData[]> {
    const placeRef = collection(this.firestore, 'eventos');
    return collectionData(placeRef, { idField: 'id' }) as Observable<eventosData[]>;
  }

  deleteEvento(data: eventosData) {
    const placeDocRef = doc(this.firestore, `eventos/${data.id}`);
    return deleteDoc(placeDocRef);
  }

  actualizarEvento(data: eventosData) {
    const placeDocRef = doc(this.firestore, `eventos/${data.id}`);
    const plainData = this.convertToPlainObject(data);
    return updateDoc(placeDocRef, plainData);
  }

  private convertToPlainObject(data: eventosData): { [key: string]: any } {
    return {
      idCliente: data.idCliente,
      nombresCliente: data.nombresCliente,
      nombreEvento: data.nombreEvento,
      dirEvento: data.dirEvento,
      fechaYHora: data.fechaYHora,
      idPaquete: data.idPaquete,
      nombrePaquete: data.nombrePaquete,
      monto: data.monto,
      montoPagado: data.montoPagado
    };
  }
  
}
