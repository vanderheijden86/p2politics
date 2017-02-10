import { Injectable } from '@angular/core';

interface Api {
    ethereum: string;
    contracts: string;
}

@Injectable()
export class HttpConfig {
    api: Api;
    useStub: boolean;

    constructor() {
        this.useStub = false;

        let rootUrl = '/';

        this.api = this.setApiUrls(rootUrl, {
            ethereum: '/',
            contracts: '/'
        });

        if (document.location.hostname === 'localhost') {
            rootUrl = 'http://localhost:3001/';
            this.api = this.setApiUrls(rootUrl);
        }
    }

    private setApiUrls(rootUrl: string, serviceSuffixes: Api = <any>{}): Api {
        let services: Api = {
            ethereum: `${rootUrl}v1/`,
            contracts: `${rootUrl}contracts/`
        };
        for (let service in serviceSuffixes) {
            services[service] += serviceSuffixes[service];
        }
        return services;
    }
}
