var {Matrix} = require('ml-matrix');
var normalRandGenerator = require('distributions-normal-random');

function generator(pureElements, options = {}) {
    _checkParameters(pureElements, options);
    [pureElements, options] = _adjustParameters(pureElements, options);
    var matrixComposition = _createCompMatrix(options);
    return matrixComposition.mmul(pureElements);
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

