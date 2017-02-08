import { Headers, Response, ResponseOptions } from '@angular/http';
import { MockConnection } from '@angular/http/testing';

export class MockHelper {
    static getDefaultResponseWithBody(body: any, asJson: boolean = true) {
        return this.getDefaultResponse(undefined, body, asJson);
    }

    static getDefaultResponse(c?: MockConnection, body?: any, asJson?: boolean) {
        let headers = asJson ? new Headers({'content-type': 'application/json'}) : new Headers();
        return new Response(new ResponseOptions({
            body: c ? c.request.text() : (asJson ? JSON.stringify(body) : body || ''),
            headers: headers,
            status: 200
        }));
    }
}
