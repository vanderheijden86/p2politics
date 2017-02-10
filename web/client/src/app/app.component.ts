import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MdSidenav } from '@angular/material';

import { Broadcaster } from './utils/broadcaster';
import { AppReadyEvent } from './utils/app-ready-event';

import { AppConfig } from './core/app.config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    @ViewChild('sidenav') sidenav: MdSidenav;

    constructor(
        private router: Router,
        private appConfig: AppConfig) {
        appConfig.configureApp();
    }

    ngOnInit() {
        this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    if (event.url === '/home') {
                        this.sidenav.open();
                    } else {
                        this.sidenav.close();
                    }
                }
            });
    }
}
