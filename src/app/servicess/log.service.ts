import { Injectable } from '@angular/core';
import { addDoc, collection, Firestore } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root'
})
export class LogService {
  constructor(private firestore: Firestore) { }
  logIntoDb(collectionInFE: string, objectToLog : any){
      addDoc(collection(this.firestore, collectionInFE), objectToLog)
  }
}