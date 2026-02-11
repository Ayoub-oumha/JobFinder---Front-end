import { createAction, props } from '@ngrx/store';
import { FavoriteOffer } from '../models/favorite.model';

// Load favorites
export const loadFavorites = createAction(
  '[Favorites] Load Favorites',
  props<{ userId: number }>()
);

export const loadFavoritesSuccess = createAction(
  '[Favorites] Load Favorites Success',
  props<{ favorites: FavoriteOffer[] }>()
);

export const loadFavoritesFailure = createAction(
  '[Favorites] Load Favorites Failure',
  props<{ error: string }>()
);

// Add favorite
export const addFavorite = createAction(
  '[Favorites] Add Favorite',
  props<{ favorite: FavoriteOffer }>()
);

export const addFavoriteSuccess = createAction(
  '[Favorites] Add Favorite Success',
  props<{ favorite: FavoriteOffer }>()
);

export const addFavoriteFailure = createAction(
  '[Favorites] Add Favorite Failure',
  props<{ error: string }>()
);

// Remove favorite
export const removeFavorite = createAction(
  '[Favorites] Remove Favorite',
  props<{ id: number }>()
);

export const removeFavoriteSuccess = createAction(
  '[Favorites] Remove Favorite Success',
  props<{ id: number }>()
);

export const removeFavoriteFailure = createAction(
  '[Favorites] Remove Favorite Failure',
  props<{ error: string }>()
);
