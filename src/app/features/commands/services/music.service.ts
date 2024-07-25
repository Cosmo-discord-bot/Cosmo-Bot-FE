import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { io, Socket } from 'socket.io-client';
import { ITrack } from '@interfaces/ITrack';

@Injectable({
    providedIn: 'root',
})
export class MusicService {
    private apiUrl = environment.apiUrl;
    private socket: Socket;
    private queueSubject = new BehaviorSubject<any[]>([]);

    constructor(private http: HttpClient) {
        this.socket = io(environment.socketUrl);

        this.socket.on('queueUpdate', (queue: ITrack[]) => {
            this.queueSubject.next(queue);
            console.log('Queue updated');
        });

        this.socket.on('trackChange', (track: ITrack) => {
            // Handle track change if needed
        });

        this.socket.on('queueEmpty', () => {
            this.queueSubject.next([]);
        });

        this.socket.on('disconnect', () => {
            // Handle disconnect if needed
        });
    }

    getQueue(guildId: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/musicPlayer/${guildId}/queue`, { headers });
    }

    getQueueUpdates(): Observable<any[]> {
        return this.queueSubject.asObservable();
    }
}
