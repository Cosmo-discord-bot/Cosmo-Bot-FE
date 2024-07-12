import { Component } from '@angular/core';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.scss',
})
export class MessagesComponent {}
/*
    TODO:
    - Messages for 30 days with filter for more - max 365 days
    - Messages per channel
    - Messages per user
    - Heatmap - how many messages each hour of the day
    - Top 10 users by messages - pie chart with percentage
    - Top 10 channels by messages - pie chart with percentage

    - Average?
 */
