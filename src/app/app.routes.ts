import { Routes } from '@angular/router';
import { Login } from './component/login/login';
import { Register } from './component/register/register';
import { Offers } from './component/offers/offers';
import { Favorite } from './component/favorite/favorite';
import { Candidatures } from './component/candidatures/candidatures';
import { Header } from './component/header/header';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: Login },
    { path: 'register', component: Register },
    { path: 'offers', component: Offers },
    { path: 'favorite', component: Favorite },
    { path: 'candidatures', component: Candidatures },
    { path: 'header', component: Header }
];
