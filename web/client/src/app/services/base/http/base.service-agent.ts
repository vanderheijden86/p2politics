import { Injectable } from '@angular/core';
import { Http, Request, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/share';

import { AppRequestOptions } from './app-request-options';

export interface BaseServiceAgentConfig {
    onError?: (error: Response) => void;
    ignoreProperties?: string[];
}

@Injectable()
export class BaseServiceAgent {
    callCache: any = {};

    private config: BaseServiceAgentConfig;

    constructor(private http: Http) { }

    configure(config: BaseServiceAgentConfig) {
        this.config = config;
    }

    doHttpCall<T>(appRequestOptions: AppRequestOptions): Observable<T> {
        let key = appRequestOptions.url + ((appRequestOptions.search) ? appRequestOptions.search.toString() : '');

        if(appRequestOptions.cache && this.callCache[key]) {
            return this.callCache[key];
        }

        if(appRequestOptions.body) {
            appRequestOptions.body = JSON.stringify(appRequestOptions.body,
                (this.config || {}).ignoreProperties ? this.handleIgnoredProperties(this.config.ignoreProperties) : undefined);
        }

        let obs = this.http.request(new Request(appRequestOptions)).map((response): T => {
            let contentType = response.headers.get('Content-Type') || response.headers.get('content-type');
            if(contentType && contentType.indexOf('application/json') !== -1) {
                return response.json();
            }
            return <any>response.text();
        }).share();

        let config = this.config;
        obs.subscribe(() => void 0,
            response => {
                this.deleteCallFromCache(appRequestOptions, key);
                if(appRequestOptions.useGlobalOnError && config && typeof config.onError === 'function') {
                    config.onError(response);
                }
            }, () => this.deleteCallFromCache(appRequestOptions, key)
        );

        this.callCache[key] = obs;

        return obs;
    }

    private deleteCallFromCache(appRequestOptions: AppRequestOptions, key) {
        if(appRequestOptions.cache) {
            delete this.callCache[key];
        }
    }

    private handleIgnoredProperties(ignoreProperties: string[]) {
        return (key: string, value: any) => ignoreProperties.indexOf(key) !== -1 ? undefined : value;
    }
}
