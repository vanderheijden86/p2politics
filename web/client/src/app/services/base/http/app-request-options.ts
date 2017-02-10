import { Headers, RequestMethod, RequestOptions, RequestOptionsArgs } from '@angular/http';

interface AppRequestOptionsArgs extends RequestOptionsArgs {
    body?: any;
    useGlobalOnError?: boolean;
    cache?: boolean;
}

const JSON_TYPE = 'application/json';

export class AppRequestOptions extends RequestOptions {
    static defaultHeaders: Headers = new Headers({
        'Accept': JSON_TYPE,
        'Content-Type': JSON_TYPE
    });

    method = RequestMethod.Get;
    useGlobalOnError: boolean;
    cache: boolean;

    constructor(private requestOptionsArgs: AppRequestOptionsArgs) {
        super(requestOptionsArgs);
        this.useGlobalOnError = requestOptionsArgs.useGlobalOnError !== undefined ? requestOptionsArgs.useGlobalOnError : true;
        this.cache = requestOptionsArgs.cache !== undefined ? requestOptionsArgs.cache : true;
        this.setDefaultHeaders();

        if(RequestMethod[requestOptionsArgs.method]) {
            this.method = <RequestMethod>requestOptionsArgs.method;
        }
    }

    private setDefaultHeaders() {
        if(!this.headers) {
            this.headers = AppRequestOptions.defaultHeaders;
        } else {
            AppRequestOptions.defaultHeaders.forEach((values, name) => {
                if(!this.headers.has(name)) this.headers.set(name, values);
            });
        }
    }
}
