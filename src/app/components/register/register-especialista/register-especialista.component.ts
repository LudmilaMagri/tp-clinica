import { Component } from '@angular/core';
import { EspecialistaFormComponent } from '../especialista-form/especialista-form.component';
@Component({
  selector: 'app-register-especialista',
  standalone: true,
  imports: [EspecialistaFormComponent],
  templateUrl: './register-especialista.component.html',
  styleUrl: './register-especialista.component.scss'
})
export class RegisterEspecialistaComponent {
}