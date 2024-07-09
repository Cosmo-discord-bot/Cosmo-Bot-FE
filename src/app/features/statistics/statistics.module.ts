import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import components
import { OverviewComponent } from './components/overview/overview.component';
import { UsersComponent } from './components/users/users.component';
import { CommandsComponent } from './components/commands/commands.component';

// Import services
// import { StatisticsService } from './services/statistics.service';

// Import feature routing
import { statisticsRoutes } from './statistics-routing.module';

@NgModule({
    declarations: [OverviewComponent, UsersComponent, CommandsComponent],
    imports: [CommonModule, RouterModule.forChild(statisticsRoutes)],
    providers: [],
    exports: [
        // Export components if they need to be used outside this module
        // OverviewComponent,
    ],
})
export class StatisticsModule {}
