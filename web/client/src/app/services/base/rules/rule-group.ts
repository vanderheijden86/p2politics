import { RuleSet } from './rule-set';
import { State } from './state';

interface Actions {
    [key: string]: RuleSet;
}

export class RuleGroup {
    constructor(private actions: Actions) {
    }

    getRuleSet(action: string | number): RuleSet {
        let ruleSet = this.actions[action];
        if(!ruleSet) throw new Error(`Could not find RuleSet for given action, '${action}'`);
        return ruleSet;
    }

    validateAll(action: string | number, ...data: any[]): State {
        return this.getRuleSet(action).validate(data);
    }

    validateSingle(action: string | number, rule: string | number, ...data: any[]): boolean {
        return this.getRuleSet(action).getRule(rule).execute(data);
    }
}
