/**
 * Usage:
 * let motion = require('./libs/events/Motion').Factory();
 * motion.on('motion portrait_inverse portrait', e => {
 *  // e.alpha, e.beta, e.gamma, e.type etc,.
 * });
 */


const Event = require('./Event.js');

module.exports = class Motion extends Event {

    /**
     * Events:
     *  motion,
     * 
     *  portrait,
     *  portrait_inverse,
     *  landscape_left,
     *  landscape_right,
     *  display_up,
     *  display_down,
     */
    constructor() {
        super();

        if (window.DeviceOrientationEvent) {
            window.addEventListener("deviceorientation", e => {
                let data = {
                    // Rotate
                    'alpha': event.alpha,
                    // forward tilt
                    'beta': event.beta,
                    // Side tilt
                    'gamma': event.gamma,
                    'type': 'deviceorientation'
                };
                this.emit('motion', data);
            }, true);

        } else if (window.DeviceMotionEvent) {
            window.addEventListener('devicemotion', e => {
                let data = {
                    'alpha': event.acceleration.z * 2,
                    'beta': event.acceleration.x * 2,
                    'gamma': event.acceleration.y * 2,
                    'type': 'devicemotion'
                };
                this.emit('motion', data);
            }, true);
        } else {
            window.addEventListener("MozOrientation", e => {
                let data = {
                    'alpha': orientation.z * 50,
                    'beta': orientation.x * 50,
                    'gamma': orientation.y * 50,
                    'type': 'MozOrientation'
                };
                this.emit('motion', data);
            }, true);
        }

        this.on('motion', e => {

            let varians = (value, compare, varians = 10) => value >= compare - varians && value <= compare + varians;

            let rotations = {
                portrait: e => varians(e.beta, 90) && varians(e.gamma, 0),
                portrait_inverse: e => varians(e.beta, -90) && varians(e.gamma, 0),
                landscape_left: e => varians(e.beta, 90) && varians(e.gamma, -90),
                landscape_right: e => varians(e.beta, 90) && varians(e.gamma, 90),
                display_up: e => varians(e.beta, 0) && varians(e.gamma, 0),
                display_down: e => varians(e.beta, 180) && varians(e.gamma, 0)
            }

            Object.entries(rotations).forEach(callback => {
                if (callback[1](e)) {
                    this.emit(`motion_${callback[0]}`, e);
                }
            });
        });
    }

    static Factory() {
        return new Motion();
    }
}