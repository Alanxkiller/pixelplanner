import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import paquetesData from '../interfaces/paquetesData.interface';

@Injectable({
  providedIn: 'root'
})
export class PaquetesDataService {
  
  constructor(private firestore: Firestore) { }

  addPaquete(data: paquetesData) {
    const placeRef = collection(this.firestore, 'paquetes');
    return addDoc(placeRef, data);
  }

  getPaquetes(): Observable<paquetesData[]> {
    const placeRef = collection(this.firestore, 'paquetes');
    return collectionData(placeRef, { idField: 'id' }) as Observable<paquetesData[]>;
  }

  deletePaquete(data: paquetesData) {
    const placeDocRef = doc(this.firestore, `paquetes/${data.id}`);
    return deleteDoc(placeDocRef);
  }

}
