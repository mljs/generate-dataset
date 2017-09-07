import Matrix from 'ml-matrix';
import linspace from 'compute-linspace';

/**
 *
 * @param {number} samples - amount of samples to generate
 * @param {object} options
 * @param {number} [options.classSamples] - Percentage of samples that belongs to one class.
 * @return {object} - Object that contains X(dataset) and y(predictions).
 */

export function makeMoons(samples, options = {}) {
    var {
        classSamples = 0.5
    } = options;

    var outSamples = Math.floor(samples * classSamples);
    var inSamples = samples - outSamples;

    // to avoid that the first point === last point
    var dataOuside = linspace(0, Math.PI, outSamples);
    var dataInside = linspace(0, Math.PI, inSamples);

    var dataset = new Matrix([dataOuside, dataOuside]).transpose();
    var datasetInside = new Matrix([dataInside, dataInside]).transpose();

    dataset.apply(function (i, j) {
        this[i][j] = j ? Math.sin(this[i][j]) : Math.cos(this[i][j]);
    });

    datasetInside.apply(function (i, j) {
        this[i][j] = j ? 1 - Math.sin(this[i][j]) - .5 : 1 - Math.cos(this[i][j]);
    });

    for (var i = 0; i < datasetInside.rows; ++i) {
        dataset.addRow(datasetInside.getRow(i));
    }

    var labels = new Array(samples);
    for (i = 0; i < dataset.rows; ++i) {
        labels[i] = i < outSamples ? 0 : 1;
    }

    return {dataset, labels};
}
