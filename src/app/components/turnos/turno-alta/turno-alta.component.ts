import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GrillaBotonesComponent } from '../grilla-botones/grilla-botones.component';
import Swal from 'sweetalert2';
import { AuthService } from '../../../servicess/auth.service';
import { FirestoreService } from '../../../servicess/firestore.service';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { ROLES_ENUM } from '../../../enums/roles';


@Component({
  selector: 'app-turno-alta',
  standalone: true,
  imports: [CommonModule, GrillaBotonesComponent, ReactiveFormsModule ],
  templateUrl: './turno-alta.component.html',
  styleUrl: './turno-alta.component.scss'
})
export class TurnoAltaComponent {
  form!: FormGroup;
  usuario: any;
  especialistas: any;
  especialidades: any;
  pacientes: any;
  especialistasFiltrados: any;
  horarios: any;
  cargandoHorarios: boolean = false;
  turnosCargados: any;
  cargando:boolean = false;
  mostrarHoras: boolean = false;

  diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];

  constructor(private authService: AuthService, private firestoreService: FirestoreService){
    this.form = new FormGroup({
      especialidad: new FormControl('', [Validators.required]),
      espeialista: new FormControl('', [Validators.required]),
      paciente: new FormControl(''),
    });
  }

  async ngOnInit(){
    this.cargando = true;
    this.authService.getUserRole().subscribe((response) => (this.usuario = response));
    this.especialidades = await this.firestoreService.get('especialidades');
    this.especialistasFiltrados = await this.firestoreService.get('especialistas');
    this.pacientes = await this.firestoreService.get('pacientes');
    this.cargando = false;
  }

  manejadorSeleccionarEspecialidad(especialidad: any) {
     console.log('Especialidad seleccionada:', especialidad);
    this.form.get('especialidad')?.setValue(especialidad);
  }

  manejadorSeleccionarEspecialista(especialista: any){
    this.form.get('especialista')?.setValue(especialista);
    if(this.usuario.role != 'Administrador'){
      this.traerHorarios();
    }
  }

  manejadorSeleccionarPaciente(paciente: any){
    this.form.get('paciente')?.setValue(paciente);
    this.traerHorarios();
  }

  filtarEspecialista (){
    this.horarios = [];
    this.form.get('especialista')?.reset();
    this.especialistasFiltrados = this.especialistas.filter((element:any) =>
      element.data.datos.especialidades.includes(
      this.form.value.especialidad.data.nombre
    )
  );
}

async traerHorarios() {
  if (!this.form.value.especialista || !this.form.value.especialidad) return;

  this.cargandoHorarios = true;
  this.turnosCargados = await this.firestoreService.get('turnos');
  this.turnosCargados = this.turnosCargados.filter(
    (element: any) =>
      element.especialista.email === this.form.value.especialista.email
  );

  //FILTRO POR ESPECIALIDAD Y ESPECIALISTA
  this.horarios = await this.firestoreService.get('horarios');
  this.horarios = this.horarios.filter((element: any) => {
    element.horariosCalculados = element.horariosCalculados.filter(
      (element2: any) => {
        return (
          element2.especialidad === this.form.value.especialidad.especialidad
        );
      }
    );
    return element.especialista === this.form.value.especialista.email;
  });

  //VERIFICO SI NO HAY TURNOS EN ESE HORARIO
  if (this.horarios[0]?.horariosCalculados) {
    let aux: any[] = [];
    for (let diaTrabajo of this.horarios[0].horariosCalculados) {
      aux = aux.concat(this.obtenerProximosTurnosParaDia(diaTrabajo));
    }
    aux = aux.sort((a: any, b: any) => {
      return a.fecha - b.fecha;
    });
    this.horarios[0].horariosCalculados = aux;

    this.horarios[0].horariosCalculados =
      this.horarios[0]?.horariosCalculados.filter((element: any) => {
        element.horas = element.horas.filter((hora: any) => {
          return this.verificarDisponibilidadHorario(
            element.fecha,
            element.dia,
            hora
          );
        });
        return element;
      });
  }

  if (
    !this.horarios[0] ||
    this.horarios[0]?.horariosCalculados.length === 0
  ) {
    Swal.fire('No hay turnos disponibles para este especialista', '', 'info');
  }
  this.cargandoHorarios = false;
  // console.log('traerHOrarios terimando', this.horarios);
}

