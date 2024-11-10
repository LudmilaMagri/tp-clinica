import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FirestoreService } from '../../servicess/firestore.service';
import Swal from 'sweetalert2';
import { PacienteFormComponent } from '../register/paciente-form/paciente-form.component';
import { EspecialistaFormComponent } from '../register/especialista-form/especialista-form.component';
import { AdminFormComponent } from '../register/admin-form/admin-form.component';
declare var bootstrap: any;
@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, PacienteFormComponent, EspecialistaFormComponent, AdminFormComponent],
  templateUrl: './usuarios.component.html',
  styleUrl: './usuarios.component.scss'
})
export class UsuariosComponent {
  cargando: boolean = false;
  listaPacientes: any[] = [];
  listaEspecialistas: any[] = [];
  listaAdministradores: any[] = [];
  @ViewChild('pacienteModal') pacienteModal!: ElementRef;
  @ViewChild('especialistasModal') especialistaModal!: ElementRef;
  @ViewChild('adminModal') administradorModal!: ElementRef;
  constructor(private firestoreService: FirestoreService) {}
  ngOnInit(){
     this.getUsuarios();
  }
  ngAfterViewInit() {
    const modalElementPaciente = this.pacienteModal.nativeElement;
    const modalElementEspecialista = this.especialistaModal.nativeElement;
    const modalElementAdministrador = this.administradorModal.nativeElement;
    modalElementPaciente.addEventListener('hidden.bs.modal', async () => {
      console.log("Modal cerrado");
      await this.getUsuarios();
    });
    modalElementEspecialista.addEventListener('hidden.bs.modal', async () => {
      console.log("Modal cerrado");
      await this.getUsuarios();
    });
    modalElementAdministrador.addEventListener('hidden.bs.modal', async () => {
      console.log("Modal cerrado");
      await this.getUsuarios();
    });
  }
  async getUsuarios(){
    await this.firestoreService.get("pacientes").then((resultado:any)=>{
      this.listaPacientes= resultado;
    })
    await this.firestoreService.get("especialistas").then((resultado:any)=>{
      this.listaEspecialistas= resultado;
    })
    await this.firestoreService.get("administradores").then((resultado:any)=>{
      this.listaAdministradores= resultado;
    })
  }
  verEspecialidades(especialista:any){
    let itemsHtml = '<ul>';
    especialista.especialidades.forEach((element:any) => {
      itemsHtml += `<li>${element}</li>`;
    });
    itemsHtml += '</ul>';
  
    Swal.fire({
      title: 'Especialidades:',
      html: itemsHtml,
    });
  }
  
  agregarPaciente() {
    // Lógica para agregar paciente
  }
  async habilitarEspecialista(especialista: any) {
    let docRef = await this.firestoreService.getDocumentByFields("especialistas", especialista);
    especialista.cuentaHabilitada = !especialista.cuentaHabilitada;
    let docRefId =docRef[0].id;
    await this.firestoreService.update(especialista,"especialistas", docRefId);
    await this.getUsuarios();
  }
  agregarEspecialista() {
    // Lógica para agregar especialista
  }
  agregarAdministrador() {
    // Lógica para agregar administrador
  }
}