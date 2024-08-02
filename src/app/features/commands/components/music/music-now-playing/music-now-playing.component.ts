// music-now-playing.component.ts

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MusicService } from '../../../services/music.service';
import { ITrack } from '@interfaces/ITrack';
import { Subscription } from 'rxjs';
import { selectSelectedGuildId } from '@selectors/guild.selectors';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-music-now-playing',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './music-now-playing.component.html',
    styleUrl: './music-now-playing.component.scss',
})
export class MusicNowPlayingComponent implements OnInit, OnDestroy {
    @Input() guildId!: string;

    currentTrack: ITrack | null = null;
    isPlaying: boolean = true;
    progress: number = 0;
    volume: number = 100;
    queue: ITrack[] = [];
    private subscriptions: Subscription[] = [];
    private guildSubscription: Subscription | null = null;

    constructor(
        private musicService: MusicService,
        private store: Store
    ) {}

    ngOnInit() {
        this.guildSubscription = this.store.select(selectSelectedGuildId).subscribe((guildId) => {
            if (guildId && guildId !== this.guildId) {
                this.guildId = guildId;
                this.loadTrack();
            }
        });

        this.subscriptions.push(
            this.musicService.getNowPlayingUpdates().subscribe((track: ITrack | null) => {
                this.currentTrack = track;
            }),
            this.musicService.getPlayStateUpdates().subscribe((isPlaying: boolean) => {
                this.isPlaying = isPlaying;
            }),
            this.musicService.getProgressUpdates().subscribe((progress: number) => {
                this.progress = progress / 1000;
            }),
            this.musicService.getVolumeUpdates().subscribe((volume: number) => {
                this.volume = volume;
            }),
            this.musicService.getQueueUpdates().subscribe((queue: ITrack[]) => {
                this.queue = queue;
            })
        );
    }

    loadTrack() {
        if (!this.guildId) {
            return;
        }
        this.musicService.getCurrentTrack(this.guildId).subscribe(
            (data) => {
                this.currentTrack = data;
            },
            (error) => {
                console.error('Error fetching current track:', error);
                this.currentTrack = null;
            }
        );
    }

    ngOnDestroy() {
        this.subscriptions.forEach((sub) => sub.unsubscribe());
    }

    playPause() {
        this.musicService.playPause(this.guildId);
    }

    nextTrack() {
        this.musicService.nextTrack(this.guildId);
    }

    onSeek(event: any) {
        const seekTime = event.target.value;
        this.musicService.seekTo(this.guildId, seekTime);
    }

    onVolumeChange(event: any) {
        const newVolume = event.target.value;
        this.musicService.setVolume(this.guildId, newVolume);
    }
}
