import { Injectable } from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { NotificationsService } from 'angular2-notifications/components';
import { Observable } from 'rxjs/Observable';

import { AppConfig } from '../app.config';

import { UserModel } from '../models';

export abstract class BaseServiceAgent {
    constructor(
        private http: Http,
        protected notificationsService: NotificationsService,
        protected appConfig: AppConfig) {
    }

    // showLocalhostNotificationIfApplicable() {
    //     if (this.appConfig.useLocalHost) {
    //         this.notificationsService.info('LET OP', 'call is naar localhost!', { timeOut: 500, preventDuplicates: true });
    //     }
    // }
    get(
        user: UserModel,
        route: string): Observable<any> {
        // this.showLocalhostNotificationIfApplicable();
        // console.log('BaseServiceAgent.get', 'route', route);

        let rootUrl = this.appConfig.webapiRootUrl;
        let observable = this.http.get(`${rootUrl}${route}`, {
            headers: this.getHeadersWithOptionalAuthHeader(user),
        }).map((response: Response) => {
            let result = response.json();
            return result;
        }).share();

        observable.subscribe(
            response => {
                return response;
            },
            error => {
                console.log(error);
                this.notificationsService.error('Er is een fout opgetreden', this.getErrorMessage(error));
            });
        return observable;
    }

    post(
        user: UserModel,
        route: string,
        data: any): Observable<any> {
        // this.showLocalhostNotificationIfApplicable();
        // console.log('BaseServiceAgent.post', 'route', route);

        let rootUrl = this.appConfig.webapiRootUrl;

        let body = JSON.stringify(data);
        let observable = this.http.post(`${rootUrl}${route}`, body, {
            headers: this.getHeadersWithOptionalAuthHeader(user),
        })
            .map((response: Response) => {
                let result = response.json();
                return result;
            }).share();

        observable.subscribe(
            response => {
                return response;
            },
            error => {
                console.error(error);
                this.notificationsService.error('Er is een fout opgetreden', this.getErrorMessage(error));
            });
        return observable;
    }

    private getHeadersWithOptionalAuthHeader(user: UserModel): Headers {
        let headers = new Headers();
        if (user) {
            headers.append('Authorization', 'Basic ' + btoa(user.username + ':' + user.password));
        }
        headers.append('Content-Type', 'application/json');
        return headers;
    }

    private getErrorMessage(error): string {
        let message = error._body ? error._body : 'Er is een fout opgetreden';
        if (typeof message !== 'string') {
            message = 'Er is een fout opgetreden';
        }
        message = message.replace('Error occurred: ', '');
        if (message.indexOf('{') > -1) {
            let contractError = JSON.parse(message);
            if (contractError && contractError.contractMessage) {
                return contractError.contractMessage;
            }
        }
        let status = error.status ? ` (http-status=${error.status})` : '';
        let result = `${message}${status}`;
        return result;
    }
}
