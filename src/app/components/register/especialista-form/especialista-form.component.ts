import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import Swal from 'sweetalert2';
import { EspecialidadesComponent } from '../../especialidades/especialidades.component';
import { AuthService } from '../../../servicess/auth.service';
import { FirestoreService } from '../../../servicess/firestore.service';
import { Especialista } from '../../../models/models';
import { ROLES_ENUM } from '../../../enums/roles';
import { format } from 'date-fns';

@Component({
  selector: 'app-especialista-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, EspecialidadesComponent],
  templateUrl: './especialista-form.component.html',
  styleUrl: './especialista-form.component.scss',
})
export class EspecialistaFormComponent {
  showModal: boolean = false;
  especialidadesSeleccionadas: any[] = [];
  form!: FormGroup;
  imagenes : any;
  yaCargo : boolean = false;


  @Output() closeModal = new EventEmitter<void>();

  constructor(private authService: AuthService, private firestoreService: FirestoreService) {}

  abrirModalEspecialidades(): void {
    this.showModal = true;
  }

  cerrarModal(): void {
    this.showModal = false;
  }

  onEspecialidadesSeleccionadas(especialidades: any[]): void {
    this.especialidadesSeleccionadas = especialidades;

    console.log("parent onEspecialidadesSeleccionadas",this.especialidadesSeleccionadas)
  }

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
      ])
    });
  }

  imagenCargada(event :any){
    const input = event.target as HTMLInputElement;
    this.imagenes = input.files;
  }

 async registrarse() {
    let formValido = this.form.valid && (this.imagenes ? this.imagenes.length : 0 ) === 1 && this.especialidadesSeleccionadas.length >= 1;
    console.log("this.form.valid",this.form.valid);
    if(formValido){
      Swal.fire({
        title: 'Cargando...',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading(Swal.getConfirmButton());
        }
      });
      let credenciales = await this.authService.SingUp(
        this.form.value.email,
        this.form.value.clave,
        'Especialista'
      );
      let foto: string;
      foto = await this.firestoreService.guardarFoto(this.imagenes[0],"usuarios");

      let especialista: Especialista = {
        id: credenciales,
        nombre: this.form.value.nombre,
        apellido: this.form.value.apellido,
        edad: this.form.value.edad,
        dni: this.form.value.dni,
        email: this.form.value.email,
        password: this.form.value.clave,
        cuentaHabilitada: false,
        especialidades: this.especialidadesSeleccionadas.map((element)=> element.especialidad),
        urlFoto: foto,
        rol: ROLES_ENUM.ESPECIALISTA,
        fechaAlta: format(new Date(), 'yyyy-MM-dd HH:mm')
      }

      console.log(especialista);
      this.firestoreService.save(especialista,"especialistas")
      this.form.reset()
      Swal.close()
    }else{
      Swal.fire("ERROR","Verifique los campos de enviar","error");
    }
  }
}
