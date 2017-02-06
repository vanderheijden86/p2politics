import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Broadcaster } from './utils/broadcaster';
import { AppReadyEvent } from './utils/app-ready-event';

import { AppConfig } from './app.config';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  constructor(
    private router: Router,
    private broadcaster: Broadcaster,
    private appReadyEvent: AppReadyEvent,
    private appConfig: AppConfig) {
  }

  ngOnInit() {
    // TODO remove
    this.router.navigate(['/info']);
  }
}
