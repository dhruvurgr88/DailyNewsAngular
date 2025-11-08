import { Component } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email = '';
  password = '';

  constructor(private userService: UserService,private router:Router) { }

  login() {
    this.userService.login({ emailId: this.email, password: this.password })
      .subscribe({
        
        next: (res:any) => {
          console.log(res);
          localStorage.setItem('token', res.token); // ✅ save JWT
          localStorage.setItem('role', res.role); // ✅ save JWT
          localStorage.setItem('email', this.email); // ✅ save JWT

          alert('Login successful');
          if (res.role === 'Chief Editor' || res.role === 'Editor') {
            this.router.navigate(['/dashboard']);
          } else {
            this.router.navigate(['/articles']); // normal user
          }
          
        },
        error: () => alert('Login failed')
      });
  }
}
