import normalRandGenerator from 'distributions-normal-random';
import { Matrix } from 'ml-matrix';

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
export function generate(pureElements, options = {}) {
  let { type = 'general' } = options;
  checkParameters(pureElements, options);
  let result = {};
  let creatorCompMatrix;
  if (type === 'gcms') {
    let times = getTimes(options.classes);
    creatorCompMatrix = gcMsCompMatrix;
    result.times = times;
    options.times = times;
  } else {
    creatorCompMatrix = createCompMatrix;
  }
  let compositionMatrix = creatorCompMatrix(options);
  let [classVector, classMatrix] = getDataClass(options);
  return Object.assign(
    {
      compositionMatrix,
      dataset: compositionMatrix.mmul(pureElements),
      classVector,
      classMatrix,
    },
    result,
  );
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
  let { classes, nbPureElements, seed = Date.now() } = options;
  normalRandGenerator.seed = seed;
  let matrixComposition = [];
  for (let classParameters of classes) {
    for (let i = 0; i < classParameters.nbSpectra; i++) {
      let arrayComposition = new Array(nbPureElements).fill(0);
      for (let element of classParameters.unitParameters) {
        let mean = element.distribution.parameters.mean;
        let std = element.distribution.parameters.standardDeviation;
        arrayComposition[element.index] = ensureNonNegativeComposition(
          mean,
          std,
        );
      }
      matrixComposition.push(arrayComposition);
    }
  }
  return new Matrix(matrixComposition);
}

function gcMsCompMatrix(options) {
  let { classes, nbPureElements, times } = options;

  let matrixComposition = Matrix.zeros(times.length, nbPureElements);
  let sqrt2Pi = Math.sqrt(Math.PI * 2);
  for (let classParameters of classes) {
    for (let element of classParameters.unitParameters) {
      let intensity = element.distribution.parameters.intensity;
      let mean = element.distribution.parameters.mean;
      let std = element.distribution.parameters.standardDeviation;
      let factor = intensity / std / sqrt2Pi;
      let func = (t) => factor * Math.exp(-0.5 * Math.pow((t - mean) / std, 2));
      for (let i = 0; i < times.length; i++) {
        let value = func(times[i]) + matrixComposition.get(i, element.index);
        matrixComposition.set(i, element.index, value);
      }
    }
  }
  return matrixComposition;
}

function getMinMaxIndexRT(classes) {
  let max = Number.MIN_SAFE_INTEGER;
  let min = Number.MAX_SAFE_INTEGER;
  let minIndexs = [0, 0];
  let maxIndexs = [0, 0];
  for (let i = 0; i < classes.length; i++) {
    let classParameters = classes[i];
    let unitParameters = classParameters.unitParameters;
    for (let j = 0; j < unitParameters.length; j++) {
      let element = unitParameters[j].distribution.parameters;
      if (max < element.mean) {
        max = element.mean;
        maxIndexs = [i, j];
      }
      if (min > element.mean) {
        min = element.mean;
        minIndexs = [i, j];
      }
    }
  }
  return { minIndexs, maxIndexs };
}

function getTimes(classes) {
  let { minIndexs, maxIndexs } = getMinMaxIndexRT(classes);

  let fromElement =
    classes[minIndexs[0]].unitParameters[minIndexs[1]].distribution.parameters;
  let toElement =
    classes[maxIndexs[0]].unitParameters[maxIndexs[1]].distribution.parameters;

  let from = fromElement.mean - fromElement.standardDeviation * 5;
  let to = toElement.mean + toElement.standardDeviation * 5;

  let nbPoints = classes.reduce((a, b) => a + b.nbSpectra, 0);
  let jump = (to - from) / (nbPoints - 1);

  let times = new Float32Array(nbPoints);

  for (let i = 0; i < nbPoints; i++) {
    times[i] = from + i * jump;
  }

  return times;
}

function checkParameters(pureElements, options) {
  if (!Array.isArray(pureElements)) {
    throw new RangeError('pureElements should be an Array');
  }
  if (pureElements.length < 2) {
    throw new RangeError('pureElements array should has more than one element');
  }
  if (!Array.isArray(options.classes)) {
    throw new RangeError('classes should be an Array');
  }

  let pureIndexs = new Set();
  let classes = options.classes;
  for (let i = 0; i < classes.length; i++) {
    let classParameters = classes[i];
    let unitParameters = classParameters.unitParameters;
    for (let j = 0; j < unitParameters.length; j++) {
      pureIndexs.add(unitParameters[j].index);
    }
  }
  let nbPureElements = Array.from(pureIndexs).length;
  if (nbPureElements !== pureElements.length) {
    throw new RangeError(
      'the number of pureElement should be equal to the number of called pure indexs',
    );
  }
  options.nbPureElements = nbPureElements;
}

function ensureNonNegativeComposition(mean, std) {
  if (mean < 0) throw new Error('mean is negative');
  let composition;
  let isNegative = true;
  while (isNegative) {
    composition = normalRandGenerator() * std + mean;
    if (composition >= 0) isNegative = false;
  }
  return composition;
}
