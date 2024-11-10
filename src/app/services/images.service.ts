import { Injectable } from '@angular/core';
import { Auth, User } from '@angular/fire/auth';
import { StorageReference, getDownloadURL, getStorage, ref, uploadBytesResumable } from '@angular/fire/storage';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {


  constructor(private auth:Auth) { }

  private imagenesUsuarios:{[key:string]:string} = {
    admin: 'assets/admin.png',
    especialista: 'assets/especialista.png',
    especialista2: 'assets/especialista2.png',
    paciente: 'assets/paciente.png',
    paciente2: 'assets/paciente.png',
    paciente3: 'assets/paciente.png',
  };

  getImagenUsuario(usuario:string):string{
    return this.imagenesUsuarios[usuario];
  }

  async uploadFile(file: File): Promise<string> {
    const storage = getStorage();
    const userId = (await this.auth.currentUser)?.uid;
    const filePath = `imagenPerfil/${userId}/${file.name}`;
    const storageRef = ref(storage, filePath);
    const uploadTask = uploadBytesResumable(storageRef, file);
    return new Promise((resolve, reject) => {
      uploadTask.on('state_changed',
        null,
        (error) => reject(error),
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  }
  
}

