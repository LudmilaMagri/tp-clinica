import { Component } from '@angular/core';
import { PacienteFormComponent } from '../paciente-form/paciente-form.component';
@Component({
  selector: 'app-register-paciente',
  standalone: true,
  imports: [PacienteFormComponent],
  templateUrl: './register-paciente.component.html',
  styleUrl: './register-paciente.component.scss'
})
export class RegisterPacienteComponent {
}