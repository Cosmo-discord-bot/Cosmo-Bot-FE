import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAvailableGuilds(): Observable<any[]> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<
            {
                guildId: string;
                name: string;
                picture: string;
            }[]
        >(`${this.apiUrl}/clientInfo/guilds`, { headers });
    }
}
