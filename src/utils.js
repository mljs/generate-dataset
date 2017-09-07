import Matrix from 'ml-matrix';

export function shuffle(random, X, y) {
    if (X.rows !== y.length) {
        throw new Error('X and y should have the same size for shuffling');
    }

    var arr = new Array(X.rows);
    for (var i = 0; i < X.length; ++i) {
        arr[i] = i;
    }

    arr = random.shuffle(arr);

    var otherX = new Array(X.rows);
    var otherY = new Array(X.rows);

    for (i = 0; i < X.rows; ++i) {
        otherX[i] = X.getRow(arr[i]);
        otherY[i] = y[arr[i]];
    }

    return {
        X: new Matrix(otherX),
        y: otherY
    };
}
