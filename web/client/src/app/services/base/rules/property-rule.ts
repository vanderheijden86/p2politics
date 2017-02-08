import { Rule } from './rule';

export enum MatchType { All, Any };

export interface Properties {
    [key: string]: any[];
}

export class PropertyRule extends Rule {

    constructor(props: any[], matchType = MatchType.All, subMatchType = MatchType.All) {
        super();
        this.setRuleDefinition((...data: any[]) => this.validateProps(props, data, matchType, subMatchType));
    }

    private validateProps(props: any[], data: any[], matchType: MatchType, subMatchType: MatchType): boolean {
        let length = props.length > data.length ? data.length : props.length;
        if(length === 0)
            throw new Error('No data or properties found to validate on, ' +
            `data args: ${data.length}, properties: ${props.length}, are you missing some arguments?`);

        let matches = 0;
        for(let i = 0; i < length; ++i) {
            let matchResult = this.hasMatch(props[i], data[i], matchType, subMatchType);

            if(matchResult) {
                if(matchType === MatchType.Any) {
                    return true;
                }
                ++matches;
            }
        }
        return matches === length;
    }

    private hasMatch(propSet, dataValue, matchType, subMatchType) {
        if(typeof propSet === 'object') {
            let matched = this.matchWithPropSetAsObject(propSet, dataValue, matchType, subMatchType);
            if(matched) {
                return true;
            }
        } else if(propSet === dataValue) {
            return true;
        }
        return false;
    }

    private matchWithPropSetAsObject(propSet, dataValue, matchType, subMatchType) {
        let propLength = Object.keys(propSet).length;
        if(propLength === 0) throw new Error('PropertySet is empty');

        let subMatches = this.countSubMatches(propSet, dataValue, matchType, subMatchType);
        // -1 = Matched as Any
        if(subMatches === -1 || subMatches === propLength) {
            return true;
        }
        return false;
    }

    private countSubMatches(propSet, dataValue, matchType, subMatchType) {
        let dataIsObject = typeof dataValue === 'object';

        let subMatches = 0;
        for(let key in propSet) {
            let reverseMatch = false;
            let propSetValues: any[] = propSet[key];
            if(key[0] === '!') {
                key = key.substr(1);
                reverseMatch = true;
            }

            if(dataIsObject && !(key in dataValue)) throw new Error(`Property '${key}' not available on data object`);

            let match = dataIsObject ? dataValue[key] : dataValue;
            let matched = reverseMatch ? propSetValues.indexOf(match) === -1 : propSetValues.indexOf(match) !== -1;
            if(matched) {
                if(subMatchType === MatchType.Any) {
                    return -1; // Has match, state is true
                }
                ++subMatches;
            }
        }
        return subMatches;
    }

}
