import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CommandsService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {}

    getConfig(guildId: string): Observable<any> {
        return this.http.get(`${this.apiUrl}/configuration/${guildId}`);
    }

    updateConfig(
        guildId: string,
        config: {
            guildId: string;
            mainChannelId: string;
            rolesChannelId: string;
            eventsGroupId: string;
        }
    ): Observable<any> {
        return this.http.post(`${this.apiUrl}/configuration/${guildId}`, config);
    }
}
