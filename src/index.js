
var {Matrix} = require('ml-matrix');
var normalRandGenerator = require('distributions-normal-random');

/**
 * Create a dataset by the linear combination of pure elements with a specific gaussian distribution,
 * @param {Array<Array<number>>} pureElements - matrix where each row is a pure element
 * @param {object} options
 * @param {boolean} options.keepCompositionMatrix - if it's true, the result object contain the composition matrix -compositionMatrix-
 * @param {boolean} options.keepDataClass - if it's true, the result object contain the dataClass matrix.
 * @param {boolean} options.dummyMatrix - if it's true, the dataClass matrix will be a dummyMatrix other wize it's a vector matrix.
 * @param {number} options.seed - the seed to initialize the random vector.
 * @param {Array<object>} options.classes - the parameters to create the dataset. see the example.
 * @param {number} options.classes[*].nbSample - number of sample for this class.
 * @param {Array<object>} elements - contain the object with the index of pure element and the distribution parameters. see the example.
 * {
 *       index: 0,
 *       distribution: {
 *           name: 'gaussian',
 *           parameters: {
 *               mean: 9.4,
 *               standardDesviation: 0.1
 *           }
 *       }
 *  }
 * @return {object} - object with one or three properties depending on the options
 * {dataset: Array<Array<number>>, compositionMatrix: Array<Array<number>>, dataClass: Array<Array<number>>}.
 */
function generator(pureElements, options = {}) {
    _checkParameters(pureElements, options);
    var compositionMatrix = _createCompMatrix(options);
    var output = {dataset: compositionMatrix.mmul(pureElements)};
    if (options.keepCompositionMatrix) output.compositionMatrix = compositionMatrix;
    if (options.keepDataClass) output.dataClass = _getDataClass(options);
    return output;
}

function _getDataClass(options) {
    let {
        classes,
        dummyMatrix,
    } = options;

    var dataClass;
    let counter = 0;
    let nbClasses = classes.length;
    let nbSamples = classes.reduce((acc, clase) => clase.nbSample + acc, 0);

    if (dummyMatrix) {
        dataClass = Matrix.zeros(nbSamples, nbClasses);
        for (let i = 0; i < nbClasses; i++) {
            let nbSamplesPerClass = classes[i].nbSample;
            for (let j = 0; j < nbSamplesPerClass; j++) {
                dataClass[counter++][i] = 1;
            }
        }
    } else {
        dataClass = new Array(nbSamples);
        for (let i = 0; i < nbClasses; i++) {
            let nbSamplesPerClass = classes[i].nbSample;
            for (let j = 0; j < nbSamplesPerClass; j++) {
                dataClass[counter++] = [i];
            }
        }
    }
    return dataClass;
}

function _createCompMatrix(options) {
    var {
        classes,
        nbPureElements,
        seed = 2234235
    } = options;
    normalRandGenerator.seed = seed;
    let matrixComposition = [];
    for (let clase of classes) {
        for (let i = 0; i < clase.nbSample; i++) {
            let arrayComposition = new Array(nbPureElements).fill(0);
            for (let element of clase.elements) {
                let mean = element.distribution.parameters.mean;
                let std = element.distribution.parameters.standardDesviation;
                arrayComposition[element.index] = normalRandGenerator() * std + mean;
            }
            matrixComposition.push(arrayComposition);
        }
    }
    return new Matrix(matrixComposition);
}

function _checkParameters(pureElements, options) {
    let {
        classes
    } = options;
    let expressions = {
        error1: 'pureElements should be an Array',
        error2: 'classes should be an Array',
        error3: 'pureElements array should has more than one element'
    };
    if (!Array.isArray(pureElements)) throw expressions.error1;
    if (pureElements.length < 2) throw expressions.error3;
    if (!Array.isArray(classes)) throw expressions.error2;
}

module.exports = generator;
