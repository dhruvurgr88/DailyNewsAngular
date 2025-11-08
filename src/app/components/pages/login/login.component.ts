import { Component, OnInit } from '@angular/core';
import { UserService } from '../../../services/user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  email = '';
  password = '';
  alertType: string = ''; // 'success' | 'error' | 'warning'
  alertMessage: string = '';
  loading: boolean = false;
  alreadyLoggedIn = false; 

  constructor(private userService: UserService,private router:Router) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (token && role) {
      this.alreadyLoggedIn = true;
      this.alertType = 'warning';
      this.alertMessage = '😎 You are already logged in! Redirecting...';
      this.loading = true;

      setTimeout(() => {
        if (role === 'Chief Editor' || role === 'Editor') {
          this.router.navigate(['/dashboard']);
        } else {
          this.router.navigate(['/articles']);
        }
      }, 2000);
    } else {
      this.alreadyLoggedIn = false; // ✅ Reset if logged out
    }
  }

  login() {
    this.alertType = '';
    this.alertMessage = '';

    if (!this.email || !this.password) {
      this.alertType = 'warning';
      this.alertMessage = '⚠️ Please enter both email and password.';
      return;
    }

    this.loading = true; // 🌀 Show loader

    this.userService.login({ emailId: this.email, password: this.password })
      .subscribe({
        next: (res: any) => {
          this.loading = false; // ✅ Hide loader
          localStorage.setItem('token', res.token);
          localStorage.setItem('role', res.role);
          localStorage.setItem('email', this.email);

          this.alertType = 'success';
          this.alertMessage = '🎉 Login successful! Redirecting...';

          setTimeout(() => {
            if (res.role === 'Chief Editor' || res.role === 'Editor') {
              this.router.navigate(['/dashboard']);
            } else {
              this.router.navigate(['/articles']);
            }
          }, 1500);
        },
        error: (err) => {
          this.loading = false; // ❌ Hide loader
          console.error('Login failed:', err);
          this.alertType = 'error';
          this.alertMessage = err.status === 401
            ? '❌ Invalid email or password.'
            : 'Server error. Please try again later.';
        }
      });
  }

  closeAlert() {
    this.alertType = '';
    this.alertMessage = '';
  }


}
