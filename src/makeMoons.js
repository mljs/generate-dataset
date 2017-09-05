import Matrix from 'ml-matrix';
import linspace from 'compute-linspace';

const defaultOptions = {
    classSamples: 0.5
};

/**
 *
 * @param {number} samples - amount of samples to generate
 * @param {object} options
 * @param {number} [options.classSamples] - Percentage of samples that belongs to one class.
 * @return {object} - Object that contains X(dataset) and y(predictions).
 */

export function makeMoons(samples, options) {
    options = Object.assign({}, defaultOptions, options);

    var outSamples = Math.floor(samples * options.classSamples);
    var inSamples = samples - outSamples;

    // to avoid that the first point === last point
    var dataOuside = linspace(0, Math.PI, outSamples);
    var dataInside = linspace(0, Math.PI, inSamples);

    var X = new Matrix([dataOuside, dataOuside]).transpose();
    var XInside = new Matrix([dataInside, dataInside]).transpose();

    X.apply(function (i, j) {
        this[i][j] = j ? Math.sin(this[i][j]) : Math.cos(this[i][j]);
    });

    // TODO: to improve
    XInside.apply(function (i, j) {
        this[i][j] = j ? 1 - Math.sin(this[i][j]) - .5 : 1 - Math.cos(this[i][j]);
    });

    for (var i = 0; i < XInside.rows; ++i) {
        X.addRow(XInside.getRow(i));
    }

    var y = new Array(samples);
    for (i = 0; i < X.rows; ++i) {
        y[i] = i < outSamples ? 0 : 1;
    }

    return {X, y};
}
