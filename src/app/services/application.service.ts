import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Application } from '../models/application.model';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private apiUrl = 'http://localhost:3000/applications';
  private http = inject(HttpClient);

  getApplications(userId: number): Observable<Application[]> {
    return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
  }

  addApplication(application: Application): Observable<Application> {
    return this.http.post<Application>(this.apiUrl, application);
  }

  updateApplication(id: number, data: Partial<Application>): Observable<Application> {
    return this.http.patch<Application>(`${this.apiUrl}/${id}`, data);
  }

  deleteApplication(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
