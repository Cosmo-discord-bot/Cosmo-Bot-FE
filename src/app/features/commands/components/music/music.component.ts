import { Component } from '@angular/core';
import { MusicQueueComponent } from './music-queue/music-queue.component';
import { MusicNowPlayingComponent } from './music-now-playing/music-now-playing.component';

@Component({
    selector: 'app-music',
    standalone: true,
    imports: [MusicQueueComponent, MusicNowPlayingComponent],
    templateUrl: './music.component.html',
    styleUrl: './music.component.scss',
})
export class MusicComponent {}
