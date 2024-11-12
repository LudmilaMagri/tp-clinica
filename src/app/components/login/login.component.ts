import { Component, Inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { AuthService } from '../../servicess/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { FirestoreService } from '../../servicess/firestore.service';
import { ROLES_ENUM } from '../../enums/roles';
import {NgxCaptchaModule}  from 'ngx-captcha';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ CommonModule, MatCardModule, MatProgressSpinnerModule, ReactiveFormsModule, NgxCaptchaModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form!: FormGroup;
  cargando: boolean = false;
  cuentaHabilitada: boolean = true;
  cargandoAccesoRapido: boolean = false;
  usuariosArr: any[] = [];
  paciente1: any;
  paciente2: any;
  paciente3: any;
  especialista1: any;
  especialista2: any;
  admin: any;
  
    imagenesCargadas: number = 0;
    totalImagenes: number = 5; // Número total de imágenes a cargar

  siteKey = '6Lfw1noqAAAAAKhDMWUfFd0dtxlwkGWvX2kt_LrL';

  constructor(private authService: AuthService, private firestoreService: FirestoreService, private router: Router) {}

  // Este método se ejecutará cada vez que se cargue una imagen
  onImageLoad() {
    this.imagenesCargadas++;
    if (this.imagenesCargadas === this.totalImagenes) {
      // Cuando todas las imágenes se han cargado, se oculta el spinner
      this.cargandoAccesoRapido = false;
    }
  }
  async ngOnInit() {

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      clave: new FormControl('', [Validators.required,Validators.minLength(4)]),
     // recaptcha: new FormControl('', [Validators.required]),
    });
    await this.inicializarUsuarios();
  }

  executeRecaptchaVisible(captchaResponse: any){
    this.form.patchValue({recaptcha: captchaResponse});
  }
  


  async inicializarUsuarios() {
    this.cargandoAccesoRapido = true;

    //pacientes
    let pacientesArr = await this.firestoreService.get('pacientes');
    this.paciente1 = pacientesArr.filter(
      (usuario: any) => usuario.email === 'opsondip@mailnesia.com'
    )[0];
    this.paciente2 = pacientesArr.filter(
      (usuario: any) => usuario.email === 'etsednal@mailnesia.com'
    )[0];
    this.paciente3 = pacientesArr.filter(
      (usuario: any) => usuario.email === 'ibpes@mailnesia.com'
    )[0];

    //especialistas
    let especialistaArr = await this.firestoreService.get('especialistas');
    this.especialista1 = especialistaArr.filter(
      (usuario: any) => usuario.email === 'ocras@mailnesia.com'
    )[0];
    this.especialista2 = especialistaArr.filter(
      (usuario: any) => usuario.email === 'ars@mailnesia.com'
    )[0];

    //admin
    let adminArr = await this.firestoreService.get('administradores');
    console.log(adminArr);
    this.admin = adminArr.filter(
      (usuario: any) => usuario.email === 'ludmila.magri5@gmail.com'
    )[0];
    this.cargandoAccesoRapido = false;
  }


  get email() {
    return this.form.get('email');
  }
  get clave() {
    return this.form.get('clave');
  }

  async ValidarEmailHabilitado(email: string) {
    let pacientesArr = await this.firestoreService.get('pacientes');
    let adminArr = await this.firestoreService.get('administradores');
    let especialistaArr = await this.firestoreService.get('especialistas');

    this.usuariosArr = this.usuariosArr.concat(pacientesArr,adminArr,especialistaArr);

    //this.cuentaHabilitada = this.usuariosArr.filter((usuario) => usuario.email === email)[0]?.cuentaHabilitada;
    var usuario = this.usuariosArr.filter((usuario) => usuario.email === email)[0];
    this.cuentaHabilitada = usuario?.cuentaHabilitada;
  }


  async ingresar() {
    if (this.form.valid) {
      await this.ValidarEmailHabilitado(this.form.value.email);
      if(this.cuentaHabilitada == true)
        {
        this.authService.SingIn(this.form.value.email, this.form.value.clave);
        this.router.navigate(['/bienvenido']);
      }else {
        Swal.fire('ERROR', 'Verifique los campos ingresados', 'error');
      }
  }
}


  ingresoEspecialista(nroEspecialista: number) {
    if(nroEspecialista == 1){
      this.form.get('email')?.setValue(this.especialista1.email);
      this.form.get('clave')?.setValue(this.especialista1.password);
    }else if(nroEspecialista == 2){
      this.form.get('email')?.setValue(this.especialista2.email);
      this.form.get('clave')?.setValue(this.especialista2.password);
    }
  }
  ingresoPaciente(nroPaciente: number) {
    if(nroPaciente == 1){
      this.form.get('email')?.setValue(this.paciente1.email);
      this.form.get('clave')?.setValue(this.paciente1.password);
    }else if(nroPaciente == 2){
      this.form.get('email')?.setValue(this.paciente2.email);
      this.form.get('clave')?.setValue(this.paciente2.password);
    }else{
      this.form.get('email')?.setValue(this.paciente3.email);
      this.form.get('clave')?.setValue(this.paciente3.password);
    }
  }
  ingresoAdmin() {
    this.form.get('email')?.setValue(this.admin.email);
    this.form.get('clave')?.setValue(this.admin.password);
  }
}