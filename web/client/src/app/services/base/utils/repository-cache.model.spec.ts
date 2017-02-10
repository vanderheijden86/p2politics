import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

import { RepositoryCache } from './repository-cache.model';

describe('RepositoryCache', () => {

    let repositoryCache: RepositoryCache<any>;

    let obj;
    let onNoCacheResult = 1;

    let testOb;
    beforeEach(() => {
        obj = {
            onNoCache: () => {
                return Observable.of(onNoCacheResult);
            }
        };
        spyOn(obj, 'onNoCache').and.callThrough();

        testOb = {
            fn: (a?) => a
        };
        spyOn(testOb, 'fn');

        repositoryCache = new RepositoryCache<any>(obj.onNoCache);
    });

    for(let observeMethod of ['observe', 'observeSource']) {
        describe(`Test Suite - ${observeMethod}`, () => {
            let observe = (key, ...args: any[]) => repositoryCache[observeMethod].apply(repositoryCache, [key, ...args]);

            it('Should only return true with hasKey() when key is set in cache', () => {
                let key = 'testKey';
                expect(repositoryCache.hasKey(key)).toBe(false);

                observe(key).subscribe(() => {
                    expect(repositoryCache.hasKey(key)).toBe(true);
                });
            });

            it('Should call onNoCache only once (same key)', () => {
                let key = 'key1';
                observe(key).subscribe((n => {
                    observe(key).subscribe();
                    expect(obj.onNoCache).toHaveBeenCalledTimes(1);
                }));
            });

            it('Should call onNoCache multiple times (different keys)', () => {
                observe('key1').subscribe((n => {
                    observe('key2').subscribe();
                    expect(obj.onNoCache).toHaveBeenCalledTimes(2);
                }));
            });

            it('Should call subscription method on observe key', () => {
                let key = 'key';
                observe(key).subscribe(res => {
                    expect(res).toBe(onNoCacheResult);
                });
            });

            it('Should call observed subscription again on update key', () => {
                let key = 'key';
                observe(key).subscribe(res => {
                    testOb.fn(res);
                });

                repositoryCache.update(key, 'update');

                expect(testOb.fn).toHaveBeenCalledWith(1);
                expect(testOb.fn).toHaveBeenCalledWith('update');
                expect(testOb.fn).toHaveBeenCalledTimes(2);
            });

            it('Should call onNoCache again on refresh', () => {
                let key = 'key1';
                observe(key).subscribe();
                repositoryCache.refresh(key);
                expect(obj.onNoCache).toHaveBeenCalledTimes(2);
            });

            it('Should call observed key subscription again on refresh', () => {
                let key = 'key';
                observe(key).subscribe(res => {
                    testOb.fn(res);
                });

                repositoryCache.refresh(key);

                expect(testOb.fn).toHaveBeenCalledWith(1);
                expect(testOb.fn).toHaveBeenCalledTimes(2);
            });

            it('Should call onComplete and remove key from cache on remove(key)', () => {
                let key = 'key';
                observe(key).subscribe(() => void 0, () => void 0, () => {
                    testOb.fn();
                });
                repositoryCache.remove(key);

                expect(testOb.fn).toHaveBeenCalled();
                expect(() => repositoryCache.getCurrentValue(key)).toThrowError();
            });
        });
    }

    it('Should not call subscribe when locked', () => {
        let key = 'key';
        repositoryCache.observe(key).subscribe(res => {
            testOb.fn(res);
        });
        expect(testOb.fn).toHaveBeenCalledWith(1);

        repositoryCache.lock(key);
        repositoryCache.update(key, 'locked');
        expect(testOb.fn).toHaveBeenCalledTimes(1);

        repositoryCache.free(key);
        expect(testOb.fn).toHaveBeenCalledTimes(2);
        expect(testOb.fn).toHaveBeenCalledWith('locked');

        repositoryCache.update(key, 'free');
        expect(testOb.fn).toHaveBeenCalledTimes(3);
        expect(testOb.fn).toHaveBeenCalledWith('free');
    });

    it('Should call subscribe when locked on observeSource', () => {
        let key = 'key';
        repositoryCache.observeSource(key).subscribe(res => {
            testOb.fn(res);
        });
        expect(testOb.fn).toHaveBeenCalledWith(1);

        repositoryCache.lock(key);
        repositoryCache.update(key, 'locked');
        expect(testOb.fn).toHaveBeenCalledTimes(2);
        expect(testOb.fn).toHaveBeenCalledWith('locked');

        repositoryCache.free(key);
        expect(testOb.fn).toHaveBeenCalledTimes(2);

        repositoryCache.update(key, 'free');
        expect(testOb.fn).toHaveBeenCalledTimes(3);
        expect(testOb.fn).toHaveBeenCalledWith('free');
    });

    it('Should not call subscribe when first observe happens after lock', () => {
        let key = 'key';

        repositoryCache.lock(key);

        repositoryCache.observe(key).subscribe(res => {
            testOb.fn(res);
        });
        expect(testOb.fn).not.toHaveBeenCalled();

        repositoryCache.free(key);
        expect(testOb.fn).toHaveBeenCalled();
    });

    it('Should call subscribe when first observe happens after lock on observeSource', () => {
        let key = 'key';

        repositoryCache.lock(key);

        repositoryCache.observeSource(key).subscribe(res => {
            testOb.fn(res);
        });
        expect(testOb.fn).toHaveBeenCalled();

        repositoryCache.free(key);
        expect(testOb.fn).toHaveBeenCalledTimes(1);
    });
});
