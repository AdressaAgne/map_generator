/**
 * Usage:
 * const fromNow = require('./libs/date/FromNow');
 * fromNow(new Date('1. jan 2001')); // 18 år siden
 */


const past = {
    'suffix': 'siden',

    'now': 'nå',

    's': 'ett sekund',
    'ss': 'sekunder',

    'm': 'ett minutt',
    'mm': 'minutter',

    'h': 'en time',
    'hh': 'timer',

    'd': 'en dag',
    'dd': 'dager',

    'M': 'en måned',
    'MM': 'måneder',

    'y': 'ett år',
    'yy': 'år'
};

const numbers = (i) => {
    let n = ['null', 'en', 'to', 'tre', 'fire', 'fem', 'seks', 'sju', 'åtte', 'ni', 'ti', 'eleve'];
    return n[i] == undefined ? i : n[i];
}

const seconds = [60, 3600, 86400, 86400 * 30, 31540000];
const codes = ['m', 'h', 'd', 'M', 'y'];

module.exports = (date) => {
    /**
     * If date is not a date object, create one
     */
    if (!(date instanceof Date)) {
        date = new Date(date);
    }

    // invalid date check
    if (isNaN(date)) return console.error('invalid date');

    // get diff in seconds
    let diff = Math.floor((new Date() - new Date(date)) / 1000);

    for (let i = seconds.length - 1; i >= 0; i--) {
        const item = seconds[i];

        let int = Math.floor(diff / item);

        if (int > 1) {
            return `${numbers(int)} ${past[codes[i] + codes[i]]} ${past.suffix}`;
        }

        if (int == 1) {
            return `${past[codes[i]]} ${past.suffix}`;
        }
    }

    if (diff > 5) {
        return `${numbers(diff)} ${past.ss} ${past.suffix}`;
    }

    return past.now;
}