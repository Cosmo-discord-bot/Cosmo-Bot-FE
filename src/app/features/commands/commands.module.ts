import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import components
import { MusicComponent } from './components/music/music.component';
import { SettingsComponent } from './components/settings/settings.component';

// Import services
// import { StatisticsService } from './services/statistics.service';

// Import feature routing
import { commandsRoutes } from './commands-routing.module';

@NgModule({
    declarations: [MusicComponent, SettingsComponent],
    imports: [CommonModule, RouterModule.forChild(commandsRoutes)],
    providers: [],
    exports: [
        // Export components if they need to be used outside this module
        // OverviewComponent,
    ],
})
export class CommandsModule {}
