'use strict';

var {Matrix} = require('ml-matrix');
var normalRandGenerator = require('distributions-normal-random');

/**
 * Create a dataset by the linear combination of pure elements with a specific gaussian distribution,
 * @param {Array<Array<number>>} pureElements - matrix where each row is a pure element
 * @param {object} [options]
 * @param {number} [options.seed] - the seed to initialize the random vector.
 * @param {Array<object>} [options.classes] - the parameters to create the dataset. @example <caption> see the example </caption>.
 * @param {number} [options.classes.nbSpectra] - number of sample for this class.
 * @param {Array<object>} [options.classes.elements] - contain the object with the index of pure element and the distribution parameters,@example <caption> see the example </caption>.
 * @return {object} - object with one or three properties depending on the options
 * {dataset: Array<Array<number>>, compositionMatrix: Array<Array<number>>, dataClass: Array<Array<number>>}.
 */
function generate(pureElements, options = {}) {
    checkParameters(pureElements, options);
    var compositionMatrix = createCompMatrix(options);
    let [classVector, classMatrix] = getDataClass(options);
    return {
        compositionMatrix,
        dataset: compositionMatrix.mmul(pureElements),
        classVector,
        classMatrix
    };
}

function getDataClass(options) {
    let counter = 0;
    let classes = options.classes;
    let nbClasses = classes.length;
    let nbSamples = classes.reduce((acc, clase) => clase.nbSpectra + acc, 0);

    let classVector = new Array(nbSamples);
    let classMatrix = Matrix.zeros(nbSamples, nbClasses);
    for (let i = 0; i < nbClasses; i++) {
        let nbSamplesPerClass = classes[i].nbSpectra;
        for (let j = 0; j < nbSamplesPerClass; j++) {
            classMatrix.set(counter, i, 1);
            classVector[counter++] = i;
        }
    }

    return [classVector, classMatrix];
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
        for (let i = 0; i < classParameters.nbSpectra; i++) {
            let arrayComposition = new Array(nbPureElements).fill(0);
            for (let element of classParameters.unitParameters) {
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
    options.nbPureElements = pureElements.length;
}

module.exports = generate;
