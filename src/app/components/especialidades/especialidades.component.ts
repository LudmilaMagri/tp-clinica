import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FirestoreService } from '../../servicess/firestore.service';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-especialidades',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './especialidades.component.html',
  styleUrl: './especialidades.component.scss',
})
export class EspecialidadesComponent {
  @Output() especialidadesSeleccionadasEvent = new EventEmitter<any[]>();
  @Output() cerrarModal = new EventEmitter<void>();
  especialidadesFromDB: any[] =[];
  form!: FormGroup;
  constructor(private firestoreService: FirestoreService) {
    this.form = new FormGroup({
      especialidad: new FormControl('', [Validators.required]),
    });
  }
  async ngOnInit() {
    await this.getEspecialidadesFromDB();
  }
  
  onEspecialidadChange(especialidad: any) {
    especialidad.estaMarcado = !especialidad.estaMarcado;
    const especialidadesSeleccionadas = this.especialidadesFromDB.filter(e => e.estaMarcado);
    this.especialidadesSeleccionadasEvent.emit(especialidadesSeleccionadas);
  }
  async getEspecialidadesFromDB(){
    await this.firestoreService.get("especialidades").then((response) => {
      this.especialidadesFromDB = [];
      response.forEach(data => {
        this.especialidadesFromDB.push({
          especialidad: data['especialidad'],
          estaMarcado: false
        });
      })
      console.log("getEspecialidadesFromDB", this.especialidadesFromDB);
    }).catch((err) =>
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: err.message,
        showConfirmButton: false,
        timer: 1500,
      })
    );
  }
  onClose(): void {
    this.cerrarModal.emit();
  }
  agregarEspecialidadBd() {
    if (this.form.valid) {
      let especialidadNueva = {
        especialidad: this.form.value.especialidad
      }
      this.firestoreService.save(especialidadNueva, 'especialidades');
      console.log('Especialidad guardada con éxito');
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Especialidad agregada con exito.',
      });
      this.form.value.especialidad = "";
      this.getEspecialidadesFromDB();
    }
  }
}