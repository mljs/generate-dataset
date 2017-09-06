# generate-dataset

  [![NPM version][npm-image]][npm-url]
  [![build status][travis-image]][travis-url]
  [![Test coverage][codecov-image]][codecov-url]
  [![David deps][david-image]][david-url]
  [![npm download][download-image]][download-url]

Generate synthetic datasets for testing, taken from sklearn [implementation](https://github.com/scikit-learn/scikit-learn/blob/ef5cb84a/sklearn/datasets/samples_generator.py#L572)

## Installation

`$ npm install ml-generate-dataset`

## [API Documentation](https://mljs.github.io/generate-dataset/)

## Example

### Make moons
```js
const generateDataset = require('ml-generate-dataset');

// generate two moons, each one belongs to one class
var options = {
    kind: 'moons'
    samples: 50,
    shuffle: true,
    seed: 42, // to reproduce the same results
    noise: 0.001 // apply gaussian noise to your data
    generatorOptions: {
        classSamples: 0.7 // percentage of dataset that belongs to one class
    }
}
var {X, y} = generateDataset(options) // generate a moon dataset
```

### Make circles
```js
const generateDataset = require('ml-generate-dataset');

// generate two circles, one inside of other
var options = {
    kind: 'circles'
    samples: 50,
    shuffle: true,
    seed: 42, // to reproduce the same results
    noise: 0.001 // apply gaussian noise to your data
    generatorOptions: {
        classSamples: 0.7 // percentage of dataset that belongs to one class
        scaleFactor: 0.5 // scale factor between inside and outside circle
    }
}
var {X, y} = generateDataset(options) // generate a circles dataset
```

## License

[MIT](./LICENSE)

[npm-image]: https://img.shields.io/npm/v/ml-generate-dataset.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/ml-generate-dataset
[travis-image]: https://img.shields.io/travis/mljs/generate-dataset/master.svg?style=flat-square
[travis-url]: https://travis-ci.org/mljs/generate-dataset
[codecov-image]: https://img.shields.io/codecov/c/github/mljs/generate-dataset.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/mljs/generate-dataset
[david-image]: https://img.shields.io/david/mljs/generate-dataset.svg?style=flat-square
[david-url]: https://david-dm.org/mljs/generate-dataset
[download-image]: https://img.shields.io/npm/dm/ml-generate-dataset.svg?style=flat-square
[download-url]: https://www.npmjs.com/package/ml-generate-dataset
