import { AuthService } from './../services/auth.service';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  invalidLogin: boolean;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService
  ) {}

  signIn(credentials) {
    this.authService.login(credentials).subscribe(
      (result) => {
        const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
        this.router.navigate([returnUrl || '/admin']);
      },
      // error if login info is incorrect
      (error) => {
        this.invalidLogin = true;

        console.log(error);
      }
    );
  }
}
