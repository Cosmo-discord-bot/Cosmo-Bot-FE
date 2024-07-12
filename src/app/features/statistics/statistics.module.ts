import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';

// Import components
import { OverviewComponent } from './components/overview/overview.component';
import { UsersComponent } from './components/users/users.component';
import { MessagesPerDayComponent } from './components/messages/messages-per-day/messages-per-day.component';
import { CommandsComponent } from './components/commands/commands.component';

// Import services

// Import feature routing
import { statisticsRoutes } from './statistics-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { MessagesPerChannelComponent } from './components/messages/messages-per-channel/messages-per-channel.component';

@NgModule({
    declarations: [OverviewComponent, UsersComponent, CommandsComponent],
    imports: [CommonModule, RouterModule.forChild(statisticsRoutes), BaseChartDirective, HttpClientModule],
    providers: [],
    exports: [
        // Export components if they need to be used outside this module
        // OverviewComponent,
    ],
})
export class StatisticsModule {}
