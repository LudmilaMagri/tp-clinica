import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FirestoreService } from '../../servicess/firestore.service';
import Swal from 'sweetalert2';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-encuesta',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './encuesta.component.html',
  styleUrl: './encuesta.component.scss'
})
export class EncuestaComponent {
  encuesta:any;
  turnos:any;
  @Input() turnoSeleccionado:any;
  form!:FormGroup;
  diaEncuesta:any;
  horaEncuesta:any;

  constructor(private fireStoreService: FirestoreService){
    this.form = new FormGroup({calificacion:new FormControl('5', [Validators.required]),
      comentario:new FormControl('', [Validators.required])
    });
  }

  async ngOnInit(){
    this.turnos = await this.fireStoreService.get("turnos")
    this.encuesta = this.yaCargoEncuesta();

  }
  sonFechasIguales(fecha1: Date, fecha2: Date): boolean {
    return (
      fecha1.getDate() === fecha2.getDate() &&
      fecha1.getMonth() === fecha2.getMonth() &&
      fecha1.getFullYear() === fecha2.getFullYear()
    );
  }

  private yaCargoEncuesta(){
    console.log("yaCargoEncuesta");
    let retorno = null;
    for (let i = 0; i < this.turnos.length; i++) {
      let turno = this.turnos[i]
      console.log("this.turnoSeleccionado.turnoObj.id",this.turnoSeleccionado.turnoObj);
      if(this.turnoSeleccionado.turnoObj.id === turno.id){
        for (let j = 0; j < turno.dia.length; j++) {
          let dia = turno.dia[j]
          if(this.sonFechasIguales(new Date(dia.fecha),this.turnoSeleccionado.fecha)){
            this.diaEncuesta = j;
            for (let k = 0;k < dia.hora.length; k++) {
              let hora = dia.hora[k];
              if(hora.horario === this.turnoSeleccionado.horario){
                this.horaEncuesta = k

                //dif entre experiencia y encuesta
                console.log("hora.encuesta",hora.encuesta);
                if(hora.encuesta){
                  retorno= hora.encuesta;
                  break;
                }else if(hora.encuestaExperiencia){
                  retorno = hora.encuestaExperiencia
                  break;
                }
              }
            }
          }
        }
        if(retorno !== null)
          break;
      }
      if(retorno !== null)
      break;
    }
    return retorno;
  }

  async enviarExperiencia(){
    if(this.form.valid){
      let aux : any = {};
      
      this.turnoSeleccionado.turnoObj.dia[this.diaEncuesta].hora[this.horaEncuesta].encuestaExperiencia = this.form.value;
 
      aux.data =  this.turnoSeleccionado.turnoObj;
      aux.id = this.turnoSeleccionado.turnoObj.id;
      await this.fireStoreService.updateWithId(aux,"turnos")
      Swal.fire("OK","Encuesta completada de manera correcta","success")
     }else{
       Swal.fire("ERROR","Faltan preguntas por responder","error")
     }
   }
}
