import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AuthModule } from '@auth0/auth0-angular';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';
import { provideHttpClient } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { guildReducer } from '@reducers/guild.reducer';
import { environment } from '@env/environment';

export const appConfig: ApplicationConfig = {
    providers: [
        provideRouter(routes),
        provideHttpClient(),
        provideAnimations(),
        provideAnimationsAsync(),
        provideCharts(withDefaultRegisterables()),
        provideStore({ guild: guildReducer }),
        provideEffects(),
        importProvidersFrom(
            AuthModule.forRoot({
                domain: environment.OAuth2Domain,
                clientId: environment.OAuth2ClientId,
                authorizationParams: {
                    redirect_uri: window.location.origin,
                    connection: 'discord',
                    scope: 'openid identify email guilds',
                },
            })
        ),
    ],
};
