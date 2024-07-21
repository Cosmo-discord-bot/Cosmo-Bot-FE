import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class SidebarService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getAvailableGuilds(): Observable<any[]> {
        return this.http.get<{ guildId: string; name: string; picture: string }[]>(`${this.apiUrl}/clientInfo/guilds`);
    }
}
