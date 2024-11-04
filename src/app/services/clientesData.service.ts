import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import clientesData from '../interfaces/clientesData.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientesDataService {

  constructor(private firestore: Firestore) { }

  addCliente(data: clientesData) {
    const placeRef = collection(this.firestore, 'clientes');
    return addDoc(placeRef, data);
  }

  getClientes(): Observable<clientesData[]> {
    const placeRef = collection(this.firestore, 'clientes');
    return collectionData(placeRef, { idField: 'id' }) as Observable<clientesData[]>;
  }

  deleteCliente(data: clientesData) {
    const placeDocRef = doc(this.firestore, `clientes/${data.id}`);
    return deleteDoc(placeDocRef);
  }
}
