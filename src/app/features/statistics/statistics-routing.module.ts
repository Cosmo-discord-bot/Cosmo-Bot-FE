import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { OverviewComponent } from './components/overview/overview.component';
import { UsersComponent } from './components/users/users.component';
import { MessagesComponent } from './components/messages/messages.component';
import { VoiceComponent } from './components/voice/voice.component';

export const statisticsRoutes: Routes = [
    { path: 'overview', component: OverviewComponent },
    { path: 'users', component: UsersComponent },
    { path: 'voice', component: VoiceComponent },
    { path: 'messages', component: MessagesComponent },
    { path: '', redirectTo: 'overview', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forChild(statisticsRoutes)],
    exports: [RouterModule],
})
export class StatisticsRoutingModule {}
