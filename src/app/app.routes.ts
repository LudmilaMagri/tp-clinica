import { Routes } from '@angular/router';
import { BienvenidoComponent } from './components/bienvenido/bienvenido.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { RegisterPacienteComponent } from './components/register/register-paciente/register-paciente.component';

export const routes: Routes = [
    {path:'', redirectTo:'/bienvenido', pathMatch:'full'},
    {path:'login', component: LoginComponent},
    {path:'register', component: RegisterComponent},
    {path:'register/paciente', loadComponent: () => import('./components/register/register-paciente/register-paciente.component').then(c => c.RegisterPacienteComponent)},
    {path:'register/especialista', loadComponent: () => import('./components/register/register-especialista/register-especialista.component').then(c => c.RegisterEspecialistaComponent)},
    {path:'usuarios', loadComponent: () => import('./components/usuarios/usuarios.component').then(c => c.UsuariosComponent)},
    {path:'bienvenido', component: BienvenidoComponent},
    {path:'**', redirectTo:'/bienvenido', pathMatch:'full'}
];