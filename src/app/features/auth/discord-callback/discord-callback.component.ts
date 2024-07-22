import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DiscordAuthService } from '../../../layout/services/discord-auth.service';

@Component({
    selector: 'app-discord-callback',
    standalone: true,
    imports: [],
    templateUrl: './discord-callback.component.html',
    styleUrl: './discord-callback.component.scss',
})
export class DiscordCallbackComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private discordAuthService: DiscordAuthService
    ) {}

    ngOnInit() {
        this.route.queryParams.subscribe((params) => {
            const code = params['code'];
            if (code) {
                this.discordAuthService.handleCallback(code).subscribe(
                    () => {
                        this.router.navigate(['/']); // Redirect to home page after successful login
                    },
                    (error) => {
                        console.error('Error during login:', error);
                        this.router.navigate(['/']); // Redirect to home page on error
                    }
                );
            } else {
                this.router.navigate(['/']); // Redirect to home page if no code is present
            }
        });
    }
}
