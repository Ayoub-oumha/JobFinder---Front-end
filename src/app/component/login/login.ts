import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
    fb = inject(FormBuilder);
    router = inject(Router) ;
    authService = inject(AuthService)
    loginForm!: FormGroup ;
    errorMessage = '' ;
    isLoading = false ;

    ngOnInit() {
      this.loginForm = this.fb.group({
        email: ['' , [Validators.required , Validators.email]],
        password: ['' , [Validators.required , Validators.minLength(6)]]
      })
    }

    onSubmit(): void {
      if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    const { email, password } = this.loginForm.value;

    this.authService.login(email, password).subscribe({
      next: () => {
        this.isLoading = false;
        this.router.navigate(['/offers']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Erreur de connexion.';
      },
    });
    }
    get f() {
      return this.loginForm.controls ;
    }
}
