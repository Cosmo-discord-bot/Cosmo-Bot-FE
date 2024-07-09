import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
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
        statistics: ['Overview', 'Users', 'Commands', 'Servers'],
        commands: ['List', 'Add', 'Edit', 'Delete'],
        // Add more routes and their corresponding sidebar items
    };

    constructor(private router: Router) {}

    ngOnInit() {
        //this.router.events
        //    .pipe(
        //        filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd),
        //        map((event: NavigationEnd) => event.urlAfterRedirects)
        //    )
        //    .subscribe((url: string) => {
        //        this.currentRoute = url.split('/')[1] || 'home';
        //    });

        this.currentRoute = 'statistics';
    }
}
