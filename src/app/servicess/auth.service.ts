import { Injectable } from '@angular/core';
import {
  Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, User, onAuthStateChanged, AuthError, authState, sendEmailVerification
} from '@angular/fire/auth';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { format } from 'date-fns';
import { Observable, Subject, from, map, of, switchMap } from 'rxjs';
import { LogService } from './log.service';
import { Firestore, doc, getDoc, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLogged$: Observable<User | null>;

  constructor(
    private auth: Auth,
    private router: Router,
    private firestoreService: Firestore,
    public logService: LogService
  ) {
    this.userLogged$ = authState(this.auth);
  }

  ngOnInit() {
    this.userLogged$.subscribe();
  }

  getLoggedUser(): Observable<User | null> {
    return this.userLogged$;
  }

  SingIn(email: string, password: string) {
    signInWithEmailAndPassword(this.auth, email, password)
      .then((userCredential) => {
        if(userCredential.user?.emailVerified){
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Logged In Succesfully',
          });
          this.logService.logIntoDb('logins', {
            user: email,
            logInDate: format(new Date(), 'yyyy-MM-dd HH:mm'),
          });
          this.router.navigate(['/home']);
        }else{
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: "No verifico su email.",
            showConfirmButton: false,
            timer: 1500,
          })
        }
      })
      .catch((err) =>
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.message,
          showConfirmButton: false,
          timer: 1500,
        })
      );
  }

  async SingUp(email: string, password: string, role: string):Promise<any> {
    try {
      const res = await createUserWithEmailAndPassword(this.auth, email, password).then(async (result) =>{
        if(this.auth.currentUser)
          (await sendEmailVerification(this.auth.currentUser)
            .then((resultado)=>{
                Swal.fire("OK","Mail de verificacion enviado, verifiquelo para ingresar","success");
            })
            .catch((error)=>{
              Swal.fire("ERROR","No se pudo enviar el mail de confirmacion","error");
            }))
            console.log("Then result", result);
            return result;
      });

      console.log("res", res);
      
      // Guardar el rol del usuario en Firestore
      await setDoc(doc(this.firestoreService, `users/${res.user?.uid}`), {
        email: email,
        role: role
      });

      return res.user?.uid;
      // this.router.navigate(['/home']);
    } catch (error: unknown) {
      let errorMessage = '';

      if (error instanceof Error) {
        switch ((error as AuthError).code) {
          case 'auth/invalid-email':
            errorMessage = 'El mail ingresado es invalido.';
            break;
          case 'auth/internal-error':
            errorMessage = 'Hubo un error interno de procesamiento.';
            break;
          case 'auth/weak-password':
            errorMessage = 'La contraseña ingresada es débil. Mínimo 6 caracteres.';
            break;
          case 'auth/missing-email':
            errorMessage = 'No se ha detectado un mail.';
            break;
          case 'auth/email-already-in-use':
            errorMessage = 'Ya existe una cuenta con el mail ingresado.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Hubo un problema de conexión. Chequea tu red.';
            break;
          default:
            errorMessage = 'Ocurrió un error inesperado. Por favor comunicate con el soporte.';
            break;
        }
        console.error('Error during sign up:', error);

        Swal.fire({
          position: 'center',
          icon: 'error',
          title: errorMessage,
          showConfirmButton: true,
          timer: 2500,
        });
      }
    }
  }

  SignOut() {
    signOut(this.auth).then(
      () => {
        this.router.navigate(['/login']);
      },
      (err) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: err.message,
          showConfirmButton: false,
          timer: 1500,
        });
      }
    );
  }
  
  getUserRole(): Observable<any> {
    return new Observable<User | null>(observer => {
      onAuthStateChanged(this.auth, user => {
        observer.next(user);
        observer.complete();
      });
    }).pipe(
      switchMap(user => {
        if (user) {
          const userDocRef = doc(this.firestoreService, `users/${user.uid}`);
          return from(getDoc(userDocRef)).pipe(
            map(docSnapshot => {
              if (docSnapshot.exists()) {
                return docSnapshot.data();
              } else {
                return null;
              }
            })
          );
        } else {
          return of(null);
        }
      })
    );
  }
}
