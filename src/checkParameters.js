function _adjustParameters(parameters) {
    var {
        keepDataClass = true,
        keepCompositionMatrix = true,
        classProportions,
        nbSample,
    } = parameters;

    if (nbSample) {
        let sum = classProportions.reduce((a, b) => a + b, 0);
        var nbSamplesPerClass = [];
        for (let proportion of classProportions) {
            let percent = proportion / sum;
            let nbSampleInClass = (nbSample * percent) >> 0;
            nbSamplesPerClass.push(nbSampleInClass);
        }
        let result = nbSamples - nbSamplesPerClass.reduce((a, b) => a + b, 0);
        if (result < 1) {
            if (result < 0) return;
            let [min, index] = [nbSamplesPerClass[0], 0];
            for (let i = 1; i < nbSamplesPerClass.length; i++) {
                if (min > nbSamplesPerClass[i]) {
                    [min, index] = [nbSamplesPerClass[i], i];
                }
                classes[i] = nbSamplesPerClass[index] / nbSamples;
            }
            nbSamplesForClass[index] += result;
            classes[index] += result / nbSamples;
        }
    }


}
function _checkParameters(parameters) {
    let {
        nbSample,
        classProportions,
        distributions,
        nbSamplesPerClass
    } = parameters;
    let expressions = {
        error1: 'both genericDist or makerDist should be provided',
        error2: 'both nbSample or classProportions should be provided',
        error3: 'classProportions should be an Array',
        error4: 'distributions should be an Array',
        error5: 'amount of distributions does not match with nbSample',
        error6: 'amount of distributions does not match with the number of samples',
        error7: 'the number of proportions does not match with the number of samples'
    };
    if (parameters.genericDist || parameters.makerDist) {
        if (!parameters.genericDist || !parameters.makerDist) {
            throw expressions.error1;
        }
    }
    if (nbSample || classProportions) {
        if (!nbSample || !classProportions) {
            throw expressions.error2;
        } else {
            if (!Array.isArray(classProportions)) {
                throw expressions.error3;
            } else if (classProportions.length !== nbSample) {
                throw expressions.error7;
            }
        }
    }
    if (distributions) {
        if (!Array.isArray(distributions)) {
            throw expressions.error4;
        } else if (nbSample) {
            if (distributions.length !== nbSample) throw expressions.error5;
        } else if (nbSamplesPerClass) {
            let sum = nbSamplesPerClass.reduce((acc, val) => acc + val, 0);
            if (sum !== distributions.length) throw expressions.error6;
        }
    }
}

var options;
options = {
    keepDataClass: true,
    keepCompositionMatrix: true,
    nbSample: 1000,
    classProportions: [1, 1],
    genericDist: {
        mean: 9,
        standardDesviation: 0.2
    },
    makerDist: [
        {
            index: 1,
            mean: [9.4, 8.2],
            standardDesviation: [0.1, 0.1]
        },
        {
            index: 3,
            mean: [9.4, 8.2],
            standardDesviation: [0.1, 0.1]
        }
    ]
};


