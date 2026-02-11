import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { JobService } from '../../services/job.service';
import { Job, JobSearchResult } from '../../models/job.model';
import { FavoriteOffer } from '../../models/favorite.model';
import * as FavoriteActions from '../../store/favorite.actions';
import { selectFavoriteOfferIds } from '../../store/favorite.selectors';
import { User } from '../../models/user.model';

@Component({
  selector: 'app-offers',
  imports: [FormsModule, CommonModule],
  templateUrl: './offers.html',
  styleUrl: './offers.css',
})
export class Offers implements OnInit {
  private jobService = inject(JobService);
  private cdr = inject(ChangeDetectorRef);
  private store = inject(Store);

  keyword = '';
  location = '';
  jobs: Job[] = [];
  isLoading = false;
  errorMessage = '';
  totalResults = 0;
  currentPage = 1;
  resultsPerPage = 10;
  isAuthenticated = false;
  currentUser: User | null = null;
  favoriteOfferIds: string[] = [];

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.isAuthenticated = true;
      this.currentUser = JSON.parse(userData);
      this.store.dispatch(FavoriteActions.loadFavorites({ userId: this.currentUser!.id! }));
      this.store.select(selectFavoriteOfferIds).subscribe((ids) => {
        this.favoriteOfferIds = ids;
        this.cdr.markForCheck();
      });
    }
    this.search();
  }

  isFavorite(jobId: string): boolean {
    return this.favoriteOfferIds.includes(jobId);
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
    if (!this.currentUser || this.isFavorite(job.id)) return;
    const favorite: FavoriteOffer = {
      userId: this.currentUser.id!,
      offerId: job.id,
      title: job.title,
      company: job.company,
      location: job.location
    };
    this.store.dispatch(FavoriteActions.addFavorite({ favorite }));
  }

  trackCandidature(job: Job): void {
    // Will be implemented later
    console.log('Track candidature:', job);
  }
}
