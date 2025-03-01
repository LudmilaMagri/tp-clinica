import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild } from '@angular/core';
import { FirestoreService } from '../../servicess/firestore.service';
import Swal from 'sweetalert2';
import { PacienteFormComponent } from '../register/paciente-form/paciente-form.component';
import { EspecialistaFormComponent } from '../register/especialista-form/especialista-form.component';
import { AdminFormComponent } from '../register/admin-form/admin-form.component';
import { ROLES_ENUM } from '../../enums/roles';
import {Modal} from 'bootstrap';

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
    const pacienteModalInstance = new Modal(this.pacienteModal.nativeElement);
    const especialistaModalInstance = new Modal(this.especialistaModal.nativeElement);
    const adminModalInstance = new Modal(this.administradorModal.nativeElement);
    this.pacienteModal.nativeElement.addEventListener('hidden.bs.modal', async () => {
      console.log("Modal cerrado");
      await this.getUsuarios();
    });
    this.especialistaModal.nativeElement.addEventListener('hidden.bs.modal', async () => {
      console.log("Modal cerrado");
      await this.getUsuarios();
    });
    this.administradorModal.nativeElement.addEventListener('hidden.bs.modal', async () => {
      console.log("Modal cerrado");
      await this.getUsuarios();
    });


}
  

 async getUsuarios() {
    this.cargando = true;

    await this.firestoreService.get("pacientes").then((resultado: any) => {
      this.listaPacientes = resultado;
    })
    await this.firestoreService.get("especialistas").then((resultado: any) => {
      this.listaEspecialistas = resultado;
    })
    await this.firestoreService.get("administradores").then((resultado: any) => {
      this.listaAdministradores = resultado;
    })
    this.cargando = false;
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
  
  
  async habilitarUsuario(rol:string, usuario: any) {
    if(rol == ROLES_ENUM.ESPECIALISTA){
      let docRef = await this.firestoreService.getDocumentByFields("especialistas", usuario);
      usuario.cuentaHabilitada = !usuario.cuentaHabilitada;
      let docRefId = docRef[0].id;
      await this.firestoreService.update(usuario, "especialistas", docRefId);
    }else if(rol == "Administrador"){
      let docRef = await this.firestoreService.getDocumentByFields("administradores", usuario);
      usuario.cuentaHabilitada = !usuario.cuentaHabilitada;
      let docRefId = docRef[0].id;
      await this.firestoreService.update(usuario, "administradores", docRefId);
    }else if(rol == ROLES_ENUM.PACIENTE){
      let docRef = await this.firestoreService.getDocumentByFields("pacientes", usuario);
      usuario.cuentaHabilitada = !usuario.cuentaHabilitada;
      let docRefId = docRef[0].id;
      await this.firestoreService.update(usuario, "pacientes", docRefId);
    }
    await this.getUsuarios();
    
  }


}