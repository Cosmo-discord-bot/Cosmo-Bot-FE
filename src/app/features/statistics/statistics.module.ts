import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BaseChartDirective } from 'ng2-charts';
import 'chartjs-adapter-date-fns';

// Import components
import { OverviewComponent } from './components/overview/overview.component';
import { UsersComponent } from './components/users/users.component';
import { CommandsComponent } from './components/commands/commands.component';

// Import services
// Import feature routing
import { statisticsRoutes } from './statistics-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

@NgModule({
    declarations: [OverviewComponent, UsersComponent, CommandsComponent],
    exports: [
        // Export components if they need to be used outside this module
        // OverviewComponent,
    ],
    imports: [CommonModule, RouterModule.forChild(statisticsRoutes), BaseChartDirective],
    providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class StatisticsModule {}
