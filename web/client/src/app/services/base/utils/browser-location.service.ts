import { Injectable } from '@angular/core';

@Injectable()
export class BrowserLocationService {

    search(str?: string) {
        let search = str || (document.location.search) ? document.location.search.substring(1) : undefined;
        if(!search) return;

        let pairs = search.split('&');
        let res = {};
        for(let i = 0; i < pairs.length; ++i) {
            let pair = pairs[i].split('=');
            let key = pair[0];
            let value = pair[1];
            if(!key) continue;
            if(value) {
                value = decodeURIComponent(value.replace(/\+/g, ' '));
            } else if(value === undefined) {
                value = '';
            }
            res[key] = value;
        }
        return res;
    }
}
