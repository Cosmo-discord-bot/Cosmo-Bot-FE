import { Component } from '@angular/core';
import { MusicQueueComponent } from './music-queue/music-queue.component';

@Component({
    selector: 'app-music',
    standalone: true,
    imports: [MusicQueueComponent],
    templateUrl: './music.component.html',
    styleUrl: './music.component.scss',
})
export class MusicComponent {}
