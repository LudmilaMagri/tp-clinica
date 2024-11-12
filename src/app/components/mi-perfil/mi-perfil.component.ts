import { Component } from '@angular/core';
import { AuthService } from '../../servicess/auth.service';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidatorFn, Validators } from '@angular/forms';
import { FirestoreService } from '../../servicess/firestore.service';
import Swal from 'sweetalert2';
import { GrillaBotonesComponent } from '../turnos/grilla-botones/grilla-botones.component';
import { DetallesUsuarioComponent } from '../detalles-usuario/detalles-usuario.component';


@Component({
  selector: 'app-mi-perfil',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, GrillaBotonesComponent, DetallesUsuarioComponent],
  templateUrl: './mi-perfil.component.html',
  styleUrl: './mi-perfil.component.scss'
})
export class MiPerfilComponent {
  form!: FormGroup;
  usuario : any;
  especialista:any
  especialidades:any;
  cargando : boolean = false;
  tieneHorarios : boolean = false;
  horarios : any[] = [];
  constructor(private authService: AuthService, private firestoreService: FirestoreService) {
  }
  
 async ngOnInit() {
    this.form = new FormGroup({

      lunes: new FormControl(false),
      lunesDesde: new FormControl('08:00', [Validators.required, this.horarioValido()]),
      lunesHasta: new FormControl('19:00', [Validators.required, this.horarioValido()]),
      lunesEspecialidad: new FormControl('', Validators.required),
      duracionTurnoLunes: new FormControl(30, [Validators.required, Validators.min(30), Validators.max(60)]),
      martes: new FormControl(false),
      martesDesde: new FormControl('08:00', [Validators.required, this.horarioValido()]),
      martesHasta: new FormControl('19:00', [Validators.required, this.horarioValido()]),
      martesEspecialidad: new FormControl('', Validators.required),
      duracionTurnoMartes: new FormControl(30, [Validators.required, Validators.min(30), Validators.max(60)]),
      miercoles: new FormControl(false),
      miercolesDesde: new FormControl('08:00', [Validators.required, this.horarioValido()]),
      miercolesHasta: new FormControl('19:00', [Validators.required, this.horarioValido()]),
      miercolesEspecialidad: new FormControl('', Validators.required),
      duracionTurnoMiercoles: new FormControl(30, [Validators.required, Validators.min(30), Validators.max(60)]),
      jueves: new FormControl(false),
      juevesDesde: new FormControl('08:00', [Validators.required, this.horarioValido()]),
      juevesHasta: new FormControl('19:00', [Validators.required, this.horarioValido()]),
      juevesEspecialidad: new FormControl('', Validators.required),
      duracionTurnoJueves: new FormControl(30, [Validators.required, Validators.min(30), Validators.max(60)]),
      viernes: new FormControl(false),
      viernesDesde: new FormControl('08:00', [Validators.required, this.horarioValido()]),
      viernesHasta: new FormControl('19:00', [Validators.required, this.horarioValido()]),
      viernesEspecialidad: new FormControl('', Validators.required),
      duracionTurnoViernes: new FormControl(30, [Validators.required, Validators.min(30), Validators.max(60)]),
      sabado: new FormControl(false),
      sabadoDesde: new FormControl('08:00', [Validators.required, this.horarioValido("sabado")]),
      sabadoHasta: new FormControl('14:00', [Validators.required, this.horarioValido("sabado")]),
      sabadoEspecialidad: new FormControl('', Validators.required),
      duracionTurnoSabado: new FormControl(30, [Validators.required, Validators.min(30), Validators.max(60)])
    });


    await this.authService.getUserRole().subscribe(user => {
      this.usuario = user;
      console.log("loggeduser", this.usuario);
      this.getUsuarioCompleto(this.usuario.email);
      this.cargarEspecialidades();
      this.actualizar();
    });
  }
  getUsuarioCompleto(email: string){
    this.firestoreService.getEspecialistaPorEmail(this.usuario?.email).then(response => {
      this.especialista = response;
      // console.log("response", response);
    });
  }
  horarioValido(dia ?: string): ValidatorFn {
    return (control: AbstractControl): {} | null => {
      const value = control.value;
      if (value < "08:00" || value > "19:00") {
        return { timeRange: true };
      } else if (dia === "sabado" && (value < "08:00" || value > "14:00")){
        return { timeRange: true };
      }else {
        return null;
      }
    };
  }
  async cargarEspecialidades(){
    await this.firestoreService.getEspecialistaPorEmail(this.usuario?.email).then(response => {
      this.especialidades = response.especialidades;
      // console.log("response", response);
    });
    this.form.get("lunesEspecialidad")?.setValue(this.especialidades[0])
    this.form.get("martesEspecialidad")?.setValue(this.especialidades[0])
    this.form.get("miercolesEspecialidad")?.setValue(this.especialidades[0])
    this.form.get("juevesEspecialidad")?.setValue(this.especialidades[0])
    this.form.get("viernesEspecialidad")?.setValue(this.especialidades[0])
    this.form.get("sabadoEspecialidad")?.setValue(this.especialidades[0])
  }
  async actualizar(){
    this.horarios = await this.firestoreService.get("horarios");
    this.horarios = this.horarios.filter((element:any)=> element.especialista === this.usuario.email)
    // console.log(this.horarios);
    
    // console.log(this.horarios[0].horarios.miercoles);
    if(this.horarios.length){
      this.tieneHorarios = true;
      this.form.patchValue({
        lunes: this.horarios[0].horarios.lunes, 
        lunesDesde: this.horarios[0].horarios.lunesDesde, 
        lunesHasta: this.horarios[0].horarios.lunesHasta, 
        lunesEspecialidad: this.horarios[0].horarios.lunesEspecialidad,
        duracionTurnoLunes : this.horarios[0].horarios.duracionTurnoLunes,
        martes: this.horarios[0].horarios.martes, 
        martesDesde: this.horarios[0].horarios.martesDesde, 
        martesHasta: this.horarios[0].horarios.martesHasta, 
        martesEspecialidad: this.horarios[0].horarios.martesEspecialidad,
        duracionTurnoMartes : this.horarios[0].horarios.duracionTurnoMartes,
        miercoles: this.horarios[0].horarios.miercoles, 
        miercolesDesde: this.horarios[0].horarios.miercolesDesde, 
        miercolesHasta: this.horarios[0].horarios.miercolesHasta, 
        miercolesEspecialidad: this.horarios[0].horarios.miercolesEspecialidad,
        duracionTurnoMiercoles : this.horarios[0].horarios.duracionTurnoMiercoles,
        jueves: this.horarios[0].horarios.jueves, 
        juevesDesde: this.horarios[0].horarios.juevesDesde, 
        juevesHasta: this.horarios[0].horarios.juevesHasta,
        juevesEspecialidad: this.horarios[0].horarios.juevesEspecialidad,
        duracionTurnoJueves : this.horarios[0].horarios.duracionTurnoJueves,
        viernes: this.horarios[0].horarios.viernes,
        viernesDesde: this.horarios[0].horarios.viernesDesde, 
        viernesHasta: this.horarios[0].horarios.viernesHasta, 
        viernesEspecialidad:this.horarios[0].horarios.viernesEspecialidad,
        duracionTurnoViernes: this.horarios[0].horarios.duracionTurnoViernes,
        sabado: this.horarios[0].horarios.sabado, 
        sabadoDesde: this.horarios[0].horarios.sabadoDesde, 
        sabadoHasta: this.horarios[0].horarios.sabadoHasta, 
        sabadoEspecialidad: this.horarios[0].horarios.sabadoEspecialidad,
        duracionTurnoSabado : this.horarios[0].horarios.duracionTurnoSabado
      });
    }
  }
  getDiasSeleccionados() {
    const diasSeleccionados = [];
    const dias = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  
    for (const dia of dias) {
      const checkboxControl = this.form.get(dia);
  
      if (checkboxControl?.value === true) {
        diasSeleccionados.push(dia);
      }
    }
  
    return diasSeleccionados;
  }
  calcularTurnos() {
    const diasSemana = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  
    const turnosPorDia :any = [];
  
    for (const dia of diasSemana) {
      const checkboxControl = this.form.get(dia);
      const desdeControl = this.form.get(`${dia}Desde`);
      const hastaControl = this.form.get(`${dia}Hasta`);
      const especialidadControl = this.form.get(`${dia}Especialidad`);
  
      const duracionTurnoControl = this.form.get(`duracionTurno${dia.charAt(0).toUpperCase() + dia.slice(1)}`);
  
      if (checkboxControl?.value === true && desdeControl?.value && duracionTurnoControl?.value && hastaControl?.value && especialidadControl?.value) {
        const horaInicio = new Date(`1970-01-01T${desdeControl.value}`);
        const duracionMinutos = duracionTurnoControl.value;
  
        const turnos = [];
  
        while (horaInicio.getTime()+(duracionMinutos * 60 * 1000) <= (new Date(`1970-01-01T${hastaControl.value}`).getTime())) {
          let hasta = new Date((horaInicio.getTime()+(duracionMinutos * 60 * 1000)))
          turnos.push({
            disponible:true,
            horario: horaInicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })+'-'+hasta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          });
          horaInicio.setTime(horaInicio.getTime() + (duracionMinutos * 60 * 1000));
        }
  
        turnosPorDia.push({dia:dia,especialidad:especialidadControl.value,horas:turnos});
      }
    }
  
    return turnosPorDia;
  }
    async guardarTurnos(){
    let turnosCargados = await this.firestoreService.get("turnos");
    turnosCargados = turnosCargados.filter((turno : any)=> {
      // console.log(turno)
      turno.dia = turno.dia.filter((dia:any)=>{
        dia.hora = dia.hora.filter((hora:any)=>{
          return hora.estado === "Pendiente";
        })
        return dia.hora.length !== 0;
      })
      return turno.dia.length !== 0;
    })
    if(turnosCargados.length === 0){
      if(this.form.valid){
        if(!this.tieneHorarios){
          let data = {
            especialista: this.usuario?.email,
            horarios: this.form.value,
            horariosCalculados : this.calcularTurnos()
          }
          // console.log("antes del save", data);
          this.cargando = true;
          await this.firestoreService.save(data,"horarios")
          this.cargando = false;
        }else{
          let data = {
            especialista: this.usuario?.email,
            horarios: this.form.value,
            horariosCalculados : this.calcularTurnos()
          }
          this.cargando = true;
          
          this.cargando = false;
        }
        await this.actualizar();
        Swal.fire("OK","Horarios guardados de manera correcta","success")
      }else{
        Swal.fire("ERROR","Verifique todos los campos requeridos","error")
      }
    }else{
      Swal.fire("ERROR","Existen turnos pendientes en el horario anterior","error")
    }
  }
}