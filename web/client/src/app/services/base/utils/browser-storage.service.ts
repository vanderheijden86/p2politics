import { Injectable } from '@angular/core';

export interface BrowserStorageConfig {
    storageType: string;
    prefix: string;
}

@Injectable()
export class BrowserStorageService {
    CONFIG: BrowserStorageConfig;
    private webStorage;

    init(CONFIG: BrowserStorageConfig) {
        if(typeof window[CONFIG.storageType] === 'undefined') {
            throw new Error('window.' + CONFIG.storageType + ' is not available.');
        }

        // attach the storage type to use to the storage object
        this.webStorage = window[CONFIG.storageType];
        this.CONFIG = CONFIG;
    }

    has(key: string) {
        return !!this.webStorage.getItem(this.getFormattedKey(key));
    }

    get(key: string): string {
        return this.webStorage.getItem(this.getFormattedKey(key));
    }

    getJSON(key: string, formatted = true): Object {
        let item: string = this.webStorage.getItem(formatted ? this.getFormattedKey(key) : key);
        let ret: Object = null;

        // check the value of item retrieved
        if(item !== null) {
            try {
                ret = JSON.parse(item);
            } catch (error) {
                throw new Error(error);
            }
        }

        return ret;
    }

    set(key: string, value: any) {
        this.webStorage.setItem(this.getFormattedKey(key), value);
    }

    setJSON(key: string, value: any) {
        try {
            this.webStorage.setItem(this.getFormattedKey(key), JSON.stringify(value));
        } catch (error) {
            throw new Error(error);
        }
    }

    del(key: string) {
        this.webStorage.removeItem(this.getFormattedKey(key));
    }

    clear() {
        let items = Object.keys(this.webStorage);
        let prefixRegExp = new RegExp(this.CONFIG.prefix);

        for(let i = 0; i < items.length; i++) {
            let currentKey = items[i];
            if(prefixRegExp.test(currentKey)) {
                this.webStorage.removeItem(currentKey);
            }
        }
    }

    clearAll() {
        this.webStorage.clear();
    }

    private getFormattedKey(key) {
        return this.CONFIG.prefix + key;
    }
}
