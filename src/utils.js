
export function shuffle(random, X, y) {
    if (X.length !== y.length) {
        throw new Error('X and y should have the same size for shuffling');
    }

    var size = X.length;

    while (size) {
        var rnd = random.randInt(0, size);
        size -= 1;
        [X[size], X[rnd]] = [X[rnd], X[size]];
        [y[size], y[rnd]] = [y[rnd], y[size]];
    }
}
