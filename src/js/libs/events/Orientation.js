/**
 * Usage:
 * let orientation = require('./libs/events/Orientation').Factory();
 * orientation.on('portrait', e => {
 *  // code
 * });
 * 
 * orientation.on('landscape', e => {
 *  // code
 * });
 * 
 * orientation.on('change', e => {
 *  // code
 * });
 * 
 * OR
 * 
 * class example extends Orientation {
 *  constructor(){
 *      super()
 * 
 *      this.on('portrait', e => {
 *          // code
 *      })
 *  }
 * }
 * 
 */


const Event = require('./Event.js');

module.exports = class Orientation extends Event {

    /**
     * Events:
     * portrait,
     * landscape,
     * change,
     */
    constructor() {
        super();

        let mql = window.matchMedia("(orientation: portrait)");
        // If there are matches, we're in portrait
        this.orientation = mql.matches ?
            'portrait' :
            'landscape';

        // Add a media query change listener
        mql.addListener(e => {
            this.orientation = e.matches ?
                'portrait' :
                'landscape';

            e.matches ?
                this.emit('portrait', {orientation : this.orientation}) :
                this.emit('landscape', {orientation : this.orientation});

            this.emit('change', {orientation : this.orientation});
        });
    }

    static Factory() {
        return new Orientation();
    }
}