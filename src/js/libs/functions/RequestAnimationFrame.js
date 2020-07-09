/**
 * Usage:
 * const Animate = require('./libs/functions/Animate');
 * let loop = new Animate();
 * 
 * // Run a 60fps loop
 * loop.start(() => {
 *      if(a == b) {
 *          loop.stop();
 *      }
 * });
 * 
 */

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

module.exports = class Animate {

    static Factory(cb) {
        let loop =  new Animate();
        return loop.start(cb);
    }

    /**
     * @param {Callback} cb 
     */
    start(callback) {
        if (typeof callback !== 'function') return;

        this.done = false;

        let func = function (e) {
            callback(e);
            if (!this.done) {
                window.requestAnimationFrame(func);
            }
        }.bind(this);

        this.id = window.requestAnimationFrame(func);

        return this;
    }

    /**
     * Stop
     */
    stop() {
        this.done = true;

        return this;
    }

}