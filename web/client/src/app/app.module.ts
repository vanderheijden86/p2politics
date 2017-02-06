import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { MaterialModule } from '@angular/material';
import 'hammerjs';

import './rxjs-extensions';

import { AppConfig } from './app.config';
import { routing } from './app.routing';
import { Broadcaster } from './utils/broadcaster';
import { AppReadyEvent } from './utils/app-ready-event';

import { AppComponent } from './app.component';
import { InfoServiceAgent } from './service-agents';

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
    routing,
  ],
  providers: [
    FormBuilder,
    AppConfig,
    Broadcaster,
    AppReadyEvent,
    InfoServiceAgent,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
