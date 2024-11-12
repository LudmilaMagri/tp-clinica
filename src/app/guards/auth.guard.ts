import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../servicess/auth.service';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  async canActivate(): Promise<boolean>{
    var response: any;
    this.authService.getLoggedUser().subscribe((loggedUser) => {

      if (!loggedUser) {
        Swal.fire('ERROR', 'Debe estar logeado para poder ingresar', 'error');
        this.router.navigate(['/login']);
        response= false;
      }else{
        response= true;
      }
    })

    return response;
  }
}
