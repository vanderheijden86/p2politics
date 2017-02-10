import { BaseRule } from './rule';
import { State } from './state';

interface StateDefinition {
    [key: string]: BaseRule;
}

export class RuleSet {

    constructor(private stateDefinition: StateDefinition) { }

    getRule(state: string | number): BaseRule {
        let rule = this.stateDefinition[state];
        if(!rule) throw new Error(`Could not find Rule for given state, '${state}'`);
        return rule;
    }

    hasRule(state: string | number) {
        return state in this.stateDefinition;
    }

    validate(data: any[]) {
        let state = new State();
        for(let key in this.stateDefinition) {
            let rule = this.stateDefinition[key];
            state[key] = rule.execute(data);
        }
        return state;
    }
}
