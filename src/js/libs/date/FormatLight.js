/**
 * formats
 */
const values = {
    // Milliseconds 1-999
    'v': date => date.getMilliseconds(),

    // 24-hour format of an hour with leading zeros, 00 through 23
    'H': date => date.getHours().toString().padStart(2, "0"),

    // 12-hour format of an hour with leading zeros, 01 through 12
    'h': date => (date.getHours() % 12 || 12).toString().padStart(2, "0"),

    // 12-hour format of an hour without leading zeros, 1 through 12
    'g': date => date.getHours() % 12 || 12,

    // 24-hour format of an hour without leading zeros, 0 through 23
    'G': date => date.getHours(),

    // Minutes with leading zeros, 	00 to 59
    'i': date => date.getMinutes().toString().padStart(2, "0"),

    // Seconds with leading zeros, 00 through 59
    's': date => date.getSeconds().toString().padStart(2, "0"),
}

const keys = Object.keys(values);
const regex = new RegExp('(' + keys.join('|') + '|.)', 'gu');

const format = (date, pattern = defaults.time) => {
    /**
     * If date is not a date object, create one
     */
    if (!(date instanceof Date)) {
        date = new Date(date);
    }
    // invalid date check
    if (isNaN(date)) return console.error('invalid date');

    return pattern.replace(regex, a => keys.indexOf(a) > -1 ? values[a](date) : a);
}

module.exports = {
    format
};