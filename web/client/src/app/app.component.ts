import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { MdSidenav } from '@angular/material';
import { Subscription } from 'rxjs/Subscription';

import { AppReadyEvent } from './utils/app-ready-event';

import { AppConfig } from './core/app.config';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
    @ViewChild('sidenav') sidenav: MdSidenav;

    private routeEventSubscription: Subscription;

    constructor(
        private router: Router,
        private appReadyEvent: AppReadyEvent,

        private appConfig: AppConfig) {
        appConfig.configureApp();
    }

    ngOnInit() {
        // trigger that the app is ready (so the pre-bootstrap splashscreen can be removed)
        this.appReadyEvent.trigger();

        this.routeEventSubscription = this.router.events
            .subscribe((event) => {
                if (event instanceof NavigationStart) {
                    if (event.url === '/') {
                        this.sidenav.open();
                    } else {
                        this.sidenav.close();
                    }
                }
            });
    }

    ngOnDestroy() {
        this.routeEventSubscription.unsubscribe();
    }
}
