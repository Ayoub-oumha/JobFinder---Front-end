import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/users' ;
  private http = inject(HttpClient) ;
  login(email: string , password: string): Observable<User>{
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map((users)=>{
        if(users.length === 0){
          throw new Error('Invalid email or password');
      }
      const user = users[0];
      const {password: _, ...userWithPassword} = user ;
      localStorage.setItem('currentUser' , JSON.stringify(userWithPassword)); 
      return userWithPassword ;
    }
    ) )
  }
  register(user: Partial<User>): Observable<User> {
    return this.http.post<User>(this.apiUrl, user).pipe(
      map((created) => {
        const { password: _, ...userNoPass } = created as any;
        localStorage.setItem('currentUser', JSON.stringify(userNoPass));
        return userNoPass as User;
      })
    );
  }

  updateUser(id: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${id}`, data).pipe(
      map((updated) => {
        const { password: _, ...userNoPass } = updated as any;
        localStorage.setItem('currentUser', JSON.stringify(userNoPass));
        return userNoPass as User;
      })
    );
  }

  deleteUser(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  logout(): void {
    localStorage.removeItem('currentUser');
  }

  getCurrentUser(): User | null {
    const data = localStorage.getItem('currentUser');
    return data ? JSON.parse(data) : null;
  }
}
