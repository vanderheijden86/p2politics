import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import { NotificationsService, SimpleNotificationsModule } from 'angular2-notifications/components';

import './rxjs-extensions';

import { AppConfig } from './app.config';
import { routing } from './app.routing';
import { Broadcaster } from './utils/broadcaster';
import { AppReadyEvent } from './utils/app-ready-event';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MaterialModule.forRoot(),
    SimpleNotificationsModule,
    routing,
  ],
  providers: [
    FormBuilder,
    NotificationsService,
    AppConfig,
    Broadcaster,
    AppReadyEvent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
