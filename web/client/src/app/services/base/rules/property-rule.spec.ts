import { MatchType, PropertyRule } from './property-rule';

describe('PropertyRule', () => {

    it('Should throw error on empty data args or empty properties', () => {
        let propRule = new PropertyRule([]);

        expect(() => propRule.validate('test', 'args')).toThrowError();

        propRule = new PropertyRule([{ 'arg': [1] }]);
        expect(() => propRule.validate()).toThrowError();
    });

    it('Should throw error on empty PropSet', () => {
        let propRule = new PropertyRule([{}]);

        expect(() => {
            propRule.validate('test');
        }).toThrowError();
    });

    it('Should validate props as complex objects', () => {
        let propRule = new PropertyRule([{
            'id': [1, 4, 7],
            'flag': ['A', 'B', 'R']
        }, {
            'some': ['prop'],
            'other': [false]
        }]);

        expect(propRule.validate({
            id: 4,
            flag: 'B'
        }, {
                some: 'prop',
                other: false
            })).toBe(true);
        expect(propRule.validate({
            id: 4,
            flag: 'B'
        }, {
                some: 'prop',
                other: true
            })).toBe(false);
    });

    it('Should validate props as simple types', () => {
        let propRule = new PropertyRule([1, 2, 3]);

        expect(propRule.validate(1, 2, 4)).toBe(false);
        expect(propRule.validate(1, 2, 3)).toBe(true);
    });

    it('Should validate props as mixed types', () => {
        let propRule = new PropertyRule([{
            'complex': ['type', 1, 2],
            'more': [1, 2, 3]
        }, 'other']);

        expect(propRule.validate({
            'complex': 1,
            'more': 3
        }, 'other')).toBe(true);
        expect(propRule.validate({
            'complex': 1,
            'more': 2
        }, 'something else')).toBe(false);
        expect(propRule.validate({
            'complex': 1,
            'more': 100
        }, 'other')).toBe(false);
    });

    it('Should validate props with reverse matching (!)', () => {
        let propRule = new PropertyRule([{
            'some': [3, 4, 5],
            '!other': [3, 4, 5]
        }]);

        expect(propRule.validate({
            some: 5,
            other: 6
        })).toBe(true);
        expect(propRule.validate({
            some: 3,
            other: 3
        })).toBe(false);
    });

    it('Should validate props with matchType Any', () => {
        let propRule = new PropertyRule([{
            'match': [1, 3, 4],
            'any': ['p', 'r', 'o', 'p']
        }, {
            'of': [false],
            'these': [6, 7, 8],
            'props': ['bla']
        }], MatchType.Any);

        expect(propRule.validate({
            'match': 3, // match
            'any': 'p' // match
        }, {
            'of': true,
            'these': 7,  // match
            'props': undefined
        })).toBe(true);

        expect(propRule.validate({
            'match': 5,
            'any': 'p' // match
        }, {
            'of': true,
            'these': 7,  // match
            'props': undefined
        })).toBe(false);
    });

    it('Should validate props with subMatchType Any', () => {
        let propRule = new PropertyRule([{
            'match': [1, 3, 4],
            'any': ['p', 'r', 'o', 'p']
        }, {
            'of': [false],
            'these': [6, 7, 8],
            'props': ['bla']
        }], MatchType.Any, MatchType.Any);

        expect(propRule.validate({
            'match': 'me',
            'with': 'a prop',
            'any': undefined
        }, {
                'of': true,
                'these': 7, // match
                'props': undefined
            })).toBe(true);

        expect(propRule.validate({
            'match': 'nothing',
            'in': 'this set',
            'any': undefined
        }, {
                'of': undefined,
                'still': false,
                'these': 'is also false',
                'props': 'bl'
            })).toBe(false);
    });
});
