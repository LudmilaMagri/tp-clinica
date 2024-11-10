import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import Swal from 'sweetalert2';
import { AuthService } from '../../../servicess/auth.service';
import { Paciente } from '../../../models/models';
import { ROLES_ENUM } from '../../../enums/roles';
import { FirestoreService } from '../../../servicess/firestore.service';
@Component({
  selector: 'app-paciente-form',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatProgressSpinnerModule, ReactiveFormsModule],
  templateUrl: './paciente-form.component.html',
  styleUrl: './paciente-form.component.scss',
})
export class PacienteFormComponent {
  form!: FormGroup;
  imagenes : any;
  yaCargo : boolean = false;
  constructor(
    private authService: AuthService,
    private router: Router,
    private fireStoreService: FirestoreService
  ) {}
  ngOnInit() {
    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      clave: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
      nombre: new FormControl('', [Validators.required]),
      apellido: new FormControl('', [Validators.required]),
      edad: new FormControl('', [
        Validators.required,
        Validators.min(18),
        Validators.max(99),
      ]),
      dni: new FormControl('', [
        Validators.required,
        Validators.pattern('^[0-9]{1,3}?[0-9]{3,3}?[0-9]{3,3}$'),
      ]),
      obraSocial: new FormControl('', [Validators.required]),
    });
  }
  imagenCargada(event :any){
    const input = event.target as HTMLInputElement;
    this.imagenes = input.files;
  }
  async registrar() {
    const dniExiste = await this.fireStoreService.existeDni(this.form.value.dni, 'pacientes');
    if (dniExiste) {
      Swal.fire({
        icon: 'error',
        title: 'El dni ingresado ya existe',
      });
      return;
    }
    if (this.form.valid && (this.imagenes ? this.imagenes.length : 0 ) === 2) {
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(null);
        },
      });
      let credenciales = await this.authService.SingUp(
        this.form.value.email,
        this.form.value.clave,
        'Paciente'
      );
      console.log("credenciales",credenciales);
      let fotos: string[] = [];
      for (let i = 0; i < this.imagenes.length; i++) {
        fotos.push(await this.fireStoreService.guardarFoto(this.imagenes[i],"usuarios"))
      }
      let paciente: Paciente = {
        id: credenciales,
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        edad: this.form.value.edad,
        dni: this.form.value.dni,
        email: this.form.value.email,
        password: this.form.value.clave,
        cuentaHabilitada: false,
        obraSocial: this.form.value.obraSocial,
        urlFotos: fotos,
        rol: ROLES_ENUM.PACIENTE,
      };
      console.log("paciente", paciente);
      this.fireStoreService.save(paciente, 'pacientes');
      this.form.reset();
      Swal.close();
      this.router.navigate(['/bienvenido']);
    } else {
      Swal.fire('ERROR', 'Verifique el formulario antes de enviar', 'error');
    }
  }
}