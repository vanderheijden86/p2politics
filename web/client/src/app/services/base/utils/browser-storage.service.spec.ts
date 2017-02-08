import { inject, TestBed } from '@angular/core/testing';

import { BrowserStorageService } from './browser-storage.service';

describe('BrowserStorageService', () => {

    let browserStorageService: BrowserStorageService;

    beforeEach(() => TestBed.configureTestingModule({
        providers: [BrowserStorageService]
    }));

    beforeEach(inject([BrowserStorageService], (_browserStorageService) => {

        browserStorageService = _browserStorageService;
        browserStorageService.init({
            storageType: 'localStorage',
            prefix: 'zibUnitTest'
        });
    }));

    afterEach(() => {
        browserStorageService.clear();
    });

    it('Should initialize correctly', () => {
        expect(browserStorageService).toBeDefined();
    });

    it('Should be able to read and write simple types to the Storage object', () => {
        browserStorageService.set('simpleTest1', 1);
        expect(browserStorageService.get('simpleTest1')).toBe('1');

        browserStorageService.set('simpleTest2', 'abcdefg12');
        expect(browserStorageService.get('simpleTest2')).toBe('abcdefg12');

        browserStorageService.set('simpleTest3', false);
        expect(browserStorageService.get('simpleTest3')).toBe('false');
    });

    it('Should be able to store and retrieve object as JSON', () => {
        // example JSON with various types
        let original = {
            id: 1,
            name: 'A green door',
            price: 12.50,
            tags: ['home', 'green', 0]
        };

        browserStorageService.setJSON('jsonTest1', original);
        let stored = browserStorageService.getJSON('jsonTest1');

        // iterate every item in the object
        Object.keys(original).forEach((key) => {
            // the value in the stored value must equal the original value
            expect(stored[key]).toEqual(original[key]);
        });
    });

    it('Should throw an error if the object to be stored or retrieved is not well formed', () => {
        // on error stringify JSON
        expect(() => {
            let circularObject: {a?: Object} = {};
            circularObject.a = circularObject;
            // try converting circular Object to JSON
            browserStorageService.setJSON('errorTest1', circularObject);
        }).toThrowError();

        // on error parsing JSON
        expect(() => {
            // write a malformed JSON
            browserStorageService.set('errorTest2', '{a:NaN}');
            browserStorageService.getJSON('errorTest2');
        }).toThrowError();
    });

    it('Should remove a stored value', () => {
        browserStorageService.set('deleteTest1', 1);
        browserStorageService.del('deleteTest1');
        expect(browserStorageService.get('deleteTest1')).toBeNull();
    });

    it('Should clear all stored value with prefixed key', () => {
        // write directly to the storage without any prefix
        let rawStorage = window[browserStorageService.CONFIG.storageType];
        rawStorage.setItem('unprefixedClearTest1', 'somestring1');

        browserStorageService.set('clearTest1', 'somestring2');
        browserStorageService.clear();

        expect(rawStorage['unprefixedClearTest1']).toEqual('somestring1');
        expect(rawStorage['clearTest1']).toBeUndefined();

        // clean up
        rawStorage.removeItem('unprefixedClearTest1');
    });

    // Note: This test disabled, because it will clear all stored objects in Storage
    xit('Should clear all stored value', () => {
        browserStorageService.set('clearAllTest1', 1);
        browserStorageService.set('clearAllTest2', false);
        browserStorageService.set('clearAllTest3', 'some string');

        browserStorageService.clearAll();

        expect(window[browserStorageService.CONFIG.storageType].length).toEqual(0);
    });
});
