import { Rule, RuleGroup, RuleSet, RuleUtils, PassType, State } from './index';

describe('Rules', () => {

    describe('Rule', () => {
        let ruleSpyObj: {ruleFn: () => boolean};
        beforeEach(() => {
            ruleSpyObj = {
                ruleFn: () => {
                    return true;
                }
            };
            spyOn(ruleSpyObj, 'ruleFn');
        });

        it('Should execute rule function (once) on validate', () => {
            let rule = new Rule(ruleSpyObj.ruleFn);

            rule.validate();
            expect(ruleSpyObj.ruleFn).toHaveBeenCalledTimes(1);
        });

        it('Should have the correct arguments in the rule function', () => {
            let rule = new Rule(ruleSpyObj.ruleFn);

            rule.validate('arg1', 'arg2', 10, true, { something: 'test' });
            expect(ruleSpyObj.ruleFn).toHaveBeenCalledWith('arg1', 'arg2', 10, true, { something: 'test' });
        });
    });

    describe('RuleSet', () => {
        let ruleSet;
        beforeEach(() => {
            ruleSet = {
                'rule1': new Rule(() => true),
                'rule2': new Rule(() => false)
            };
        });

        it('Should throw error on unknown Rule', () => {
            expect(() => {
                new RuleSet(ruleSet).getRule('notfound');
            }).toThrowError();
        });

        it('Should validate all stateDefinitions in the RuleSet set', () => {
            let set = new RuleSet(ruleSet);
            let state = set.validate([]);

            expect(state).toEqual(new State({
                rule1: true,
                rule2: false
            }));
        });

        it('Should give all executed rules the same arguments', () => {
            spyOn(ruleSet.rule1, 'fn');
            spyOn(ruleSet.rule2, 'fn');

            let set = new RuleSet(ruleSet);
            set.validate(['arg1', 1, true, { test: 'something' }]);

            expect(ruleSet.rule1.fn).toHaveBeenCalledWith('arg1', 1, true, { test: 'something' });
            expect(ruleSet.rule2.fn).toHaveBeenCalledWith('arg1', 1, true, { test: 'something' });
        });
    });

    describe('RuleGroup', () => {
        let ruleSet;
        let ruleSet2;
        let ruleGroup: RuleGroup;
        beforeEach(() => {
            ruleSet = {
                'rule1': new Rule(() => true),
                'rule2': new Rule(() => false),
                'rule3': new Rule(() => 1 === 0),
                'rule4': new Rule(() => true === false)
            };
            ruleSet2 = {
                'something1': new Rule(() => true),
                'something2': new Rule(() => false)
            };

            ruleGroup = new RuleGroup({
                'testSet': new RuleSet(ruleSet),
                'otherSet': new RuleSet(ruleSet2)
            });
        });

        it('Should throw error on unknown RuleSet', () => {
            expect(() => {
                ruleGroup.getRuleSet('test');
            }).toThrowError();
        });

        it('Should have state result of all rules in given RuleSet', () => {
            let state = ruleGroup.validateAll('testSet');
            expect(state).toEqual(new State({
                rule1: true,
                rule2: false,
                rule3: false,
                rule4: false
            }));
        });

        it('Should have the same arguments for all rules in given RuleSet', () => {
            spyOn(ruleSet2.something1, 'fn');
            spyOn(ruleSet2.something2, 'fn');

            ruleGroup.validateAll('otherSet', 'same', 'args', 10);

            expect(ruleSet2.something1.fn).toHaveBeenCalledWith('same', 'args', 10);
            expect(ruleSet2.something2.fn).toHaveBeenCalledWith('same', 'args', 10);
        });

        it('Should have result for single run validation on RuleSet', () => {
            let result = ruleGroup.validateSingle('testSet', 'rule2');
            expect(result).toBe(ruleSet.rule2.validate());
        });
    });

    describe('RuleUtils', () => {
        let rule1: Rule;
        let rule2: Rule;

        beforeEach(() => {
            rule1 = new Rule(() => true);
            rule2 = new Rule(() => false);

            spyOn(rule1, 'fn').and.callThrough();
            spyOn(rule2, 'fn').and.callThrough();
        });

        it('Should combine and validate 2 rules', () => {
            let result = RuleUtils.combine(PassType.All, [rule1, rule2]).validate();

            expect((<any>rule1).fn).toHaveBeenCalledTimes(1);
            expect((<any>rule2).fn).toHaveBeenCalledTimes(1);

            expect(result).toBe(false);
        });

        it('Should combine and call 2 rules with the same arguments', () => {
            RuleUtils.combine(PassType.All, [rule1, rule2]).validate([1, 2, 'test'], ['arg', true]);

            expect((<any>rule1).fn).toHaveBeenCalledWith(1, 2, 'test');
            expect((<any>rule2).fn).toHaveBeenCalledWith('arg', true);
        });

        it('Should validate correctly with different pass types', () => {
            let res1 = RuleUtils.combine(PassType.All, [rule1, rule2]).validate();
            expect(res1).toBe(false);

            let res2 = RuleUtils.combine(PassType.Any, [rule1, rule2]).validate();
            expect(res2).toBe(true);
        });
    });
});
