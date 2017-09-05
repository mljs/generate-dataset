import Matrix from 'ml-matrix';
import linspace from 'compute-linspace';

const defaultOptions = {
    samplesOutside: 0.5,
    scaleFactor: 0.5
};

/**
 * @param {number} samples
 * @param {object} options
 * @param {number} [options.samplesOutside=0.5] - Percentage of samples that belongs to the outside circle, the inside percentage is (1 - samplesOutside).
 * @param {number} [options.scaleFactor=0.5] - Scale factor between inner and outer circle.
 * @return {object} - Object that contains X(dataset) and y(predictions)
 */
export function makeCircles(samples, options) {
    options = Object.assign({}, defaultOptions, options);

    var outSamples = Math.floor(samples * options.samplesOutside);
    var inSamples = samples - outSamples;

    // to avoid that the first point === last point
    var dataOuside = linspace(0, 2 * Math.PI, outSamples + 1).slice(0, -1);
    var dataInside = linspace(0, 2 * Math.PI, inSamples + 1).slice(0, -1);

    var X = new Matrix([dataOuside, dataOuside]).transpose();
    var XInside = new Matrix([dataInside, dataInside]).transpose();

    for (var i = 0; i < XInside.rows; ++i) {
        X.addRow(XInside.getRow(i));
    }

    var y = new Array(X.rows);

    for (i = 0; i < X.rows; ++i) {
        X.set(i, 0, Math.cos(X.get(i, 0)));
        X.set(i, 1, Math.sin(X.get(i, 1)));
        y[i] = 0;
    }

    for (i = outSamples; i < X.rows; ++i) {
        X.set(i, 0, X.get(i, 0) * options.scaleFactor);
        X.set(i, 1, X.get(i, 1) * options.scaleFactor);
        y[i] = 1;
    }

    return {X, y};
}
