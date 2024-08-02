// music.service.ts (Frontend)

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
    private nowPlayingSubject = new BehaviorSubject<ITrack | null>(null);
    private playStateSubject = new BehaviorSubject<boolean>(false);
    private progressSubject = new BehaviorSubject<number>(0);
    private volumeSubject = new BehaviorSubject<number>(100);

    constructor(private http: HttpClient) {
        this.socket = io(environment.socketUrl);

        this.socket.on('connect', () => {
            console.log('Connected to music socket');
        });

        this.socket.on('queueUpdate', ({ guildId, queue, currentTrack }) => {
            this.queueSubject.next(queue);
            this.nowPlayingSubject.next(currentTrack);
            console.log('Queue updated for guild:', guildId);
        });

        this.socket.on('nowPlayingUpdate', ({ guildId, track }) => {
            this.nowPlayingSubject.next(track);
            console.log('Now playing updated for guild:', guildId);
        });

        this.socket.on('queueEmpty', ({ guildId }) => {
            this.queueSubject.next([]);
            this.nowPlayingSubject.next(null);
            console.log('Queue empty for guild:', guildId);
        });

        this.socket.on('playStateUpdate', ({ guildId, isPlaying }) => {
            this.playStateSubject.next(isPlaying);
            console.log('Play state updated for guild:', guildId);
        });

        this.socket.on('progressUpdate', ({ guildId, progress }) => {
            this.progressSubject.next(progress);
        });

        this.socket.on('volumeUpdate', ({ guildId, volume }) => {
            this.volumeSubject.next(volume);
            console.log('Volume updated for guild:', guildId);
        });

        this.socket.on('disconnect', () => {
            console.log('Disconnected from music socket');
        });
    }

    getQueue(guildId: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/musicPlayer/${guildId}/queue`, { headers });
    }

    getCurrentTrack(guildId: string): Observable<any> {
        const token = localStorage.getItem('discord_token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
        return this.http.get(`${this.apiUrl}/musicPlayer/${guildId}/nowPlaying`, { headers });
    }

    getQueueUpdates(): Observable<any[]> {
        return this.queueSubject.asObservable();
    }

    getNowPlayingUpdates(): Observable<ITrack | null> {
        return this.nowPlayingSubject.asObservable();
    }

    getPlayStateUpdates(): Observable<boolean> {
        return this.playStateSubject.asObservable();
    }

    getProgressUpdates(): Observable<number> {
        return this.progressSubject.asObservable();
    }

    getVolumeUpdates(): Observable<number> {
        return this.volumeSubject.asObservable();
    }

    playPause(guildId: string) {
        this.socket.emit('playPause', guildId, (error: any) => {
            if (error) {
                console.error('Error in playPause:', error);
            } else {
                console.log('playPause event emitted successfully');
            }
        });
    }

    nextTrack(guildId: string) {
        this.socket.emit('nextTrack', guildId);
    }

    seekTo(guildId: string, time: number) {
        this.socket.emit('seekTo', guildId, time);
    }

    setVolume(guildId: string, volume: number) {
        this.socket.emit('setVolume', guildId, volume);
    }

    updateQueueOrder(guildId: string, track: string, index: number) {
        this.socket.emit('updateQueueOrder', { guildId, track, index }, (error: any) => {
            if (error) {
                console.error('Error updating queue order:', error);
            } else {
                console.log('Queue order updated successfully');
            }
        });
    }

    removeFromQueue(guildId: string, trackId: string) {
        console.log('Removing track from queue');
        this.socket.emit('removeFromQueue', { guildId, trackId }, (error: any) => {
            if (error) {
                console.error('Error removing track from queue:', error);
            } else {
                console.log('Track removed from queue successfully');
            }
        });
    }

    moveToFirst(guildId: string, trackId: string) {
        this.socket.emit('moveToFirst', { guildId, trackId }, (error: any) => {
            if (error) {
                console.error('Error moving track to first position:', error);
            } else {
                console.log('Track moved to first position successfully');
            }
        });
    }
}
