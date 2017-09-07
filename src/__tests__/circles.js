import {toBeDeepCloseTo} from 'jest-matcher-deep-close-to';
import {generateDataset2D} from '../generateDataset2D';
expect.extend({toBeDeepCloseTo});

describe('circles test', () => {
    var options = {
        samples: 10,
        kind: 'circles'
    };

    test('make circles', () => {
        options.shuffle = false;
        var {dataset, labels} = generateDataset2D(options);

        var expectedDataset = [[1, 0],
            [0.30901699437494745, 0.9510565162951535],
            [-0.8090169943749473, 0.5877852522924732],
            [-0.8090169943749475, -0.587785252292473],
            [0.30901699437494723, -0.9510565162951536],
            [0.5, 0],
            [0.15450849718747373, 0.47552825814757677],
            [-0.40450849718747367, 0.2938926261462366],
            [-0.4045084971874737, -0.2938926261462365],
            [0.15450849718747361, -0.4755282581475768]];
        var expectedLabels = [0, 0, 0, 0, 0, 1, 1, 1, 1, 1];

        expect(dataset).toBeDeepCloseTo(expectedDataset, 2);
        expect(labels).toEqual(expectedLabels);
    });

    test('circles with shuffle', () => {
        options.shuffle = true;
        options.seed = 42;
        var {dataset, labels} = generateDataset2D(options);

        var expectedDataset = [[0.15450849718747373, 0.47552825814757677],
            [-0.8090169943749473, 0.5877852522924732],
            [0.5, 0],
            [1, 0],
            [-0.8090169943749475, -0.587785252292473],
            [-0.40450849718747367, 0.2938926261462366],
            [0.15450849718747361, -0.4755282581475768],
            [-0.4045084971874737, -0.2938926261462365],
            [0.30901699437494723, -0.9510565162951536],
            [0.30901699437494745, 0.9510565162951535]];
        var expectedLabels = [1, 0, 1, 0, 0, 1, 1, 1, 0, 0];

        expect(dataset).toBeDeepCloseTo(expectedDataset, 2);
        expect(labels).toEqual(expectedLabels);
    });

    test('test with noise', () => {
        options.shuffle = true;
        options.seed = 42;
        options.noise = 0.001;
        var {dataset, labels} = generateDataset2D(options);

        var expectedX = [[0.15450849718747373, 0.47552825814757677],
            [-0.8090169943749473, 0.5877852522924732],
            [0.5, 0],
            [1, 0],
            [-0.8090169943749475, -0.587785252292473],
            [-0.40450849718747367, 0.2938926261462366],
            [0.15450849718747361, -0.4755282581475768],
            [-0.4045084971874737, -0.2938926261462365],
            [0.30901699437494723, -0.9510565162951536],
            [0.30901699437494745, 0.9510565162951535]];
        var expectedY = [1, 0, 1, 0, 0, 1, 1, 1, 0, 0];

        expect(dataset).toBeDeepCloseTo(expectedX, 1);
        expect(labels).toEqual(expectedY);
    });
});
