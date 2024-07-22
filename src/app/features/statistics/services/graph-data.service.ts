import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable()
export class GraphDataService {
    constructor(private http: HttpClient) {}

    // TODO: Replace with actual guild ID
    // private guildId = environment.discordGuildId;

    getMessagesPerDayChartData(guildId: string, days: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http
            .get<{
                [key: string]: number;
            }>(`${environment.apiUrl}/statistics/${guildId}/messages/perDay?days=${days}`, { headers })
            .pipe(
                map((response: { [key: string]: number }) => {
                    return Object.keys(response).map((date) => ({
                        x: new Date(date),
                        y: response[date],
                    }));
                })
            );
    }

    getMessagesPerChannelChartData(guildId: string, days: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http
            .get<{
                [key: string]: { name: string; count: number };
            }>(`${environment.apiUrl}/statistics/${guildId}/messages/perChannel?days=${days}`, { headers })
            .pipe(
                map((response) => {
                    return Object.values(response).map((channel: { name: string; count: number }) => ({
                        name: channel.name,
                        count: channel.count,
                    }));
                })
            );
    }

    getMessagesPerUserChartData(guildId: string, days: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http
            .get<{
                [key: string]: { name: string; count: number };
            }>(`${environment.apiUrl}/statistics/${guildId}/messages/perUser?days=${days}`, { headers })
            .pipe(
                map((response) => {
                    return Object.values(response).map((channel: { name: string; count: number }) => ({
                        name: channel.name,
                        count: channel.count,
                    }));
                })
            );
    }

    getMessagesActivityHeatmap(guildId: string, days: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<{
            [dayOfWeek: string]: { [hour: string]: number };
        }>(`${environment.apiUrl}/statistics/${guildId}/messages/heatmap?days=${days}`, {
            headers,
        });
    }

    getVoicePerUserChartData(guildId: string, days: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http
            .get<{
                [date: string]: { [userId: string]: number };
            }>(`${environment.apiUrl}/statistics/${guildId}/voice/activity?days=${days}`, { headers })
            .pipe(
                map((response) => {
                    return Object.entries(response).map(([date, userData]) => ({
                        date,
                        userData,
                    }));
                })
            );
    }

    getVoicePerChannelChartData(guildId: string, days: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get<{ [date: string]: { [channelName: string]: number } }>(
            `${environment.apiUrl}/statistics/${guildId}/voice/perChannel?days=${days}`,
            { headers }
        );
    }
}
