let colors = require('./Color');
let {
    format
} = require('./date/Format');

let primary = colors.pop;
let secondary = colors.gray;

const timestamp = (color) => {
    color = color == undefined ? colors.white : color;
    return {
        str: `%c[%c${format(new Date())}%c]%c`,
        styles: [`color: ${secondary};`, `color: ${color == colors.white ? colors.pop : color};`, `color: ${secondary};`, `color: ${color}`]
    }
}

const fixArgs = (args) => args.map(item => {
    if (typeof item == 'object') {
        return JSON.stringify(item);
    }
    return item;
});

module.exports = {
    log: (...args) => {
        args = fixArgs(args);

        let t = timestamp();
        console.log(t.str + ' ' + args.join(', '), ...t.styles);
    },
    error: (...args) => {
        args = fixArgs(args);

        let t = timestamp(colors.kultur);
        console.log(t.str + ' Error: ' + args.join(', '), ...t.styles);
    },
    warn : (...args) => {
        args = fixArgs(args);

        let t = timestamp(colors.yellow);
        console.log(t.str + ' Warning: ' + args.join(', '), ...t.styles);
    },
    info : (...args) => {
        args = fixArgs(args);

        let t = timestamp(colors.pop);
        console.log(t.str + ' Info: ' + args.join(', '), ...t.styles);
    }
}