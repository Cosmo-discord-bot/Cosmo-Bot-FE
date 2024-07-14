import { Component } from '@angular/core';
import { MessagesPerDayComponent } from './messages-per-day/messages-per-day.component';
import { MessagesPerChannelComponent } from './messages-per-channel/messages-per-channel.component';
import { MessagesPerUserComponent } from './messages-per-user/messages-per-user.component';
import { MessagesHeatmapComponent } from './messages-heatmap/messages-heatmap.component';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [MessagesPerDayComponent, MessagesPerChannelComponent, MessagesPerUserComponent, MessagesHeatmapComponent],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.scss',
})
export class MessagesComponent {}
