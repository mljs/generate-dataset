import LibRandom from 'lib-random';
import {shuffle as getShuffle} from './utils';
import {makeCircles} from './makeCircles';
import {makeMoons} from './makeMoons';
import Matrix from 'ml-matrix';

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
 * @param {object} [options.generatorOptions={}] - Options for generator.
 * @return {object} - Object that contains X(dataset) and y(predictions)
 */
export function generateDataset2D(options) {
    var {
        kind,
        seed,
        samples,
        noise,
        generatorOptions = {},
        shuffle = true,
    } = options;

    var random = new LibRandom(seed);

    var {dataset, labels} = generators[kind](samples, generatorOptions);

    if (shuffle) {
        var shuffled = getShuffle(random, dataset, labels);
        dataset = shuffled.X;
        labels = shuffled.y;
    }

    if (noise) {
        dataset.add(Matrix.rand(samples, 2, () => random.randNormal(0, noise)));
    }

    return {dataset, labels};
}
