import LibRandom from 'lib-random';
import {shuffle} from './utils';
import {makeCircles} from './makeCircles';
import {makeMoons} from './makeMoons';
import Matrix from 'ml-matrix';

const defaultOptions = {
    samples: 10,
    shuffle: true,
    generatorOptions: {}
};

const generators = {
    circles: makeCircles,
    moons: makeMoons
};

/**
 * @param {object} options
 * @param {string} [options.kind] - Generator kind ('moons' and 'circles' allowed)-
 * @param {number} [options.samples=100] - Number of samples to generate
 * @param {boolean} [options.shuffle=true] - Whether to shuffle the samples.
 * @param {number} [options.seed=undefined] - Seed for the random noise generator.
 * @param {number} [options.noise=undefined] - Standard deviation of gaussian noise added to the dataset
 * @param {object} [options.generatorOptions] - Options for generator.
 * @return {object} - Object that contains X(dataset) and y(predictions)
 */
export function generateDataset2D(options) {
    options = Object.assign({}, defaultOptions, options);

    var random = new LibRandom(options.seed);

    var {dataset, labels} = generators[options.kind](options.samples, options.generatorOptions);

    if (options.shuffle) {
        var shuffled = shuffle(random, dataset, labels);
        dataset = shuffled.X;
        labels = shuffled.y;
    }

    if (options.noise) {
        dataset.add(Matrix.rand(options.samples, 2, () => random.randNormal(0, options.noise)));
    }

    return {dataset, labels};
}
