import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../services/application.service';
import { Application } from '../../models/application.model';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-candidatures',
  imports: [CommonModule, FormsModule],
  templateUrl: './candidatures.html',
  styleUrl: './candidatures.css',
})
export class Candidatures implements OnInit {
  private appService = inject(ApplicationService);
  private cdr = inject(ChangeDetectorRef);

  applications: Application[] = [];
  isLoading = false;
  errorMessage = '';
  currentUser: User | null = null;
  editingNotesId: number | null = null;
  editNotesValue = '';

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.loadApplications();
    }
  }

  loadApplications(): void {
    if (!this.currentUser) return;
    this.isLoading = true;
    this.appService.getApplications(this.currentUser.id!).subscribe({
      next: (apps) => {
        this.applications = apps;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.message || 'Erreur lors du chargement.';
        this.cdr.markForCheck();
      }
    });
  }

  updateStatus(app: Application, status: 'en_attente' | 'accepte' | 'refuse'): void {
    this.appService.updateApplication(app.id!, { status }).subscribe({
      next: (updated) => {
        app.status = updated.status;
        this.cdr.markForCheck();
      }
    });
  }

  startEditNotes(app: Application): void {
    this.editingNotesId = app.id!;
    this.editNotesValue = app.notes || '';
  }

  saveNotes(app: Application): void {
    this.appService.updateApplication(app.id!, { notes: this.editNotesValue }).subscribe({
      next: (updated) => {
        app.notes = updated.notes;
        this.editingNotesId = null;
        this.cdr.markForCheck();
      }
    });
  }

  cancelEditNotes(): void {
    this.editingNotesId = null;
    this.editNotesValue = '';
  }

  deleteApplication(id: number): void {
    this.appService.deleteApplication(id).subscribe({
      next: () => {
        this.applications = this.applications.filter((a) => a.id !== id);
        this.cdr.markForCheck();
      }
    });
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'en_attente': return 'En attente';
      case 'accepte': return 'Accepté';
      case 'refuse': return 'Refusé';
      default: return status;
    }
  }

  getStatusClass(status: string): string {
    switch (status) {
      case 'en_attente': return 'status-pending';
      case 'accepte': return 'status-accepted';
      case 'refuse': return 'status-rejected';
      default: return '';
    }
  }
}
