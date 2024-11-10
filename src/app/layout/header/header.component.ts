import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../servicess/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
  isLoggedIn = false;
  userLoggedRole!: any;
  constructor(private authService: AuthService){
  }

  ngOnInit(): void {
    this.authService.getLoggedUser().subscribe(user => {
      this.isLoggedIn = !!user;
      // console.log("user",user);
      this.authService.getUserRole().subscribe(role => {
        this.userLoggedRole = role;
        // console.log("this.userLoggedRole",this.userLoggedRole );
      })
    });
  }
  
  logOut(){
    this.authService.SignOut();
  }

  closeMenu() {
    const navbarCollapse = document.getElementById('navbarSupportedContent');
    if (navbarCollapse && navbarCollapse.classList.contains('show')) {
      navbarCollapse.classList.remove('show');
    }
  }
}
