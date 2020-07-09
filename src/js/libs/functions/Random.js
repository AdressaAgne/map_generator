/**
 * Usage:
 * const {seed, random} = require('./libs/functions/Random');
 * 
 * seed('123ghja');
 * 
 * The random values will be the same for every reload
 * 
 * random() // get a random Float from 0 to 1
 * random() // get a random Float from 0 to 1
 * 
 */

let w = 123456789;
let z = 987654321;
let mask = 0xffffffff;

const seed = (i) => {
    s = parseInt(i.toString().split('').map(j => /\d/.test(j) ? j : j.charCodeAt(0)).join(''));

    w = (123456789 + s) & mask;
    z = (987654321 - s) & mask;
}

const random = () => {
    z = (36969 * (z & 65535) + (z >> 16)) & mask;
    w = (18000 * (w & 65535) + (w >> 16)) & mask;
    let result = ((z << 16) + (w & 65535)) >>> 0;
    return result /= 4294967296;
}

module.exports = {
    seed,
    random
}