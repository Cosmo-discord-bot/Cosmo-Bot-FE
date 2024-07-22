import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './layout/components/navbar/navbar.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { DiscordAuthService } from './layout/services/discord-auth.service';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, NavbarComponent, SidebarComponent],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
    title = 'cosmo-bot-fe';

    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private discordAuthService: DiscordAuthService
    ) {}

    ngOnInit() {
        // Handle the OAuth callback
        this.route.queryParams.subscribe((params) => {
            const code = params['code'];
            if (code) {
                this.discordAuthService.handleCallback(code).subscribe(
                    () => {
                        // Successful login
                        console.log('Successfully logged in');
                        // Redirect to home page or dashboard
                        this.router.navigate(['/']);
                    },
                    (error) => {
                        console.error('Error during login:', error);
                        // Handle login error (e.g., show an error message)
                    }
                );
            }
        });
    }
}
