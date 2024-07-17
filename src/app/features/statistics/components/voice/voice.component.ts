import { Component } from '@angular/core';
import { VoicePerDayComponent } from './voice-per-day/voice-per-day.component';
import { VoicePerChannelComponent } from './voice-per-channel/voice-per-channel.component';
import { VoicePerUserComponent } from './voice-per-user/voice-per-user.component';
import { VoiceHeatmapComponent } from './voice-heatmap/voice-heatmap.component';

@Component({
    selector: 'app-voice',
    standalone: true,
    imports: [VoicePerDayComponent, VoicePerChannelComponent, VoicePerUserComponent, VoiceHeatmapComponent],
    templateUrl: './voice.component.html',
    styleUrl: './voice.component.scss',
})
export class VoiceComponent {}
