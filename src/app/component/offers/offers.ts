import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { JobService } from '../../services/job.service';
import { Job, JobSearchResult } from '../../models/job.model';

@Component({
  selector: 'app-offers',
  imports: [FormsModule, CommonModule],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class Offers implements OnInit {
  private jobService = inject(JobService);
  private cdr = inject(ChangeDetectorRef);

  keyword = '';
  location = '';
  jobs: Job[] = [];
  isLoading = false;
  errorMessage = '';
  totalResults = 0;
  currentPage = 1;
  resultsPerPage = 10;
  isAuthenticated = false;

  ngOnInit(): void {
    this.isAuthenticated = !!localStorage.getItem('currentUser');
    this.search();
  }

  search(): void {
    this.currentPage = 1;
    this.loadJobs();
  }

  loadJobs(): void {
    this.isLoading = true;
    this.errorMessage = '';

    this.jobService
      .searchJobs({
        keyword: this.keyword,
        location: this.location,
        page: this.currentPage,
        resultsPerPage: this.resultsPerPage
      })
      .subscribe({
        next: (result: JobSearchResult) => {
          this.jobs = result.jobs;
          this.totalResults = result.totalResults;
          this.isLoading = false;
          this.cdr.markForCheck();
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMessage = err.message || 'Erreur lors de la recherche.';
          this.cdr.markForCheck();
        }
      });
  }

  get totalPages(): number {
    return Math.ceil(this.totalResults / this.resultsPerPage);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadJobs();
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  addToFavorites(job: Job): void {
    // Will be implemented with NgRx later
    console.log('Add to favorites:', job);
  }

  trackCandidature(job: Job): void {
    // Will be implemented later
    console.log('Track candidature:', job);
  }
}
