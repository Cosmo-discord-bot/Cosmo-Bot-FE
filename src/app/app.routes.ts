import { Routes } from '@angular/router';
import { DiscordCallbackComponent } from './features/auth/discord-callback/discord-callback.component';

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'auth/discord/callback', component: DiscordCallbackComponent },
    { path: 'home', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },
    { path: 'docs', loadComponent: () => import('./features/docs/docs.component').then((m) => m.DocsComponent) },
    {
        path: 'statistics',
        loadChildren: () => import('./features/statistics/statistics.module').then((m) => m.StatisticsModule),
    },
    {
        path: 'commands',
        loadChildren: () => import('./features/commands/commands.module').then((m) => m.CommandsModule),
    },
    { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent) },
    // Add more main routes as needed
];
