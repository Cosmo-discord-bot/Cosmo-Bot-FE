import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Import components
import { MusicComponent } from './components/music/music.component';
import { SettingsComponent } from './components/settings/settings.component';

// Import services
// Import feature routing
import { commandsRoutes } from './commands-routing.module';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatFormFieldModule } from '@angular/material/form-field'; // Add this import
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatOption, MatSelect } from '@angular/material/select';

@NgModule({
    declarations: [MusicComponent, SettingsComponent],
    imports: [
        CommonModule,
        RouterModule.forChild(commandsRoutes),
        ReactiveFormsModule,
        MatCard,
        MatCardTitle,
        MatCardContent,
        MatFormField,
        MatButton,
        MatInput,
        MatFormFieldModule,
        MatSelect,
        MatOption,
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    exports: [
        // Export components if they need to be used outside this module
        // OverviewComponent,
    ],
})
export class CommandsModule {}
