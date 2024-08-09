import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { Store } from '@ngrx/store';
import { selectGuild } from '@actions/guild.actions';
import { SidebarService } from '../../services/sidebar.service';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, MatListModule, MatSidenavModule, MatSelectModule, FormsModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    currentRoute: string = '';
    currentSubRoute: string = '';
    sidebarItems: { [key: string]: string[] } = {
        home: ['TODO'],
        statistics: ['Overview', 'Music', 'Voice', 'Messages'],
        commands: ['Overview', 'Music', 'Settings'],
        docs: ['API'],
    };
    availableGuilds: { guildId: string; name: string; picture: string }[] = [];
    selectedGuildId: string | null = null;

    constructor(
        private router: Router,
        private store: Store,
        private sidebarService: SidebarService
    ) {}

    ngOnInit() {
        this.loadAvailableGuilds();
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                map((event: NavigationEnd) => event.urlAfterRedirects)
            )
            .subscribe((url: string) => {
                const urlParts = url.split('/').filter((part) => part !== '');
                this.currentRoute = urlParts[0] || 'home';
                this.currentSubRoute = urlParts[1] || (this.sidebarItems[this.currentRoute] ? this.sidebarItems[this.currentRoute][0].toLowerCase() : '');
            });
    }

    loadAvailableGuilds() {
        this.sidebarService.getAvailableGuilds().subscribe({
            next: (guilds: { guildId: string; name: string; picture: string }[]) => {
                this.availableGuilds = guilds;
                if (this.availableGuilds.length > 0) {
                    this.selectedGuildId = this.availableGuilds[0].guildId;
                    this.onGuildChange({ value: this.selectedGuildId });
                }
            },
            error: (error) => {
                console.error('Error fetching available guilds:', error);
            },
        });
    }

    onGuildChange(event: any) {
        const selectedGuildId = event.value;
        this.store.dispatch(selectGuild({ guildId: selectedGuildId }));
    }
}
