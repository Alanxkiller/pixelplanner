import { Injectable } from '@angular/core';
import { Firestore, addDoc, collection, collectionData, deleteDoc, doc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import citasData from '../interfaces/citasData.interface';

@Injectable({
  providedIn: 'root'
})
export class CitasDataService {

  constructor(private firestore: Firestore) { }

  addCita(data: citasData) {
    const placeRef = collection(this.firestore, 'citas');
    return addDoc(placeRef, data);
  }

  getCitas(): Observable<citasData[]> {
    const placeRef = collection(this.firestore, 'citas');
    return collectionData(placeRef, { idField: 'id' }) as Observable<citasData[]>;
  }

  deleteCita(data: citasData) {
    const placeDocRef = doc(this.firestore, `citas/${data.id}`);
    return deleteDoc(placeDocRef);
  }

}
