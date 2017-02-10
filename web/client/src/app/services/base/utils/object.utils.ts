import { Injectable } from '@angular/core';

@Injectable()
export class ObjectUtils {
    recursivePropertyOverwrite(properties, target, ...sources) {
        sources = sources.filter(source => source !== undefined && source !== null);
        if(ObjectUtils.isArray(target)) {
            for(let i = 0; i < target.length; ++i) {
                this.recursivePropertyOverwrite(properties, target[i], ...sources.map(source => source[i]));
            }
        } else if(ObjectUtils.isObject(target)) {
            for(let property in target) {
                if(properties.indexOf(property) !== -1) {
                    sources = sources.filter(source => ObjectUtils.isObject(source));
                    for(let source of sources) {
                        if(!(property in source)) continue;
                        target[property] = source[property];
                    }
                    continue;
                }
                this.recursivePropertyOverwrite(properties, target[property], ...sources.map(source => source[property]));
            }
        }
    }

    static isArray(target) {
        return typeof target === 'array';
    }

    static isObject(target) {
        return typeof target === 'object';
    }
}
