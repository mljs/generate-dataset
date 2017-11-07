
var {Matrix} = require('ml-matrix');
var fs = require('fs');
var normalRandGenerator = require('distributions-normal-random');

/**
 * Create a dataset by the linear combination of pure elements with a specific gaussian distribution,
 * @param {Array<Array<number>>} pureElements - matrix where each row is a pure element
 * @param {object} [options]
 * @param {boolean} [options.dataClass = true] - if it's true, the result object contain the dataClass matrix.
 * @param {boolean} [options.binaryDataClassMatrix = false] - if it's true, the dataClass matrix will be a dummyMatrix other wize it's a vector matrix.
 * @param {number} [options.seed] - the seed to initialize the random vector.
 * @param {Array<object>} [options.classes] - the parameters to create the dataset. @example <caption> see the example </caption>.
 * @param {number} [options.classes.nbSample] - number of sample for this class.
 * @param {Array<object>} [options.classes.elements] - contain the object with the index of pure element and the distribution parameters,@example <caption> see the example </caption>.
 * @return {object} - object with one or three properties depending on the options
 * {dataset: Array<Array<number>>, compositionMatrix: Array<Array<number>>, dataClass: Array<Array<number>>}.
 */
function generate(pureElements, options = {}) {
    checkParameters(pureElements, options);
    var compositionMatrix = createCompMatrix(options);
    var output = {
        compositionMatrix,
        dataset: compositionMatrix.mmul(pureElements)
    };
    if (options.dataClass) output.dataClass = getDataClass(options);
    if (options.exportAsCsv) writeFiles(output, options.pathToWrite);
    return output;
}

function getDataClass(options) {
    let {
        classes,
        binaryDataClassMatrix,
    } = options;

    var dataClass;
    let counter = 0;
    let nbClasses = classes.length;
    let nbSamples = classes.reduce((acc, clase) => clase.nbSample + acc, 0);

    if (binaryDataClassMatrix) {
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

function createCompMatrix(options) {
    var {
        classes,
        nbPureElements,
        seed = Date.now()
    } = options;

    normalRandGenerator.seed = seed;
    let matrixComposition = [];
    for (let classParameters of classes) {
        for (let i = 0; i < classParameters.nbSample; i++) {
            let arrayComposition = new Array(nbPureElements).fill(0);
            for (let element of classParameters.elements) {
                let mean = element.distribution.parameters.mean;
                let std = element.distribution.parameters.standardDeviation;
                arrayComposition[element.index] = normalRandGenerator() * std + mean;
            }
            matrixComposition.push(arrayComposition);
        }
    }
    return new Matrix(matrixComposition);
}

function checkParameters(pureElements, options) {
    if (!Array.isArray(pureElements)) throw new RangeError('pureElements should be an Array');
    if (pureElements.length < 2) throw new RangeError('pureElements array should has more than one element');
    if (!Array.isArray(options.classes)) throw new RangeError('classes should be an Array');
    if (options.dataClass === undefined) options.dataClass = true;
    options.nbPureElements = pureElements.length;
}

function writeFiles(output, pathToWrite = __dirname + '/..') {
    for (let i in output) {
        let matrix = output[i];
        let tmpOutput = '';
        for (let j of matrix) {
            tmpOutput += j.join(', ');
            tmpOutput += '\n';
        }
        fs.writeFileSync(pathToWrite + '/' + i + '.csv', tmpOutput);
    }
}
module.exports = generate;
