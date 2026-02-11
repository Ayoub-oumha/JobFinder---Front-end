import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { FavoriteOffer } from '../../models/favorite.model';
import { User } from '../../models/user.model';
import * as FavoriteActions from '../../store/favorite.actions';
import { selectAllFavorites, selectFavoritesLoading, selectFavoritesError } from '../../store/favorite.selectors';

@Component({
  selector: 'app-favorite',
  imports: [CommonModule],
  templateUrl: './favorite.html',
  styleUrl: './favorite.css',
})
export class Favorite implements OnInit {
  private store = inject(Store);
  private cdr = inject(ChangeDetectorRef);

  favorites: FavoriteOffer[] = [];
  isLoading = false;
  errorMessage: string | null = null;
  currentUser: User | null = null;

  ngOnInit(): void {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      this.currentUser = JSON.parse(userData);
      this.store.dispatch(FavoriteActions.loadFavorites({ userId: this.currentUser!.id! }));
    }

    this.store.select(selectAllFavorites).subscribe((favs) => {
      this.favorites = favs;
      this.cdr.markForCheck();
    });

    this.store.select(selectFavoritesLoading).subscribe((loading) => {
      this.isLoading = loading;
      this.cdr.markForCheck();
    });

    this.store.select(selectFavoritesError).subscribe((err) => {
      this.errorMessage = err;
      this.cdr.markForCheck();
    });
  }

  removeFavorite(id: number): void {
    this.store.dispatch(FavoriteActions.removeFavorite({ id }));
  }
}
