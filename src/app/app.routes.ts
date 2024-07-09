import { Routes } from '@angular/router';
import { StatisticsComponent } from './statistics/statistics.component';
import { CommandsComponent } from './commands/commands.component';
// Import other components as needed

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./home/home.component').then((m) => m.HomeComponent) },
    { path: 'docs', loadComponent: () => import('./docs/docs.component').then((m) => m.DocsComponent) },
    {
        path: 'statistics',
        component: StatisticsComponent,
        children: [
            { path: '', redirectTo: 'overview', pathMatch: 'full' },
            //{ path: 'overview', loadComponent: () => import('./statistics/overview/overview.component').then((m) => m.OverviewComponent) },
            //{ path: 'users', loadComponent: () => import('./statistics/users/users.component').then((m) => m.UsersComponent) },
            // Add more subroutes
        ],
    },
    {
        path: 'commands',
        component: CommandsComponent,
        children: [
            { path: '', redirectTo: 'list', pathMatch: 'full' },
            //{ path: 'list', loadComponent: () => import('./commands/list/list.component').then((m) => m.ListComponent) },
            //{ path: 'add', loadComponent: () => import('./commands/add/add.component').then((m) => m.AddComponent) },
            // Add more subroutes
        ],
    },
    { path: 'profile', loadComponent: () => import('./profile/profile.component').then((m) => m.ProfileComponent) },
    // Add more main routes as needed
];
