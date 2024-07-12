import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable()
export class GraphDataService {
    constructor(private http: HttpClient) {}

    // TODO: Replace with actual guild ID
    private guildId = environment.discordGuildId;

    getPerDayChartData(days: string): Observable<any> {
        return this.http.get<{ [key: string]: number }>(`${environment.apiUrl}/statistics/${this.guildId}/messages/perDay?days=${days}`).pipe(
            map((response: { [key: string]: number }) => {
                return Object.keys(response).map((date) => ({
                    x: new Date(date),
                    y: response[date],
                }));
            })
        );
    }

    getPerChannelChartData(days: string): Observable<any> {
        return this.http
            .get<{ [key: string]: { name: string; count: number } }>(`${environment.apiUrl}/statistics/${this.guildId}/messages/perChannel?days=${days}`)
            .pipe(
                map((response) => {
                    return Object.values(response).map((channel: { name: string; count: number }) => ({
                        name: channel.name,
                        count: channel.count,
                    }));
                })
            );
    }

    getPerUserChartData(days: string): Observable<any> {
        return this.http
            .get<{ [key: string]: { name: string; count: number } }>(`${environment.apiUrl}/statistics/${this.guildId}/messages/perUser?days=${days}`)
            .pipe(
                map((response) => {
                    return Object.values(response).map((channel: { name: string; count: number }) => ({
                        name: channel.name,
                        count: channel.count,
                    }));
                })
            );
    }
}
