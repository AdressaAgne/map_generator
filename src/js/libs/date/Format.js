/**
 * Usage:
 * const {format, defaults} = require('./libs/date/Format');
 * format(new Date('1. jan 2001'), '%d.%m.%Y %H:%i:%s');
 */

const days = ['søndag', 'mandag', 'tirsdag', 'onsdag', 'torsdag', 'fredag', 'lørdag'];
const months = ['januar', 'februar', 'mars', 'april', 'mai', 'juni', 'juli', 'august', 'september', 'oktober', 'november', 'desember'];
/**
 * Default patterns
 */
const defaults = {
    'isoUtcDateTime': '%Y-%m-%dT%H:%i:%s.%vZ',
    'isoDateTime': '%Y-%m-%dT%H:%i:%s',
    'iphone': '%H:%i',
    'mac': '%D %H:%i',
    'macfull': '%D %j. %M., %H:%i',
    'time': '%H:%i:%s',
    'date': '%d-%m-$Y',
    'timestamp': '%d.%m.%Y %H:%i:%s',
    'unix': '%U',
}

/**
 * formats
 */
const values = {
    // Time
    //Uppercase Ante meridiem and Post meridiem, AM or PM
    '%A': date => date.getHours() < 12 ? "AM" : "PM",

    //Lowercase Ante meridiem and Post meridiem, am or pm
    '%a': date => date.getHours() < 12 ? "am" : "pm",
    
    // Milliseconds 1-999
    '%v': date => date.getMilliseconds(),
    
    // 24-hour format of an hour with leading zeros, 00 through 23
    '%H': date => date.getHours().toString().padStart(2, "0"),
    
    // 12-hour format of an hour with leading zeros, 01 through 12
    '%h': date => (date.getHours() % 12 || 12).toString().padStart(2, "0"),
    
    // 12-hour format of an hour without leading zeros, 	1 through 12
    '%g': date => date.getHours() % 12 || 12,
    
    // 24-hour format of an hour without leading zeros, 0 through 23
    '%G': date => date.getHours(),
    
    // Minutes with leading zeros, 	00 to 59
    '%i': date => date.getMinutes().toString().padStart(2, "0"),
    
    // Seconds with leading zeros, 00 through 59
    '%s': date => date.getSeconds().toString().padStart(2, "0"),

    // Year
    // A full numeric representation of a year, 4 digits, Examples: 1999 or 2003
    '%Y': date => date.getFullYear(),
    
    // A two digit representation of a year, Examples: 99 or 03
    '%y': date => date.getFullYear().toString().slice(2),
    
    //Whether it's a leap year, 1 if it is a leap year, 0 otherwise.
    '%L': date => ((date.getFullYear() % 4 == 0) && (date.getFullYear() % 100 != 0)) || (date.getFullYear() % 400 == 0),

    // Month
    // 	Numeric representation of a month, with leading zeros, 01 through 12
    '%m': date => (date.getMonth() + 1).toString().padStart(2, "0"),
    
    // A short textual representation of a month, three letters, 	Jan through Dec
    '%M': date => months[date.getMonth()].slice(0, 3),
    
    // A full textual representation of a month, such as January or March, January through December
    '%F': date => months[date.getMonth()],

    //Numeric representation of a month, without leading zeros, 1 through 12
    '%n': date => date.getMonth() + 1,

    // Day
    // 	Day of the month, 2 digits with leading zeros
    '%d': date => date.getDate().toString().padStart(2, "0"),
    
    // Day of the month without leading zeros
    '%j': date => date.getDate().toString(),
    
    // A textual representation of a day, three letters
    '%D': date => days[date.getDay()].slice(0, 3),
    
    // A full textual representation of the day of the week
    '%l': date => days[date.getDay()],
    
    // 	ISO-8601 numeric representation of the day of the week, 1 (for Monday) through 7 (for Sunday)
    '%N': date => date.getDay() || 7,

    //	English ordinal suffix for the day of the month, 2 characters, st, nd, rd or th. Works well with j
    '%S': date => '<todo S>',
    
    //The day of the year (starting from 0), 0 through 365
    '%z': date => Math.ceil((date - new Date(date.getFullYear(), 0, 1)) / 86400000),
    
    //ISO-8601 week number of year, weeks starting on Monday, Example: 42 (the 42nd week in the year)
    '%W': date => '<todo W>',
    
    // Number of days in the given month, 28 through 31
    '%t': date => '<todo t>',
    
    //Timezone identifier, Examples: UTC, GMT, Atlantic/Azores
    '%e': date => '<todo e>',
    
    //Difference to Greenwich time (GMT) with colon between hours and minutes (added in PHP 5.1.3)
    '%P': date => '<todo P>',
    
    //Timezone identifier, Examples: UTC, GMT, Atlantic/Azores
    '%c': date => date.toString(),
    
    '%r': date => format(date, '%Y-%m-%dT%H:%i:%s%P'),

    // Other
    //Seconds since the Unix Epoch (January 1 1970 00:00:00 GMT)
    '%U': date => Math.floor(date.getTime() / 1000),
    // 	Swatch Internet time, 000 through 999
    '%B': date => Math.floor((date.getUTCSeconds() + (date.getUTCMinutes() * 60) + ((date.getUTCHours() + 1) * 3600)) / 86.4).toString().padStart(3, '0'),
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
    format,
    defaults
};