import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth-service';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
    router = inject(Router);
    private authService = inject(AuthService);

    get isLoggedIn(): boolean {
      return !!localStorage.getItem('currentUser');
    }

    logout(): void {
      this.authService.logout();
      this.router.navigate(['/login']);
    }
}
