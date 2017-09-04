import Matrix from 'ml-matrix';
import LibRandom from 'lib-random';
import linspace from 'compute-linspace';
import {shuffle} from './utils';

const defaultOptions = {
    samples: 10,
    shuffle: true,
    samplesOutside: 0.5,
    scaleFactor: 0.5
};

/**
 * @param {object} options 
 * @param {number} [options.samples=100]
 * @param {number} [options.samplesOutside=0.5] - Percentage of samples that belongs to the outside circle
 * @param {boolean} [options.shuffle=true] - Whether to shuffle the samples.
 * @param {number} [options.scaleFactor=0.8] - Scale factor between inner and outer circle.
 * @param {number} [options.seed=undefined] - Seed for the random noise generator.
 * @param {number} [options.noise=undefined] - Standard deviation of gaussian noise added to the dataset
 * @return {object} - Object that contains X(dataset) and y(predictions)
 */
export function makeCircles(options) {
    options = Object.assign({}, defaultOptions, options);

    var random = new LibRandom(options.seed);

    var outSamples = Math.floor(options.samples * options.samplesOutside);
    var inSamples = options.samples - outSamples;

    // to avoid that the first point === last point
    var dataOuside = linspace(0, 2 * Math.PI, outSamples + 1).slice(0, -1);
    var dataInside = linspace(0, 2 * Math.PI, inSamples + 1).slice(0, -1);

    var X = new Matrix([dataOuside, dataOuside]).transpose();
    var XInside = new Matrix([dataInside, dataInside]).transpose();

    for (var i = 0; i < XInside.rows; ++i) {
        X.addRow(XInside.getRow(i));
    }

    //var X = Matrix.rand(options.samples, 2, () => random.rand(0, Math.PI));
    var y = new Array(X.rows);

    for (i = 0; i < X.rows; ++i) {
        X.set(i, 0, Math.cos(X.get(i, 0)));
        X.set(i, 1, Math.sin(X.get(i, 1)));
        y[i] = 0;
    }

    var samplesOutside = Math.floor(options.samples * options.samplesOutside);
    for (i = samplesOutside; i < X.rows; ++i) {
        X.set(i, 0, X.get(i, 0) * options.scaleFactor);
        X.set(i, 1, X.get(i, 1) * options.scaleFactor);
        y[i] = 1;
    }

    if (options.shuffle) {
        shuffle(random, X, y);
    }

    if (options.noise) {
        X.add(Matrix.rand(options.samples, 2, () => random.randNormal(0, options.noise)));
    }

    return {
        X: X,
        y: y
    };
}
