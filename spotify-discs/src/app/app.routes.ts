import { Routes, Route } from '@angular/router';
import { UserRegistrationPage } from './pages/user-registration/user-registration.page';
import { HomePage } from './pages/home/home.page';
import { DiscInformationPage } from './pages/disc-information/disc-information.page';
import { titleResolver } from '../title.resolver';

export const routes: Routes = [
    { path: 'home', component: HomePage, data: 'Home page', title: 'Home' } as Route,
    { path: 'disc-information/:title', component: DiscInformationPage, data: 'Disc information page', title: titleResolver } as Route,
    { path: 'user-registration', component: UserRegistrationPage, data: 'User registration page', title: 'User Registration' } as Route,
    { path: '', redirectTo: '/home', pathMatch: 'full' } as Route, // Default route
    { path: '**', redirectTo: '/home' } as Route // Wildcard route for 404s
];

