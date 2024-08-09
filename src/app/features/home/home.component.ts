import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-home',
    standalone: true,
    imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
    templateUrl: './home.component.html',
    styleUrl: './home.component.scss',
})
export class HomeComponent {
    features = [
        { name: 'Statistics', description: "Track your server's activity and growth", icon: 'bar_chart' },
        { name: 'Music Bot', description: 'Play your favorite tunes in voice channels', icon: 'music_note' },
        { name: 'Settings', description: "Customize the bot to fit your server's needs", icon: 'settings' },
    ];
}
