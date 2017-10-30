'use strict';
var generateDataset = require('../index');
var {Matrix} = require('ml-matrix');

/*
 * this options will be used to create the dataSet, thus permites to create several classes where markers will be
 * the elements with differents distributions between the classes, pay attention to the element with index 1, it has
 * a distribution with means 9.4 and 10.3 for the first and second classes respectivelly
 */
var options = {
    keepDataClass: true,
    keepCompositionMatrix: true,
    dummyMatrix: true,
    seed: 22,
    classes: [
        {
            nbSample: 500,
            elements: [
                {
                    index: 0,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 9.4,
                            standardDesviation: 0.1
                        }
                    }
                },
                {
                    index: 1,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 9.4,
                            standardDesviation: 0.1
                        }
                    }
                },
                {
                    index: 2,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 9.4,
                            standardDesviation: 0.1
                        }
                    }
                }
            ]
        },
        {
            nbSample: 500,
            elements: [
                {
                    index: 0,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 9.4,
                            standardDesviation: 0.1
                        }
                    }
                },
                {
                    index: 1,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 10.3,
                            standardDesviation: 0.15
                        }
                    }
                },
                {
                    index: 2,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 9.4,
                            standardDesviation: 0.1
                        }
                    }
                }
            ]
        }
    ]
};
// the pureElements matrix could be whatever you want like NMR or IR spectra.
var pureElements = [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0]
];
/* the rows of pureElements matrix will be linear combined like:
 * var pureElements = [
 *  element A,
 *  element B,
 *  element C,
 *      .
 *      .
 *      .
 *  ];
 *  so each element of dataset is  AA = aA + bB + cC + ...
 *  and the matrix composition contain this percentages
 */
var dataset = generateDataset(pureElements, options);
// now you have an object with the dataset, matrix composition and dataClass matrix to do a statistical procedure and debug
console.log(dataset);
