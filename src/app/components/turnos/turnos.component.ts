import { Component } from '@angular/core';
import { TurnoAltaComponent } from './turno-alta/turno-alta.component';

@Component({
  selector: 'app-turnos',
  standalone: true,
  imports: [TurnoAltaComponent],
  templateUrl: './turnos.component.html',
  styleUrl: './turnos.component.scss'
})
export class TurnosComponent {

}
