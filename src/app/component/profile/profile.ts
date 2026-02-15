import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  profileForm!: FormGroup;
  currentUser: User | null = null;
  successMessage = '';
  errorMessage = '';
  isLoading = false;
  showDeleteConfirm = false;

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    if (!this.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.profileForm = this.fb.group({
      nom: [this.currentUser.nom, [Validators.required]],
      prenom: [this.currentUser.prenom, [Validators.required]],
      email: [this.currentUser.email, [Validators.required, Validators.email]],
      password: ['', [Validators.minLength(6)]]
    });
  }

  get f() {
    return this.profileForm.controls;
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const data: Partial<User> = {
      nom: this.profileForm.value.nom,
      prenom: this.profileForm.value.prenom,
      email: this.profileForm.value.email,
    };

    // Only include password if the user typed a new one
    if (this.profileForm.value.password) {
      data.password = this.profileForm.value.password;
    }

    this.authService.updateUser(this.currentUser!.id!, data).subscribe({
      next: (updated) => {
        this.currentUser = updated;
        this.isLoading = false;
        this.successMessage = 'Profil mis à jour avec succès !';
        this.profileForm.patchValue({ password: '' });
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Erreur lors de la mise à jour.';
        this.cdr.markForCheck();
      }
    });
  }

  confirmDelete(): void {
    this.showDeleteConfirm = true;
  }

  cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  deleteAccount(): void {
    this.isLoading = true;
    this.authService.deleteUser(this.currentUser!.id!).subscribe({
      next: () => {
        this.authService.logout();
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Erreur lors de la suppression.';
        this.cdr.markForCheck();
      }
    });
  }
}
