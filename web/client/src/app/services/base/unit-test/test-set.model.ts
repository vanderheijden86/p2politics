interface Level {
    value: any;
    level?: Level[];
}

interface ValidCombinations {
    [key: string]: ValidCombinations | ((...args) => ValidCombinations | any) | any;
}

class TestCase {
    constructor(
        public expected: any, public args: any[]) {}
}

/**
 * Class that creates TestCases based on the levels given to this class.
 * Use this when you need to check multiple varieties of data
 * Example:
 * ```
 * levels = [
 *     { value: 'level1a', level: [{ value: 'level2a' }] },
 *     { value: 'level1b', level: [{ value: 'level2b' }, { value: 'level2c' }] }
 * ];
 * ```
 *
 * These levels will result in the following TestCases:
 * ```
 * [TestCase(args: ['level1a', 'level2a']), TestCase(args: ['level1b', 'level2b']), TestCase(args: ['level1b', 'level2c'])]
 * ```
 *
 * You can also use arrays for the value, [{ value: ['level1a', 'level1b'], level: ... }]
 *
 * This will result in the following TestCases:
 * ```
 * [TestCase('level1a', ...), TestCase('level1b', ...)]
 * ```
 *
 * ValidCombinations is the structure to give expected values to TestCases
 * Where the level values match the ValidCombination object properties
 * Example:
 * ```
 * levels = [
 *     { value: 'level1a', level: [{ value: 'level2a' }] },
 *     { value: 'level1b', level: [{ value: 'level2b' }, { value: 'level2c' }] }
 * ];
 * ```
 * Could have the following ValidCombinations object
 * ```
 * {
 *     'level1b': {
 *         'level2b': 'a string'  // Or any other expected value
 *         'level2c': true
 *     }
 * }
 * ```
 *
 * Instead of setting an object you can also set a function to return the next levels properties.
 * This code does the same as the object above
 * ```
 * {
 *     'level1b': (level1Value, level2Value) => {
 *         if(level2Value === 'level2b') {
 *             return { [level2Value]: 'a string' };
 *         }
 *         return { [level2Value]: true };
 *     }
 * }
 * ```
 */
export class TestSet {

    testCases: TestCase[];

    constructor(
        private validationSet: Level[],
        private validCombinations: ValidCombinations,
        private expectedDefault: any = false) { }

    getTestCases() {
        this.testCases = [];

        for(let rootLevel of this.validationSet) {
            this.processValidationSetLevel(rootLevel, []);
        }

        return this.testCases;
    }

    private processValidationSetLevel(level: Level, args: (string | number)[]) {
        if(level.value instanceof Array) {
            for(let value of level.value) {
                this.processSingleValdationSetLevel({ value: value, level: level.level }, args);
            }
        } else {
            this.processSingleValdationSetLevel(level, args);
        }
    }

    private processSingleValdationSetLevel(level: Level, args: (string | number)[]) {
        let argSet = args.concat(level.value);
        if(level.level) {
            for(let item of level.level) {
                this.processValidationSetLevel(item, argSet);
            }
        } else {
            let testCase = this.getTestCaseForArgs(argSet);
            this.testCases.push(testCase);
        }
    }

    private getTestCaseForArgs(argSet: (string | number)[]) {
        let expected = this.validCombinations;
        for(let arg of argSet) {
            if(!(arg in expected)) {
                expected = this.expectedDefault;
                break;
            }
            expected = typeof expected[arg] === 'function' ? expected[arg](...argSet) : expected[arg];
        }
        return new TestCase(expected, argSet);
    }
}
