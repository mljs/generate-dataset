import {generate-dataset} from '../index';

describe('dataset generated from a small matrix of pureElements', () => {
    it('should has a standar desviation closest to provided', () => {
        let pureElements = [
            [0,0,0,1,0,0,0],
            [0,0,0,0,0,1,0],
            [0,1,0,0,0,0,0]
        ];
        let options = {
            keepDataClass: true,
            keepCompositionMatrix: true,
            seed: 22,
            classes: [
                {
                    nbSample: 500,
                    elements: [
                        {
                            index: 0,
                            distribution: {
                                name: 'normal',
                                parameters:{
                                    mean: 9.4,
                                    standardDesviation: 0.1
                                }
                            }
                        },
                        {
                            index: 1,
                            distribution: {
                                name: 'normal',
                                parameters:{
                                    mean: 9.4,
                                    standardDesviation: 0.1
                                }
                            }
                        },
                        {
                            index: 2,
                            distribution: {
                                name: 'normal',
                                parameters:{
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
                                parameters:{
                                    mean: 9.4,
                                    standardDesviation: 0.1
                                }
                            }
                        },
                        {
                            index: 1,
                            distribution: {
                                name: 'normal',
                                parameters:{
                                    mean: 10.3,
                                    standardDesviation: 0.15
                                }
                            }
                        },
                        {
                            index: 2,
                            distribution: {
                                name: 'normal',
                                parameters:{
                                    mean: 9.4,
                                    standardDesviation: 0.1
                                }
                            }
                        }
                    ]
                }
            ]
        };
        let result = rand['generate-dataset'](pureElements, options);
        result = new Matrix(result);
        let column = result.getColumn(5);
        let [class1, class2] = [column.slice(0, 500), column.slice(500,1000)]
        let sum1 = class1.reduce((a,b) => a + b, 0);
        let sum2 = class2.reduce((a,b) => a + b, 0);
    });
});
