import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FirestoreService } from '../../../servicess/firestore.service';
import { AuthService } from '../../../servicess/auth.service';
import Swal from 'sweetalert2';
import { DetallesUsuarioComponent } from '../../detalles-usuario/detalles-usuario.component';
import { EncuestaComponent } from '../../encuesta/encuesta.component';
import { GrillaBotonesComponent } from '../grilla-botones/grilla-botones.component';
@Component({
  selector: 'app-mis-turnos',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, DetallesUsuarioComponent, EncuestaComponent, GrillaBotonesComponent],
  templateUrl: './mis-turnos.component.html',
  styleUrl: './mis-turnos.component.scss'
})
export class MisTurnosComponent {
  cargando:boolean = false;
  turnos: any;
  turnosFiltrados: any;
  usuario:any;
  isEncuestaPacienteModalOpen:boolean = false;
  isFiltrosModalOpen:boolean = false;
  pacienteTurnoSeleccionado:any;
  especialistaTurnoSeleccionado:any;
  turnoSeleccionado:any;
  limpiarFiltrosActive: boolean= false;
  especialistas:any;
  especialistasFiltrados:any;
  especialistaFiltrado: any;
  pacientes:any;
  pacienteFiltrado: any;
  especialidades:any;
  especialidadFiltrado: any;
  isFinalizarTurnoModalOpen: boolean = false;
  form!: FormGroup;
  lista : any;


  constructor(private firestoreService: FirestoreService, private authService: AuthService) {
    this.form = new FormGroup({
      especialidad: new FormControl('', [Validators.required]),
      especialista: new FormControl('', [Validators.required]),
      paciente: new FormControl(''),
    });
  }

  async ngOnInit(){
    this.cargando = true;
    this.turnos = await this.firestoreService.get('turnos');
    this.especialidades = await this.firestoreService.get('especialidades');
    this.especialistas = await this.firestoreService.get('especialistas');
    this.pacientes = await this.firestoreService.get('pacientes');
    this.authService.getUserRole().subscribe((response) => {
      this.usuario = response;
      this.cargarTurnos();
    }
    );
    this.cargando = false;
  }


  manejadorSeleccionarEspecialidad(especialidad: any) {
    // console.log('Especialidad seleccionada:', especialidad);
    this.especialistasFiltrados = this.especialistas.filter((element: any) =>
      element.especialidades.includes(especialidad.especialidad)
    );
    if (this.especialistasFiltrados.length === 0) {
      Swal.fire('', 'No hay especialistas para esa especialidad', 'info');
      this.especialidadFiltrado = null;
    }else{
      if(this.especialidadFiltrado != especialidad){
        this.especialistaFiltrado = null;
        this.pacienteFiltrado = null;
      }
      this.especialidadFiltrado = especialidad;
    }
  }
  manejadorSeleccionarEspecialista(especialista: any) {
    // console.log('Especialista seleccionado:', especialista);
      this.especialistaFiltrado = especialista;
  }
  manejadorSeleccionarPaciente(paciente: any) {
    // console.log('Paciente seleccionado:', paciente);
    this.pacienteFiltrado = paciente;
  }
  cerrarFiltrosModal(){
    this.isFiltrosModalOpen = false;
  }
  
  aplicarFiltros(turnosFiltrados: any[]){
    
    let aux : any[]=[];
    turnosFiltrados.forEach((turno:any)=>{
      turno.dia.forEach((dia:any) =>{
        dia.hora.forEach((hora:any) =>{
          if((this.usuario.role == "Paciente" && hora.paciente.email == this.usuario.email) ||
          (this.usuario.role == "Especialista" && hora.especialista.email == this.usuario.email) ||
          (this.usuario.role == "Administrador")){
            let turnoFormateado = this.crearFormatoTurno(turno,dia,hora);
            aux.push(turnoFormateado);
          }
        });
      });
    });
    this.lista = aux;
  }

  private async cargarTurnos(paciente?:any){
    let aux: any[] = [];
    if(this.limpiarFiltrosActive){
      this.turnos = await this.firestoreService.get('turnos');
      this.limpiarFiltrosActive = false;
    }

    this.turnos.forEach((turno:any) =>{
      turno.dia.forEach((dia:any) =>{
        dia.hora.forEach((hora:any) =>{
          if((this.usuario.role == "Paciente" && hora.paciente.email == this.usuario.email) ||
          (this.usuario.role == "Especialista" && hora.especialista.email == this.usuario.email) ||
          (this.usuario.role == "Administrador"))
          { 
            let turnoFormateado = this.crearFormatoTurno(turno,dia,hora);
            aux.push(turnoFormateado);
          }
        });
      });
    });
    this.lista = aux;

  }
    
  private crearFormatoTurno(turno:any,dia:any,hora:any){
    let turnoFormateado : any = {};
    turnoFormateado.especialistaId = turno.especialista.email
    turnoFormateado.especialista = turno.especialista.apellido
    turnoFormateado.especialistaObj = turno.especialista
    turnoFormateado.fecha = new Date(dia.fecha)
    turnoFormateado.especialidad = dia.especialidad.especialidad
    turnoFormateado.especialidadObj = dia.especialidad
    turnoFormateado.horario = hora.horario
    turnoFormateado.estado = hora.estado
    turnoFormateado.paciente = hora.paciente
    turnoFormateado.turnoObj = turno;
    turnoFormateado.comentario = hora.comentario;
    turnoFormateado.diagnostico = hora.diagnostico;
    return turnoFormateado;
  }


