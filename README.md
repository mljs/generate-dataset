# ml-generate-dataset

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][codecov-image]][codecov-url]
  [![npm download][download-image]][download-url]

# NMR dataset generator

This tool is designed with the main purpose of building artificial 1H NMR data sets from your own library of molecules. This could be useful to help with identification of metabolites or in the process of developing new statistical methods. The current version allows to generate a dataset from any file in .mol or .sdf format, define the number of categories and the population for each of them, attribute a concentration distribution (or default ones) to each molecule and add some artificial noise.

<img src="images/fmts.png">

## Installation
```bash
npm install --save ml-generate-dataset
```

## Example
```js
var generateDataset = require('ml-generate-dataset');
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
 *  and the matrix composition contain those percentages
 */
var dataset = generateDataset(pureElements, options);
// now you have an object with the dataset, matrix composition and dataClass matrix to do a statistical procedure and debug
```
## [API Documentation](https://mljs.github.io/generate-dataset/)

## License
  [MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-generate-dataset.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ml-generate-dataset
[travis-image]: https://img.shields.io/travis/mljs/generate-dataset/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/mljs/generate-dataset
[codecov-image]: https://img.shields.io/codecov/c/github/mljs/generate-dataset.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/mljs/generate-dataset
[download-image]: https://img.shields.io/npm/dm/ml-generate-dataset.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/ml-generate-dataset
