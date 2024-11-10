import { Component } from '@angular/core';
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
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatProgressSpinnerModule,
    ReactiveFormsModule,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  form!: FormGroup;
  cargando: boolean = false;
  cuentaHabilitada: boolean = true;
  cargandoAccesoRapido: boolean = false;
  usuariosArr: any[] = [];
  // (3 pacientes, 2 especialistas, 1 admin)
  paciente1: any;
  paciente2: any;
  paciente3: any;
  especialista1: any;
  especialista2: any;
  admin: any;
  constructor(
    private authService: AuthService,
    private firestoreService: FirestoreService,
    private router: Router
  ) {}
  async ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      clave: new FormControl('', [
        Validators.required,
        Validators.minLength(4),
      ]),
    });
    await this.inicializarUsuarios();
  }
  async inicializarUsuarios() {
    let pacientesArr = await this.firestoreService.get('pacientes');
    this.paciente1 = pacientesArr.filter(
      (usuario: any) => usuario.email === 'pacienteTest@pacientetest.com'
    )[0];
    // this.paciente2 = pacientesArr.filter(
    //   (usuario: any) => usuario.email === 'pacienteTest@pacientetest.com'
    // )[0];
    // this.paciente3 = pacientesArr.filter(
    //   (usuario: any) => usuario.email === 'pacienteTest@pacientetest.com'
    // )[0];
    let especialistaArr = await this.firestoreService.get('especialistas');
    this.especialista1 = especialistaArr.filter(
      (usuario: any) => usuario.email === 'medico1@medico.com'
    )[0];
    this.especialista2 = especialistaArr.filter(
      (usuario: any) => usuario.email === 'medico2@medico2.com'
    )[0];
    let adminArr = await this.firestoreService.get('administradores');
    console.log(adminArr);
    this.admin = adminArr.filter(
      (usuario: any) => usuario.email === 'ludmila.magri5@gmail.com'
    )[0];
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
    this.cuentaHabilitada = this.usuariosArr.filter((usuario) => usuario.email === email)[0]?.cuentaHabilitada;
  }
  async ingresar() {
    if (this.form.valid) {
      await this.ValidarEmailHabilitado(this.form.value.email);
      if(this.cuentaHabilitada == true)
        {
        this.authService.SingIn(this.form.value.email, this.form.value.clave);
        this.router.navigate(['/bienvenido']);
      }else{
      }
    } else {
      Swal.fire('ERROR', 'Verifique los campos ingresados', 'error');
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