obtenerProximosTurnosParaDia(diaTrabajo: any) {
  let proximosTurnos = [];
  let dia = new Date().getDay();

  for (let i = 0; i < 15; i++) {
    let diaDeLaSemana = this.diasSemana[dia];
    if (diaDeLaSemana === diaTrabajo.dia) {
      var hoy = new Date();
      var fecha = new Date();
      fecha.setDate(hoy.getDate() + i);
      diaTrabajo.fecha = fecha;
      proximosTurnos.push({
        ...diaTrabajo,
      });
    }

    // Avanzar al siguiente día
    dia = (dia + 1) % 7;
  }

  return proximosTurnos;
}

sonFechasIguales(fecha1: Date, fecha2: Date): boolean {
  return (
    fecha1.getDate() === fecha2.getDate() &&
    fecha1.getMonth() === fecha2.getMonth() &&
    fecha1.getFullYear() === fecha2.getFullYear()
  );
}

verificarDisponibilidadHorario(fecha: any, dia: any, hora: any) {
  let retorno = true;

  for (let i = 0; i < this.turnosCargados.length; i++) {
    for (let k = 0; k < this.turnosCargados[i].dia.length; k++) {
      if (
        this.turnosCargados[i].dia[k].descripcion === dia &&
        this.sonFechasIguales(
          new Date(this.turnosCargados[i].dia[k].fecha),
          fecha
        )
      ) {
        for (let j = 0; j < this.turnosCargados[i].dia[k].hora.length; j++) {
          if (
            this.turnosCargados[i].dia[k].hora[j].horario.includes(
              hora.horario
            )
          ) {
            retorno = false;
            break;
          }
        }
      }
      if (!retorno) {
        break;
      }
    }
    if (!retorno) {
      break;
    }
  }
  return retorno;
}

verificarQueNoCargoTurnoConElEspecialista(
  turnosCargados: any,
  paciente: any
) {
  //console.log(turnosCargados);//element.data.dia[0].hora[0].paciente.id
  let retorno = true;
  //console.log(this.form.value.especialidad)
  turnosCargados.forEach((turno: any) => {
    turno.dia.forEach((dia: any) => {
      dia.hora.forEach((hora: any) => {
        if (
          dia.especialidad.especialidad ===
            this.form.value.especialidad.especialidad &&
          hora.paciente.email === paciente.email &&
          hora.estado === 'Pendiente'
        ) {
          retorno = false;
        }
      });
    });
  });

  return retorno;
}

async cargarTurno(fecha: any, dia: any, hora: any) {
  this.cargando = true;
  hora.disponible = false;
  hora.estado = 'Pendiente';

  console.log(this.usuario);
  if (this.usuario.role === 'Administrador') {
    hora.paciente = this.form.value.paciente;
  } else {
    if (this.usuario.role !== 'Administrador') {
      this.form.get('paciente')?.setValidators(Validators.required);
    }
    hora.paciente = this.pacientes.filter((paciente: any) => paciente.email == this.usuario.email)[0]
  }

  if (this.form.valid) {
    let data = {
      especialista: this.form.value.especialista,
      dia: [
        {
          descripcion: dia,
          hora: [hora],
          fecha: fecha.getTime(),
          especialidad: this.form.value.especialidad,
        },
      ],
    };
    console.log('Turno creado');
    // this.firestoreService.save(data, 'turnos');
    this.firestoreService.saveWithId(data, 'turnos');
    await this.traerHorarios();
    Swal.fire('OK', 'Turno solicitado de manera correcta', 'success');
  } else {
    Swal.fire('ERROR', 'Verifique los campos requeridos', 'error');
  }
  this.cargando = false;
}

habilitarHoras(horario: any) {
  horario.mostrar = !horario.mostrar;
}
}
