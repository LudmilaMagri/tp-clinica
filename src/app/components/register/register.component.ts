import { Component } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';
import { RegisterPacienteComponent } from './register-paciente/register-paciente.component';
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [MatCardModule, RegisterPacienteComponent],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  constructor(private router:Router){
  }
  redirecTo(ruta:any){
    console.log(ruta);
    this.router.navigate([ruta])
  }
}