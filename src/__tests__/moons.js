import {generateDataset2D} from '..';
import {toBeDeepCloseTo} from 'jest-matcher-deep-close-to';
expect.extend({toBeDeepCloseTo});

describe('make moons', () => {
    const options = {
        samples: 10,
        kind: 'moons'
    };

    test('main test', () => {
        options.shuffle = false;

        var {X, y} = generateDataset2D(options);
        var expectedX = [
            [1, 0],
            [0.7071067811865476, 0.7071067811865475],
            [6.123233995736766e-17, 1],
            [-0.7071067811865475, 0.7071067811865476],
            [-1, 1.2246467991473532e-16],
            [0, 0.5],
            [0.2928932188134524, -0.20710678118654746],
            [0.9999999999999999, -0.5],
            [1.7071067811865475, -0.20710678118654757],
            [2, 0.4999999999999999]
        ];
        var expectedY = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];

        expect(X).toBeDeepCloseTo(expectedX, 2);
        expect(y).toEqual(expectedY);
    });

    test('moons with noise', () => {
        options.samples = 10;
        options.noise = 0.001;
        options.shuffle = true;
        options.seed = 42;
        options.generatorOptions = {
            classSamples: 0.3
        };

        var {X, y} = generateDataset2D(options);
        var expectedX = [
            [0.9999999999999999, -0.5],
            [-1, 1.2246467991473532e-16],
            [0.4999999999999999, -0.3660254037844386],
            [1, 0],
            [0, 0.5],
            [1.4999999999999998, -0.3660254037844387],
            [2, 0.4999999999999999],
            [1.8660254037844384, -3.3306690738754696e-16],
            [0.1339745962155613, 0],
            [6.123233995736766e-17, 1]
        ];
        var expectedY = [1, 0, 1, 0, 1, 1, 1, 1, 1, 0];

        expect(X).toBeDeepCloseTo(expectedX, 1);
        expect(y).toEqual(expectedY);
    });
});
