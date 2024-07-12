import { Component } from '@angular/core';
import { MessagesPerDayComponent } from './messages-per-day/messages-per-day.component';
import { MessagesPerChannelComponent } from './messages-per-channel/messages-per-channel.component';

@Component({
    selector: 'app-messages',
    standalone: true,
    imports: [MessagesPerDayComponent, MessagesPerChannelComponent],
    templateUrl: './messages.component.html',
    styleUrl: './messages.component.scss',
})
export class MessagesComponent {}
