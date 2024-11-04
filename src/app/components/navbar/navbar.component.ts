import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { Auth } from '@angular/fire/auth';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  userLogged = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private auth: Auth,
  ) { }

    ngOnInit(): void {
      setTimeout(() => {
        this.auth.onAuthStateChanged((user) => {
          if (user) {
            // User logged in already or has just logged in.
            //console.log(user.uid);
            this.userLogged = true;
            console.log(user.uid);
            return user.uid;
          } else {
            // User not logged in or has just logged out.
            return null;
          }
        });
      }, 1000);
    }
  
    onClick() {
      this.userLogged = false;
      this.userService.logout()
        .then(() => {
          this.router.navigate(['/login']);
        })
        .catch(error => console.log(error));
    }
    
}
