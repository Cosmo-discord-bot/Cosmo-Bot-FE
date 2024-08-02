import { Component, OnDestroy, OnInit } from '@angular/core';
import { MusicService } from '../../../services/music.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSelectedGuildId } from '@selectors/guild.selectors';
import { NgForOf, NgIf } from '@angular/common';
import { ITrack } from '@interfaces/ITrack';

@Component({
    selector: 'app-music-queue',
    templateUrl: './music-queue.component.html',
    styleUrl: './music-queue.component.scss',
    standalone: true,
    imports: [NgIf, NgForOf],
})
export class MusicQueueComponent implements OnInit, OnDestroy {
    queue: ITrack[] = [];
    guildId: string | null = null;
    private guildSubscription: Subscription | null = null;
    private queueSubscription: Subscription | null = null;

    constructor(
        private musicService: MusicService,
        private store: Store
    ) {}

    ngOnInit() {
        this.guildSubscription = this.store.select(selectSelectedGuildId).subscribe((guildId) => {
            if (guildId && guildId !== this.guildId) {
                this.guildId = guildId;
                this.loadQueue();
            }
        });

        this.queueSubscription = this.musicService.getQueueUpdates().subscribe((updatedQueue) => {
            this.queue = updatedQueue;
        });
    }

    loadQueue() {
        if (!this.guildId) {
            return;
        }
        this.musicService.getQueue(this.guildId).subscribe(
            (data) => {
                this.queue = data;
            },
            (error) => {
                console.error('Error fetching queue:', error);
                this.queue = [];
            }
        );
    }

    ngOnDestroy() {
        if (this.guildSubscription) {
            this.guildSubscription.unsubscribe();
        }
        if (this.queueSubscription) {
            this.queueSubscription.unsubscribe();
        }
    }
}
