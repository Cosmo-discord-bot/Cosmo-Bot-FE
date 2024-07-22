import { Component, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { DiscordAuthService } from '../../services/discord-auth.service';
import { MatDivider } from '@angular/material/divider';

interface UserProfile {
    username: string;
    avatarUrl: string;
    guilds: Array<{ id: string; name: string }>;
}

@Component({
    selector: 'app-navbar',
    standalone: true,
    imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatMenuModule, MatDivider, NgOptimizedImage],
    templateUrl: './navbar.component.html',
    styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
    isLoggedIn = false;
    userProfile: UserProfile | null = null;

    constructor(private discordAuthService: DiscordAuthService) {}

    ngOnInit() {
        this.discordAuthService.isAuthenticated$.subscribe((isAuthenticated) => {
            this.isLoggedIn = isAuthenticated;
            if (isAuthenticated) {
                this.loadUserProfile();
            } else {
                this.userProfile = null;
            }
        });
    }

    login() {
        this.discordAuthService.login();
    }

    logout() {
        this.discordAuthService.logout();
    }

    private loadUserProfile() {
        const tokenInfo = this.discordAuthService.getUserInfo();
        if (tokenInfo) {
            this.userProfile = {
                username: tokenInfo.user.username,
                avatarUrl: `https://cdn.discordapp.com/avatars/${tokenInfo.user.id}/${tokenInfo.user.avatar}.png`,
                guilds: tokenInfo.guilds,
            };
        } else {
            console.error('No user info found in token');
            this.userProfile = null;
        }
    }
}