  filtrar(){
    this.isFiltrosModalOpen=true;
  }
  sonFechasIguales(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    );
  }
  async agregarEstado(turno:any,fecha:any,horaParam:any,comentario:any="",estado:any,diagnostico:any=""){
    const promises: Promise<any>[] = [];
    let retorno = false;
     turno.dia.forEach( (dia:any) => {
       dia.hora.forEach((hora:any) => {
        if(hora.horario === horaParam && this.sonFechasIguales(new Date(dia.fecha),fecha)){
          hora.comentario = comentario;
          hora.estado = estado;
          hora.diagnostico = diagnostico;
          retorno = true;
          console.log("turno con estado", turno);
          promises.push(this.firestoreService.updateTurno(turno, "turnos"));
        }
      });
    });
    await Promise.all(promises);
    return retorno;
  }


  async rechazarTurno(turno:any){
    
    const result = await Swal.fire({
      title: 'Rechazar turno',
      text: 'Ingrese un comentario del porque se rechaza:',
      input: 'text',
      heightAuto: false,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Atras',
      showLoaderOnConfirm: true,
      preConfirm: (async (comentario) => {
        if(await this.agregarEstado(turno.turnoObj,turno.fecha,turno.horario,comentario,"Rechazado")){
          Swal.fire("OK","Turno rechazado de manera correcta","success");
          await this.cargarTurnos();
        }
      }),
      allowOutsideClick: () => !Swal.isLoading()
    });
  }


  async aceptarTurno(turno:any){
    Swal.fire({
      title: "Esta seguro que quiere aceptar el turno ?",
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: `Atras`,
      showLoaderOnConfirm: true,
      preConfirm: (async (comentario) => {
        if(await this.agregarEstado(turno.turnoObj,turno.fecha,turno.horario,"","Aceptado")){
          Swal.fire("OK","Turno aceptado de manera correcta","success");
          await this.cargarTurnos();
        }
      }),
      allowOutsideClick: () => !Swal.isLoading()
    })
  }
  async finalizarTurno(turno: any) {
    this.isFinalizarTurnoModalOpen= true;
    this.turnoSeleccionado= turno;
  }

  async cerrarFinalizarTurnoModal(){

    await Swal.fire({
      title: "Finalizar Turno",
      html:
        '<input type="text" id="comentario" class="swal2-input" placeholder="Comentario">',
      showDenyButton: true,
      confirmButtonText: "Aceptar",
      denyButtonText: "Atras",
      showLoaderOnConfirm: true,
      preConfirm: async () => {
        const comentarioInput = document.getElementById("comentario") as HTMLInputElement;
  
        const comentarioValue = comentarioInput.value;

        console.log(comentarioValue)
  
       if (await this.agregarEstado(this.turnoSeleccionado.turnoObj, this.turnoSeleccionado.fecha, this.turnoSeleccionado.horario, comentarioValue,"Realizado")) {
          Swal.fire("OK", "Turno finalizado de manera correcta", "success");
          await this.cargarTurnos();
        }
      },
      allowOutsideClick: () => !Swal.isLoading()
    });
  }

  async cancelarTurno(turno:any){
    
    const result = await Swal.fire({
      title: 'Cancelar turno',
      text: 'Ingrese un comentario del porque se cancela:',
      input: 'text',
      heightAuto: false,
      inputAttributes: {
        autocapitalize: 'off'
      },
      showCancelButton: true,
      confirmButtonText: 'Aceptar',
      cancelButtonText: 'Atras',
      showLoaderOnConfirm: true,
      preConfirm: (async (comentario) => {
        if(await this.agregarEstado(turno.turnoObj,turno.fecha,turno.horario,comentario,"Cancelado")){
          Swal.fire("OK","Turno cancelado de manera correcta","success");
          await this.cargarTurnos();
        }
      }),
      allowOutsideClick: () => !Swal.isLoading()
    });
  }


  verComentario(turno:any){
    if (turno.diagnostico) {
      Swal.fire({
        title: 'Información del turno',
        html: `Comentario: ${turno.comentario}<br>Diagnóstico: ${turno.diagnostico}`,
        icon: 'info',
      });
    } else {
      if(turno.estado === "Cancelado"){
        Swal.fire({
          title: 'Turno cancelado por: ',
          text: turno.comentario,
          icon: 'info',
        });
      }else{
        Swal.fire({
          title: 'Turno rechazado por: ',
          text: turno.comentario,
          icon: 'info',
        });
      }
    }
  }


  verEspecialista(turno:any){
    this.especialistaTurnoSeleccionado= turno.especialistaObj;
  }
  verPaciente(turno:any){
    this.pacienteTurnoSeleccionado= turno.paciente;
  }
  completarEncuesta(turno:any){
    this.isEncuestaPacienteModalOpen= true;
    this.turnoSeleccionado= turno;
  }
  completarExperiencia(turno:any){
    // const dialogRef = this.dialog.open(EncuestaComponent, {
    //   data: {datos : turno, tipo: "Experiencia"},
    //   width: 'auto',
    // });
    // dialogRef.afterClosed().subscribe((result:any) => {
    // });
  }
  async limpiarFiltros(){
    this.cargando = true;
    this.turnosFiltrados = null;
    this.pacienteFiltrado = null;
    this.especialidadFiltrado = null;
    this.especialistaFiltrado = null;
    this.especialistasFiltrados = null;
    this.limpiarFiltrosActive= true;
    await this.cargarTurnos();
    this.cargando = false;
  }
}