import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-detalles-usuario',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './detalles-usuario.component.html',
  styleUrl: './detalles-usuario.component.scss'
})
export class DetallesUsuarioComponent {
  @Input() usuario: any = {};
}
