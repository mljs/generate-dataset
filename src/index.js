var {Matrix} = require('ml-matrix');
var normalRandGenerator = require('distributions-normal-random');

function generator(pureElements, options = {}) {
    _checkParameters(pureElements, options);
    [pureElements, options] = _adjustParameters(pureElements, options);
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
                dataClass[counter++] = i;
            }
        }
    }
    return dataClass;
}

function _createCompMatrix(options) {
    var {
        classes,
        nbPureElements,
        seed
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
module.exports["generate-dataset"] = generator;
