import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../servicess/auth.service';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class RolGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const expectedRoles = route.data['expectedRoles'];
    var user :any;
    var response:any;

    this.authService.getUserRole().subscribe((rol) => {
      user = rol;

      if (user && expectedRoles.includes(user.role)) {
        response= true;
      }else{
        this.router.navigate(['/login']);
        response = false;
      }
    })
    return response;
  }
}
