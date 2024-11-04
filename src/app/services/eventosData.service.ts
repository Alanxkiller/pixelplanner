import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
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
  
}
