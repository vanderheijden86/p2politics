import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import 'rxjs/add/observable/never';

import 'rxjs/add/operator/concatMap';
import 'rxjs/add/operator/switchMap';

export class RepositoryCache<T> {

    private propertyCache: {
        [key: string]: {
            source: BehaviorSubject<T>,
            sourceObservable?: Observable<T>,
            locker: BehaviorSubject<boolean>,
            observable?: Observable<T>
        }
    } = {};
    private lockedKeys: { [key: string]: boolean } = {};

    constructor(public noCacheFallback?: (...args: any[]) => Observable<T>) { }

    getCurrentValue(key: string) {
        return this.get(key).source.getValue();
    }

    hasKey(key: string) {
        return this.propertyCache[key] !== undefined;
    }

    observe(key: string, ...args: any[]) {
        return this.cacheObserve(key, 'observable', args);
    }

    observeSource(key: string, ...args: any[]) {
        return this.cacheObserve(key, 'sourceObservable', args);
    }

    refresh(key: string, ...args: any[]) {
        let obs = this.executeNoCacheFallback(args);
        obs.subscribe(res => {
            this.update(key, res);
        });
        return obs;
    }

    update(key: string, value: T) {
        this.get(key).source.next(value);
    }

    remove(key: string) {
        this.get(key).source.complete();
        this.get(key).locker.complete();
        delete this.propertyCache[key];
    }

    lock(key: string) {
        if(this.hasKey(key)) {
            this.get(key).locker.next(true);
        } else {
            this.lockedKeys[key] = true;
        }
    }

    free(key: string) {
        if(this.hasKey(key)) {
            this.get(key).locker.next(false);
        } else {
            delete this.lockedKeys[key];
        }
    }

    setNewKey(oldKey: any, newKey: any) {
        this.propertyCache[newKey] = this.propertyCache[oldKey];
        delete this.propertyCache[oldKey];
    }

    private set(key: string, value: T) {
        let locked = this.lockedKeys[key];
        this.propertyCache[key] = {
            source: new BehaviorSubject(value),
            locker: new BehaviorSubject(locked)
        };
        if(locked) {
            delete this.lockedKeys[key];
        }

        this.propertyCache[key].sourceObservable = this.propertyCache[key].source.asObservable();
        this.propertyCache[key].observable = this.getLockableObservable(this.propertyCache[key]);
    }

    private getLockableObservable(dataContainer: { source: BehaviorSubject<T>, locker: Subject<boolean> }) {
        return dataContainer.locker.switchMap<boolean, T>(locker => locker ? Observable.never() : dataContainer.source.asObservable());
    }

    private get(key: string) {
        if(!this.propertyCache[key]) {
            throw new Error(`Could not find key, ${key}, in RepositoryCache object`);
        }
        return this.propertyCache[key];
    }

    private cacheObserve(key: string, type: 'observable' | 'sourceObservable', args: any[]): Observable<T> {
        if(!this.propertyCache[key]) {
            return this.executeNoCacheFallback(args).concatMap<T, T>(res => {
                if(!this.propertyCache[key]) {
                    this.set(key, res);
                }
                return this.propertyCache[key][type];
            });
        }

        return this.propertyCache[key][type];
    }

    private executeNoCacheFallback(args: any[]): Observable<T> {
        return this.noCacheFallback.apply(undefined, args);
    }
}
