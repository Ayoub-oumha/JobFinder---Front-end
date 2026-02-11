import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FavoriteOffer } from '../models/favorite.model';

@Injectable({
  providedIn: 'root',
})
export class FavoriteService {
  private apiUrl = 'http://localhost:3000/favoritesOffers';
  private http = inject(HttpClient);

  getFavorites(userId: number): Observable<FavoriteOffer[]> {
    return this.http.get<FavoriteOffer[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addFavorite(favorite: FavoriteOffer): Observable<FavoriteOffer> {
    return this.http.post<FavoriteOffer>(this.apiUrl, favorite);
  }

  removeFavorite(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
