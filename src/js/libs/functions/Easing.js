/**
 * Usage:
 * const {bounceOut, circInOut, linear} = require('./libs/functions/Easing');
 * bounceOut()
 * circInOut()
 * linear()
 * 
 * OR
 * 
 * const easing = require('./libs/functions/Easing');
 * easing.bounceOut()
 * easing.circInOut()
 * easing.linear()
 */


module.exports = {
    bounceOut: function (time, begin, change, duration) {
        if ((time /= duration) < 1 / 2.75) {
            return change * (7.5625 * time * time) + begin;
        } else if (time < 2 / 2.75) {
            return change * (7.5625 * (time -= 1.5 / 2.75) * time + 0.75) + begin;
        } else if (time < 2.5 / 2.75) {
            return change * (7.5625 * (time -= 2.25 / 2.75) * time + 0.9375) + begin;
        } else {
            return change * (7.5625 * (time -= 2.625 / 2.75) * time + 0.984375) + begin;
        }
    },

    bounceIn: function (time, begin, change, duration) {
        return change - this.bounceOut(duration - time, 0, change, duration) + begin;
    },

    bounceInOut: function (time, begin, change, duration) {
        if (time < duration / 2) {
            return this.bounceIn(time * 2, 0, change, duration) * 0.5 + begin;
        } else {
            return this.bounceOut(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;
        }
    },

    linear: function (time, begin, change, duration) {
        return change * time / duration + begin;
    },

    circIn: function (time, begin, change, duration) {
        return -change * (Math.sqrt(1 - (time = time / duration) * time) - 1) + begin;
    },

    circOut: function (time, begin, change, duration) {
        return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
    },

    circInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
        } else {
            return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
        }
    },

    cubicIn: function (time, begin, change, duration) {
        return change * (time /= duration) * time * time + begin;
    },

    cubicOut: function (time, begin, change, duration) {
        return change * ((time = time / duration - 1) * time * time + 1) + begin;
    },

    cubicInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time * time + begin;
        } else {
            return change / 2 * ((time -= 2) * time * time + 2) + begin;
        }
    },

    expoIn: function (time, begin, change, duration) {
        if (time === 0) {
            return begin;
        }
        return change * Math.pow(2, 10 * (time / duration - 1)) + begin;
    },

    expoOut: function (time, begin, change, duration) {
        if (time === duration) {
            return begin + change;
        }
        return change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
    },

    expoInOut: function (time, begin, change, duration) {
        if (time === 0) {
            return begin;
        } else if (time === duration) {
            return begin + change;
        } else if ((time = time / (duration / 2)) < 1) {
            return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
        } else {
            return change / 2 * (-Math.pow(2, -10 * (time - 1)) + 2) + begin;
        }
    },

    quadIn: function (time, begin, change, duration) {
        return change * (time = time / duration) * time + begin;
    },

    quadOut: function (time, begin, change, duration) {
        return -change * (time = time / duration) * (time - 2) + begin;
    },

    quadInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time + begin;
        } else {
            return -change / 2 * ((time -= 1) * (time - 2) - 1) + begin;
        }
    },

    quartIn: function (time, begin, change, duration) {
        return change * (time = time / duration) * time * time * time + begin;
    },

    quartOut: function (time, begin, change, duration) {
        return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
    },

    quartInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time * time * time + begin;
        } else {
            return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
        }
    },

    quintIn: function (time, begin, change, duration) {
        return change * (time = time / duration) * time * time * time * time + begin;
    },

    quintOut: function (time, begin, change, duration) {
        return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
    },

    quintInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time * time * time * time + begin;
        } else {
            return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;
        }
    },

    sineIn: function (time, begin, change, duration) {
        return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
    },

    sineOut: function (time, begin, change, duration) {
        return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
    },

    sineInOut: function (time, begin, change, duration) {
        return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
    },

};