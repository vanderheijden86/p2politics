import { Injectable } from '@angular/core';
import { ObjectUtils } from './object.utils';

export interface MappingData {
    [key: string]: MappingObject|string;
}

export interface MappingObject {
    $replace?: string;
    $process?: (val) => any;
    $mapping?: MappingData;
    $filterEmpty?: boolean;
}

@Injectable()
export class BaseMapper {

    static map(obj: any, mapping: MappingData) {
        if(!mapping) throw new Error('No mapping information present');
        if(!ObjectUtils.isObject(obj)) throw new Error('Cannot map non object');
        if(ObjectUtils.isArray(obj)) {
            for(let i = 0; i < obj.length; ++i) {
                BaseMapper.map(obj[i], mapping);
            }
            return obj;
        }
        return BaseMapper.mapObject(obj, mapping);
    }

    private static handleMappingObj(obj: Object, origin: string, replaceObj: MappingObject) {
        if(!(origin in obj)) return;
        let key = origin;
        if(replaceObj.$replace) {
            key = replaceObj.$replace;
            BaseMapper.replaceKey(obj, origin, key);
        }
        if(replaceObj.$process) {
            obj[key] = replaceObj.$process(obj[key]);
        }
        if(replaceObj.$mapping) {
            BaseMapper.map(obj[key], replaceObj.$mapping);
        }
    }

    private static mapObject(obj: any, mapping: MappingData) {
        for(let origin in mapping) {
            let replace = mapping[origin];
            if(ObjectUtils.isObject(replace)) {
                let repObj: MappingObject = replace;
                if(ObjectUtils.isArray(obj[origin])) {
                    for(let i = 0; i < obj[origin].length; ++i) {
                        if(!repObj.$filterEmpty || obj[origin][i]) {
                            BaseMapper.map(obj[origin][i], repObj.$mapping);
                        } else {
                            obj[origin].splice(i--, 1);
                        }
                    }
                    if(repObj.$replace) {
                        BaseMapper.replaceKey(obj, origin, repObj.$replace);
                    }
                } else {
                    BaseMapper.handleMappingObj(obj, origin, replace);
                }
            } else {
                BaseMapper.replaceKey(obj, origin, <string>replace);
            }
        }
        return obj;
    }

    private static replaceKey(obj: Object, origin: string, replace: string) {
        if(origin in obj) {
            if(replace === origin) return;
            if(replace !== 'D') {
                obj[replace] = obj[origin];
            }
            delete obj[origin];
        }
    }

    map(obj: any, mapping: MappingData) {
        return BaseMapper.map(obj, mapping);
    }
}
