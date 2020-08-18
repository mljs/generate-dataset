import { generate } from '../index';

let options = {
  seed: 22,
  classes: [
    {
      nbSpectra: 500,
      unitParameters: [
        {
          index: 0,
          distribution: {
            name: 'normal',
            parameters: {
              mean: 9.4,
              standardDeviation: 0.1,
            },
          },
        },
        {
          index: 1,
          distribution: {
            name: 'normal',
            parameters: {
              mean: 9.4,
              standardDeviation: 0.1,
            },
          },
        },
        {
          index: 2,
          distribution: {
            name: 'normal',
            parameters: {
              mean: 9.4,
              standardDeviation: 0.1,
            },
          },
        },
      ],
    },
    {
      nbSpectra: 500,
      unitParameters: [
        {
          index: 0,
          distribution: {
            name: 'normal',
            parameters: {
              mean: 9.4,
              standardDeviation: 0.1,
            },
          },
        },
        {
          index: 1,
          distribution: {
            name: 'normal',
            parameters: {
              mean: 10.3,
              standardDeviation: 0.15,
            },
          },
        },
        {
          index: 2,
          distribution: {
            name: 'normal',
            parameters: {
              mean: 9.4,
              standardDeviation: 0.1,
            },
          },
        },
      ],
    },
  ],
};
describe('dataset generated from a small matrix of pureElements', () => {
  let pureElements = [
    [0, 0, 0, 1, 0, 0, 0],
    [0, 0, 0, 0, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 0],
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
  it('the classMatrix should be a binary matrix and classVector contain the same information', () => {
    expect(result.classVector[0]).toEqual(0);
    expect(result.classVector[500]).toEqual(1);
    expect(result.classMatrix.getRow(0)).toEqual([1, 0]);
    expect(result.classMatrix.getRow(500)).toEqual([0, 1]);
  });
});
