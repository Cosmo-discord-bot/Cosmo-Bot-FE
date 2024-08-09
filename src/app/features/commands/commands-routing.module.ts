import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewComponent } from './components/overview/overview.component';
import { SettingsComponent } from './components/settings/settings.component';
import { MusicComponent } from './components/music/music.component';

export const commandsRoutes: Routes = [
    // { path: 'overview', component: OverviewComponent },
    { path: 'music', component: MusicComponent },
    { path: 'settings', component: SettingsComponent },
    { path: '', redirectTo: 'music', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(commandsRoutes)],
    exports: [RouterModule],
})
export class CommandsRoutingModule {}
