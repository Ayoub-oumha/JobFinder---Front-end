import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Offers } from './component/offers/offers';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'offers', component: Offers },
    { path: 'favorite', canActivate: [authGuard], loadComponent: () => import('./component/favorite/favorite').then(m => m.Favorite) },
    { path: 'candidatures', canActivate: [authGuard], loadComponent: () => import('./component/candidatures/candidatures').then(m => m.Candidatures) },
];
