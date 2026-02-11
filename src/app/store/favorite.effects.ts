import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';
import { FavoriteService } from '../services/favorite.service';
import * as FavoriteActions from './favorite.actions';

@Injectable()
export class FavoriteEffects {
  private actions$ = inject(Actions);
  private favoriteService = inject(FavoriteService);

  loadFavorites$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoriteActions.loadFavorites),
      mergeMap(({ userId }) =>
        this.favoriteService.getFavorites(userId).pipe(
          map((favorites) => FavoriteActions.loadFavoritesSuccess({ favorites })),
          catchError((error) =>
            of(FavoriteActions.loadFavoritesFailure({ error: error.message }))
          )
        )
      )
    )
  );

  addFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoriteActions.addFavorite),
      mergeMap(({ favorite }) =>
        this.favoriteService.addFavorite(favorite).pipe(
          map((created) => FavoriteActions.addFavoriteSuccess({ favorite: created })),
          catchError((error) =>
            of(FavoriteActions.addFavoriteFailure({ error: error.message }))
          )
        )
      )
    )
  );

  removeFavorite$ = createEffect(() =>
    this.actions$.pipe(
      ofType(FavoriteActions.removeFavorite),
      mergeMap(({ id }) =>
        this.favoriteService.removeFavorite(id).pipe(
          map(() => FavoriteActions.removeFavoriteSuccess({ id })),
          catchError((error) =>
            of(FavoriteActions.removeFavoriteFailure({ error: error.message }))
          )
        )
      )
    )
  );
}
