import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class SettingsService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getConfig(guildId: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/configuration/${guildId}`, { headers });
    }

    updateConfig(
        guildId: string,
        config: {
            guildId: string;
            mainChannelId: string;
            rolesChannelId: string;
            eventsGroupId: string;
            djRoles: string[];
            RBACRoles: string[];
        }
    ): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.post(`${this.apiUrl}/configuration/${guildId}`, config, { headers });
    }
}
