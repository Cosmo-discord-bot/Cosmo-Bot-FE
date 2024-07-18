import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [CommonModule, RouterModule, MatListModule, MatSidenavModule],
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit {
    currentRoute: string = '';
    sidebarItems: { [key: string]: string[] } = {
        home: ['TODO'],
        statistics: ['Overview', 'Music', 'Voice', 'Messages'],
        // TODO: Get commands from API
        commands: ['Overview', 'Music', 'Settings'],
        docs: ['API'],
        // Add more routes and their corresponding sidebar items
    };

    constructor(private router: Router) {}

    ngOnInit() {
        this.router.events
            .pipe(
                filter((event): event is NavigationEnd => event instanceof NavigationEnd),
                map((event: NavigationEnd) => event.urlAfterRedirects)
            )
            .subscribe((url: string) => {
                this.currentRoute = url.split('/')[1] || 'home';
            });
    }
}
