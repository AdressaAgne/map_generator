class Parser {
    constructor(fn) {
        this.fn = fn;
    }

    run(target) {
        const init = {
            target,
            index: 0,
            result: null,
            isError: false,
            error: null,
            steps: 0
        }

        return this.fn(init);
    }

    map(fn) {
        return new Parser(state => {
            const next = this.fn(state);
            if (next.isError) return next;

            return updateStateResult(next, fn(next.result));
        });
    }

    chain(fn) {
        return new Parser(state => {
            const next = this.fn(state);
            if (next.isError) return next;

            const nextParser = fn(next.result);
            return nextParser.fn(next);
        });
    }
}

const updateState = (old, index, result) => ({
    ...old,
    index,
    result,
    steps: old.steps + 1,
});
const updateStateResult = (old, result) => ({
    ...old,
    result,
    steps: old.steps + 1,
});
const updateStateError = (old, msg) => ({
    ...old,
    error: msg,
    isError: true,
    steps: old.steps + 1,
});

const str = (s) => new Parser((state) => {
    const {
        target,
        index,
        isError
    } = state;

    if (isError) return state;

    const slice = target.slice(index);

    if (slice.length == 0) {
        return updateStateError(state, 'str: Unexpected end of input');
    }

    if (slice.indexOf(s) == 0) {
        return updateState(state, index + s.length, s);
    }

    return updateStateError(state, `str: Tried to match "${s}", but got "${target.slice(index, index + 10)}"`);
})

const letters = new Parser((state) => {
    const {
        target,
        index,
        isError
    } = state;

    if (isError) return state;

    const slice = target.slice(index);

    if (slice.length == 0) {
        return updateStateError(state, 'letters: Unexpected end of input');
    }

    let match = slice.match(/^[a-zA-Z]+/);
    if (match) {
        return updateState(state, index + match[0].length, match[0]);
    }

    return updateStateError(state, `letters: Tried to match "a-zA-Z", but got "${target.slice(index, index + 10)}"`);
});

const digits = new Parser((state) => {
    const {
        target,
        index,
        isError
    } = state;

    if (isError) return state;

    const slice = target.slice(index);

    if (slice.length == 0) {
        return updateStateError(state, 'digits: Unexpected end of input');
    }

    let match = slice.match(/^[0-9]+/);
    if (match) {
        return updateState(state, index + match[0].length, match[0]);
    }

    return updateStateError(state, `digits: Tried to match "a-zA-Z", but got "${target.slice(index, index + 10)}"`);
});

const series = (...parsers) => new Parser(state => {
    if (state.isError) return state;

    const results = [];
    let next = state;

    for (let p of parsers) {
        next = p.fn(next);
        results.push(next.result);
    }
    return updateStateResult(next, results);
});

const many = parser => new Parser(state => {
    if (state.isError) return state;

    const results = [];
    let next = state;
    let done = false;

    while (!done) {
        let test = parser.fn(next);

        if (!test.isError) {
            results.push(test.result);
            next = test;
        } else {
            done = true;
        }
    }
    return updateStateResult(next, results);
});
const many1 = parser => new Parser(state => {
    if (state.isError) return state;

    const results = [];
    let next = state;
    let done = false;

    while (!done) {
        let test = parser.fn(next);

        if (!test.isError) {
            results.push(test.result);
            next = test;
        } else {
            done = true;
        }
    }
    if (results.length === 0) {
        return updateStateError(
            state,
            `many1: Unable to match any input using parser @ index ${state.index}`
        );
    }
    return updateStateResult(next, results);
});

const choise = (...parsers) => new Parser(state => {
    if (state.isError) return state;

    for (let p of parsers) {
        let next = p.fn(state);
        if (!next.isError) {
            return next;
        }
    }
    return updateStateError(state, 'choise: unable to match with any parser');
});

const anyOf = chars => new Parser(state => {
    const {
        target,
        index,
        isError
    } = state;

    if (isError) return state;

    if (target.length == 0) {
        return updateStateError(state, 'anyOf: Unexpected end of input');
    }

    if (chars.indexOf(target[index]) == 0) {
        return updateState(state, index + target[index].length, target[index]);
    }

    return updateStateError(state, `anyOf: unable to match ${chars}, got ${target[index]}`);
});

const lazy = parserFn => new Parser(state => {
    parser = parserFn();
    return parser.fn(state);
});

const whitespace = many(anyOf(' \n\r\r')).map(result => result.join(''));
const whitespace1 = many1(anyOf(' \n\r\r')).map(result => result.join(''));

const between = (left, right) => content => series(left, content, right).map(r => r[1]);

module.exports = {
    str,
    series,
    letters,
    digits,
    many,
    many1,
    choise,
    between,
    anyOf,
    whitespace,
    whitespace1,
    lazy
}