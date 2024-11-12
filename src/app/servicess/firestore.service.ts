import { Injectable, inject } from '@angular/core';
import { DocumentSnapshot, Firestore, addDoc, collection, doc, getDoc, getDocs, query, setDoc, updateDoc, where,DocumentData } from '@angular/fire/firestore';
import { Storage, getDownloadURL, ref, uploadBytes, uploadBytesResumable } from '@angular/fire/storage';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirestoreService {
  private storage = inject(Storage);


  constructor(private firestore: Firestore) {}
  save(data: any, path: string) {
    const col = collection(this.firestore, path);
    addDoc(col, data);
  }
  async existeDni(dni:string, tipoUsuario: string):Promise<boolean>{
    const mensajeRef = collection(this.firestore,tipoUsuario)
      const q = query(mensajeRef,where("dni",'==',dni))
      const snapshot = await getDocs(q);
      return snapshot.docs.length !== 0;
  }
  async get(path: string): Promise<any[]> {
    const col = collection(this.firestore, path);
    try {
      const querySnapshot = await getDocs(col);
      const data = querySnapshot.docs.map(doc => doc.data());
      return data;
    } catch (error) {
      throw error;
    }
  }
  async update (data: any,ruta:string, docId: any){
    let retorno = false;
    const ref = collection(this.firestore, ruta);
    const documento = doc(ref,docId)
      await updateDoc(documento,data)
        .then((respuesta)=>{
          retorno = true;
        })
        .catch((error) => {
      });
      return retorno;
  }
  
  async getDocumentByFields(collectionName: string, fields: any): Promise<DocumentSnapshot<any>[]> {
    const collectionRef = collection(this.firestore, collectionName);
    let q = query(collectionRef);
    for (const field in fields) {
      if (fields.hasOwnProperty(field)) {
        q = query(q, where(field, '==', fields[field]));
      }
    }
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs;
  }
  async guardarFoto(dataUrl:any,ruta:string){
    let hora = new Date().getTime();
    let ubicacion = "/"+ruta+"/"+ hora; //le digo la ubicacion de la foto en el firebaseStorage
    const imgRef = ref(this.storage,ubicacion)
    
    return await uploadBytes(imgRef,dataUrl).then(async()=>{
      return await getDownloadURL(imgRef)
        .then( async (imgUrl) => {
          return imgUrl;
       });
    })
  }

  async getEspecialistaPorEmail(email:string):Promise<any>{
    const mensajeRef = collection(this.firestore,'especialistas')
      const q = query(mensajeRef,where("email",'==',email))
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const datosEspecialista = snapshot.docs[0].data() as DocumentData;
        return datosEspecialista;
      } else {
        return null; // Retornar null si no se encuentra ningún documento
      }
  }
  
  async updateTurno (data: any, path:string){
    let retorno = false;
    const usuarioRef = collection(this.firestore,path);
      const documento = doc(usuarioRef,data.id)
      await updateDoc(documento,data)
        .then((respuesta)=>{
          retorno = true;
        })
        .catch((error) => {
      });
      return retorno;
  }
  
  async updateWithId(data: any, path:string){
    let retorno = false;
    const usuarioRef = collection(this.firestore,path);
    console.log("usuarioRef", data.id);
      const documento = doc(usuarioRef,data.id)
      await updateDoc(documento,data)
        .then((respuesta)=>{
          retorno = true;
        })
        .catch((error) => {
      });
      return retorno;
  }
  async saveWithId(data: any, path: string) {
    const col = collection(this.firestore, path);
    console.log("Col",col);
    const docs = doc(col);
    data.id = docs.id;
    console.log(data);
    setDoc(docs, data);
  }
}