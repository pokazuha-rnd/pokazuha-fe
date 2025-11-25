import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { GoogleAuthService } from '../../../core/services/google-auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  // styleUrl: './login.component.css'  // ← ȘTERGE ACEASTĂ LINIE sau creează fișierul gol
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  showPassword = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    public googleAuthService: GoogleAuthService,  // ← Schimbă din private în public
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      rememberMe: [false]
    });
  }

  ngOnInit(): void {
    // Initialize Google Sign-In
    this.googleAuthService.initializeGoogleSignIn((token) => {
      this.handleGoogleLogin(token);
    });

    // Render Google button after a slight delay
    setTimeout(() => {
      const googleBtn = document.getElementById('google-signin-btn');
      if (googleBtn) {
        this.googleAuthService.renderButton(googleBtn);
      }
    }, 100);
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Login failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred during login';
        this.isLoading = false;
      }
    });
  }

  handleGoogleLogin(idToken: string): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.authService.googleLogin({ idToken }).subscribe({
      next: (response) => {
        if (response.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = response.message || 'Google login failed';
        }
        this.isLoading = false;
      },
      error: (error) => {
        this.errorMessage = error.error?.message || 'An error occurred during Google login';
        this.isLoading = false;
      }
    });
  }

  onGoogleSignIn(): void {
    // Dacă GoogleAuthService nu are metoda signIn, folosește altă metodă
    // Sau lasă butonul Google să fie randat de SDK
    console.log('Google sign in clicked');
  }

  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}