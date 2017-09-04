import {makeCircles} from '../makeCircles';
import {toBeDeepCloseTo} from 'jest-matcher-deep-close-to';
expect.extend({toBeDeepCloseTo});

describe('main test', () => {
    var options = {
        samples: 10
    };

    test('make circles', () => {
        options.shuffle = false;
        var {X, y} = makeCircles(options);

        var expectedX = [[1, 0],
            [0.30901699437494745, 0.9510565162951535],
            [-0.8090169943749473, 0.5877852522924732],
            [-0.8090169943749475, -0.587785252292473],
            [0.30901699437494723, -0.9510565162951536],
            [0.5, 0],
            [0.15450849718747373, 0.47552825814757677],
            [-0.40450849718747367, 0.2938926261462366],
            [-0.4045084971874737, -0.2938926261462365],
            [0.15450849718747361, -0.4755282581475768]];
        var expectedY = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];

        expect(X).toBeDeepCloseTo(expectedX, 2);
        expect(y).toEqual(expectedY);
    });

    test('circles with shuffle', () => {
        options.shuffle = true;
        options.seed = 42;
        var {X, y} = makeCircles(options);

        var expectedX = [[-0.4045084971874737, -0.2938926261462365],
            [0.30901699437494723, -0.9510565162951536],
            [0.30901699437494745, 0.9510565162951535],
            [0.15450849718747373, 0.47552825814757677],
            [1, 0],
            [-0.8090169943749473, 0.5877852522924732],
            [0.5, 0],
            [0.15450849718747361, -0.4755282581475768],
            [-0.8090169943749475, -0.587785252292473],
            [-0.40450849718747367, 0.2938926261462366]];
        var expectedY = [1, 0, 0, 1, 0, 0, 1, 1, 0, 1];

        expect(X).toBeDeepCloseTo(expectedX, 2);
        expect(y).toEqual(expectedY);
    });
});
