import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoriteState } from './favorite.reducer';

export const selectFavoriteState = createFeatureSelector<FavoriteState>('favorites');

export const selectAllFavorites = createSelector(
  selectFavoriteState,
  (state) => state.favorites
);

export const selectFavoritesLoading = createSelector(
  selectFavoriteState,
  (state) => state.loading
);

export const selectFavoritesError = createSelector(
  selectFavoriteState,
  (state) => state.error
);

export const selectFavoriteOfferIds = createSelector(
  selectAllFavorites,
  (favorites) => favorites.map((f) => f.offerId)
);

export const selectIsFavorite = (offerId: string) =>
  createSelector(selectFavoriteOfferIds, (ids) => ids.includes(offerId));
