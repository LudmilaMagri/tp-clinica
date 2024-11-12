import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import Swal from 'sweetalert2';
import { FirestoreService } from '../../../servicess/firestore.service';
import { AuthService } from '../../../servicess/auth.service';
@Component({
  selector: 'app-grilla-botones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './grilla-botones.component.html',
  styleUrl: './grilla-botones.component.scss',
})
export class GrillaBotonesComponent {
  especialidades: any;
  especialistas: any;
  pacientes: any;
  especialistasFiltrados: any;
  cargando: boolean = false;
  indice = 0;
  usuario: any;
  @Output() seleccionarEspecialidadEvent = new EventEmitter<any>();
  @Output() seleccionarEspecialistaEvent = new EventEmitter<any>();
  @Output() seleccionarPacienteEvent = new EventEmitter<any>();

  constructor(private firestoreService: FirestoreService, private authService: AuthService){}


  async ngOnInit() {
    this.cargando = true;
    this.especialidades = await this.firestoreService.get('especialidades');
    this.especialistas = await this.firestoreService.get('especialistas');
    this.pacientes = await this.firestoreService.get('pacientes');
    this.authService
      .getUserRole()
      .subscribe((response) => (this.usuario = response));
    this.cargando = false;
  }
  
  seleccionarEspecialidad(especialidad: any) {
    this.especialistasFiltrados = this.especialistas.filter((element: any) =>
      element.especialidades.includes(especialidad.especialidad)
    );
    if (this.especialistasFiltrados.length === 0) {
      Swal.fire('', 'No hay especialistas para esa especialidad', 'info');
    } else {
      this.indice = 1;
      this.seleccionarEspecialidadEvent.emit(especialidad);
    }
  }
  seleccionarEspecialista(especialista: any) {
    this.seleccionarEspecialistaEvent.emit(especialista);
     console.log('this.usuario', this.usuario);
    if (this.usuario.role === 'Administrador') {
      console.log('entre');

      this.indice = 2;
    }
  }
  seleccionarPaciente(paciente: any) {
    this.seleccionarPacienteEvent.emit(paciente);
  }
}