import { createReducer, on } from '@ngrx/store';
import { FavoriteOffer } from '../models/favorite.model';
import * as FavoriteActions from './favorite.actions';

export interface FavoriteState {
  favorites: FavoriteOffer[];
  loading: boolean;
  error: string | null;
}

export const initialState: FavoriteState = {
  favorites: [],
  loading: false,
  error: null,
};

export const favoriteReducer = createReducer(
  initialState,

  // Load
  on(FavoriteActions.loadFavorites, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FavoriteActions.loadFavoritesSuccess, (state, { favorites }) => ({
    ...state,
    favorites,
    loading: false,
  })),
  on(FavoriteActions.loadFavoritesFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Add
  on(FavoriteActions.addFavorite, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FavoriteActions.addFavoriteSuccess, (state, { favorite }) => ({
    ...state,
    favorites: [...state.favorites, favorite],
    loading: false,
  })),
  on(FavoriteActions.addFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  // Remove
  on(FavoriteActions.removeFavorite, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),
  on(FavoriteActions.removeFavoriteSuccess, (state, { id }) => ({
    ...state,
    favorites: state.favorites.filter((f) => f.id !== id),
    loading: false,
  })),
  on(FavoriteActions.removeFavoriteFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  }))
);
