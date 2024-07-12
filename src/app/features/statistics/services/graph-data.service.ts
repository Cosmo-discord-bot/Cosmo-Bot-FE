import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '@env/environment';

@Injectable({
    providedIn: 'root',
})
export class GraphDataService {
    constructor(private http: HttpClient) {}

    // TODO: Replace with actual guild ID
    private guildId = '985931954753007616';

    getLineChartData(days: string): Observable<any> {
        return this.http.get<{ [key: string]: number }>(`${environment.apiUrl}/statistics/${this.guildId}/channels/?days=${days}`).pipe(
            map((response: { [key: string]: number }) => {
                return Object.keys(response).map((date) => ({
                    x: new Date(date),
                    y: response[date],
                }));
            })
        );
    }
}
