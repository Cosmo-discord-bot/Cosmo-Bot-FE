import { Component, OnDestroy, OnInit } from '@angular/core';
import { MusicService } from '../../../services/music.service';
import { Subscription } from 'rxjs';
import { Store } from '@ngrx/store';
import { selectSelectedGuildId } from '@selectors/guild.selectors';
import { NgForOf, NgIf } from '@angular/common';
import { ITrack } from '@interfaces/ITrack';
import { CdkDrag, CdkDragDrop, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    selector: 'app-music-queue',
    templateUrl: './music-queue.component.html',
    styleUrl: './music-queue.component.scss',
    standalone: true,
    imports: [NgIf, NgForOf, CdkDropList, CdkDrag],
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
                // console.error('Error fetching queue:', error);
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

    onDrop(event: CdkDragDrop<ITrack[]>) {
        if (this.guildId) {
            const trackId = this.queue[event.previousIndex].id;
            const newPosition = event.currentIndex;

            // Update the local queue
            moveItemInArray(this.queue, event.previousIndex, event.currentIndex);

            // Send the update to the server
            this.musicService.updateQueueOrder(this.guildId, trackId, newPosition);
        }
    }

    removeTrack(trackId: string) {
        if (this.guildId) {
            this.musicService.removeFromQueue(this.guildId, trackId);
        }
    }

    moveToFirst(trackId: string) {
        if (this.guildId) {
            this.musicService.moveToFirst(this.guildId, trackId);
        }
    }
}
