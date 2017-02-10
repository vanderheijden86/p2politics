export interface BaseRule {
    setRuleDefinition(fn: RuleFunction);
    execute(data: any[]): boolean;
    validate(...data: any[]): boolean;
}

export interface RuleFunction {
    (...data: any[]): boolean;
}

export class Rule implements BaseRule {

    constructor(private fn?: RuleFunction) {
        if(fn) {
            this.setRuleDefinition(fn);
        }
    }

    setRuleDefinition(fn: RuleFunction) {
        if(typeof fn !== 'function') throw new TypeError('Given Rule definition is not of type Function');
        this.fn = fn;
    }

    execute(data: any[]): boolean {
        return this.fn.apply(this, data);
    }

    validate(...data: any[]): boolean {
        return this.execute(data);
    }
}
