var generate = require('../index');
// var {Matrix} = require('ml-matrix');
var options = {
    keepDataClass: true,
    keepCompositionMatrix: false,
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
                            standardDeviation: 0.1
                        }
                    }
                },
                {
                    index: 1,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 9.4,
                            standardDeviation: 0.1
                        }
                    }
                },
                {
                    index: 2,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 9.4,
                            standardDeviation: 0.1
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
                            standardDeviation: 0.1
                        }
                    }
                },
                {
                    index: 1,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 10.3,
                            standardDeviation: 0.15
                        }
                    }
                },
                {
                    index: 2,
                    distribution: {
                        name: 'normal',
                        parameters: {
                            mean: 9.4,
                            standardDeviation: 0.1
                        }
                    }
                }
            ]
        }
    ]
};
describe('dataset generated from a small matrix of pureElements', () => {
    let pureElements = [
        [0, 0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 0],
        [0, 1, 0, 0, 0, 0, 0]
    ];
    let result = generate(pureElements, options);
    it('the marker should has a mean closest to provided', () => {
        let column = result.dataset.getColumn(5);
        let [class1, class2] = [column.slice(0, 500), column.slice(500, 1000)];
        let sum1 = class1.reduce((a, b) => a + b, 0);
        let sum2 = class2.reduce((a, b) => a + b, 0);
        expect(sum1 / class1.length).toBeCloseTo(9.4, 1);
        expect(sum2 / class2.length).toBeCloseTo(10.3, 1);
    });
    it('the dataClass matrix should be a vector matrix (nbSamples, 1)', () => {
        let dataClass = result.dataClass;
        expect(Array.isArray(dataClass[0])).toEqual(true);
        expect(dataClass[0]).toEqual([0]);
        expect(dataClass[500]).toEqual([1]);
    });
    it('the dataClass matrix should be a dummy matrix', () => {
        options.dummyMatrix = true;
        let classes = options.classes; //eslint-disable-line no-unused-vars
        classes = classes.map((a) => a.nbSample = 10);
        let result = generate(pureElements, options);
        expect(result.dataClass[0]).toEqual([1, 0]);
        expect(result.dataClass[10]).toEqual([0, 1]);
    });
});
