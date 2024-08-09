import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { environment } from '@env/environment';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
    user: {
        id: string;
        username: string;
        avatar: string;
        // Add other user properties as needed
    };
    guilds: Array<{
        id: string;
        name: string;
        // Add other guild properties as needed
    }>;
    // Add other token properties as needed
}

@Injectable({
    providedIn: 'root',
})
export class DiscordAuthService {
    private backendUrl = environment.apiUrl;

    private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
    isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

    constructor(private http: HttpClient) {
        this.checkAuthStatus();
    }

    login() {
        window.location.href = environment.OAuth2Url;
    }

    handleCallback(code: string): Observable<any> {
        return this.http.post(`${this.backendUrl}/authenticate/discord?code=${code}`, null).pipe(
            tap((response: any) => {
                localStorage.setItem('discord_token', response.token);
                this.isAuthenticatedSubject.next(true);
            })
        );
    }

    logout() {
        localStorage.removeItem('discord_token');
        this.isAuthenticatedSubject.next(false);
    }

    getUserInfo(): DecodedToken | null {
        const token = localStorage.getItem('discord_token');
        if (token) {
            try {
                return jwtDecode<DecodedToken>(token);
            } catch (error) {
                console.error('Error decoding token:', error);
                return null;
            }
        }
        return null;
    }

    getUsername(): string | null {
        const userInfo = this.getUserInfo();
        return userInfo ? userInfo.user.username : null;
    }

    getUserAvatar(): string | null {
        const userInfo = this.getUserInfo();
        return userInfo ? `https://cdn.discordapp.com/avatars/${userInfo.user.id}/${userInfo.user.avatar}.png` : null;
    }

    getUserGuilds(): Array<{ id: string; name: string }> | null {
        const userInfo = this.getUserInfo();
        return userInfo ? userInfo.guilds : null;
    }

    private checkAuthStatus() {
        const token = localStorage.getItem('discord_token');
        this.isAuthenticatedSubject.next(!!token);
    }
}
