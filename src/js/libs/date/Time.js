/**
 * Usage:
 * const time = require('./libs/date/Time');
 * time() // Get time in seconds since jan 1. 1970 00:00:00
 */

module.exports = (date) => Math.floor(((date instanceof Date) ? date.getTime() : date !== undefined ? new Date(date).getTime() : new Date().getTime()) / 1000);