import { Routes } from '@angular/router';
import { BienvenidoComponent } from './components/bienvenido/bienvenido.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterPacienteComponent } from './components/register/register-paciente/register-paciente.component';
import { RolGuard } from './guards/rol.guard';
import { AuthGuard } from './guards/auth.guard';


export const routes: Routes = [
    {path:'', redirectTo:'/bienvenido', pathMatch:'full'},
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    {path:'register/paciente', loadComponent: () => import('./components/register/register-paciente/register-paciente.component').then(c => c.RegisterPacienteComponent)},
    {path:'register/especialista', loadComponent: () => import('./components/register/register-especialista/register-especialista.component').then(c => c.RegisterEspecialistaComponent)},
    {path:'usuarios', loadComponent: () => import('./components/usuarios/usuarios.component').then(c => c.UsuariosComponent),canActivate: [AuthGuard, RolGuard], 
        data: { expectedRoles: ['Administrador'] } 
    },
    
    {path:'turnos/mis-turnos', loadComponent: () => import('./components/turnos/mis-turnos/mis-turnos.component').then(c => c.MisTurnosComponent)},
    {path:'turnos', loadComponent: () => import('./components/turnos/turno-alta/turno-alta.component').then(c => c.TurnoAltaComponent)},
    {path:'mi-perfil',loadComponent: () => import('./components/mi-perfil/mi-perfil.component').then(c => c.MiPerfilComponent)},
    {path:'bienvenido', component: BienvenidoComponent},
    {path:'**', redirectTo:'/bienvenido', pathMatch:'full'}
];