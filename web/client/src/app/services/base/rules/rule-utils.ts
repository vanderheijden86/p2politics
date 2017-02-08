import { BaseRule, Rule } from './rule';

export enum PassType { All, Any };

export class RuleUtils {
    static combine(passType: PassType, rules: BaseRule[]) {
        if(!(passType in PassType)) throw new Error('Invalid PassType supplied for combining multiple rules');
        return RuleUtils.createPassMultipleRule(rules, passType,
                (passedRules) => (passType === PassType.All ? passedRules === rules.length : passedRules !== 0));
    }

    private static createPassMultipleRule(rules: BaseRule[], passType: PassType, validation: (length: number) => boolean) {
        return new Rule((...data: any[]) => {
            return validation(RuleUtils.validateRules(rules, passType, data));
        });
    }

    private static validateRules(rules: BaseRule[], passType: PassType, data: any[]) {
        let executeFunc = (rule: BaseRule, i) => {
            return rule.execute(data[i]);
        };
        return passType === PassType.Any ? (rules.some(executeFunc) ? 1 : 0) : (rules.filter(executeFunc).length);
    }
}
