import Matrix from 'ml-matrix';
import linspace from 'compute-linspace';

const defaultOptions = {
    samplesOutside: 0.5,
    scaleFactor: 0.5
};

/**
 * @param {number} samples
 * @param {object} options
 * @param {number} [options.classSamples=0.5] - Percentage of samples that belongs to one class (outside circle).
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

    var dataset = new Matrix([dataOuside, dataOuside]).transpose();
    var datasetInside = new Matrix([dataInside, dataInside]).transpose();

    for (var i = 0; i < datasetInside.rows; ++i) {
        dataset.addRow(datasetInside.getRow(i));
    }

    var labels = new Array(dataset.rows);

    for (i = 0; i < dataset.rows; ++i) {
        dataset.set(i, 0, Math.cos(dataset.get(i, 0)));
        dataset.set(i, 1, Math.sin(dataset.get(i, 1)));
        labels[i] = 0;
    }

    for (i = outSamples; i < dataset.rows; ++i) {
        dataset.set(i, 0, dataset.get(i, 0) * options.scaleFactor);
        dataset.set(i, 1, dataset.get(i, 1) * options.scaleFactor);
        labels[i] = 1;
    }

    return {dataset, labels};
}
