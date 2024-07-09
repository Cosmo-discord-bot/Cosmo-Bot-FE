import { Routes } from '@angular/router';
import { CommandsComponent } from './features/commands/commands.component';
import { StatisticsModule } from './features/statistics/statistics.module';
// Import other components as needed

export const routes: Routes = [
    { path: '', redirectTo: '/home', pathMatch: 'full' },
    { path: 'home', loadComponent: () => import('./features/home/home.component').then((m) => m.HomeComponent) },
    { path: 'docs', loadComponent: () => import('./features/docs/docs.component').then((m) => m.DocsComponent) },
    {
        path: 'statistics',
        loadChildren: () => import('./features/statistics/statistics.module').then((m) => m.StatisticsModule),
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
    { path: 'profile', loadComponent: () => import('./features/profile/profile.component').then((m) => m.ProfileComponent) },
    // Add more main routes as needed
];
