/**
 * Usage:
 * 
 * const Timer = require('./libs/functions/Timer');
 * 
 * let timer = new Timer();
 * 
 * timer.on('update', e => {
 *      //code
 * });
 * 
 * timer.start();
 * 
 */

const Event = require('./events/Event');

module.exports = class Timer extends Event {
    /**
     * Init the Time
     * Events:
     *  update   : fires every timer update, default 1000ms
     *  start    : fired when timer starts
     *  stop     : fired when timer is stopped
     *  reset    : fired when timer is reset back to startTime
     *
     * @method constructor
     * @param  {Number}    [start]   [Timer start point]
     * @param  {Number}    [stop] [Timer stop point]
     * @param  {Number}    [frequency] [Timer count frequency in ms]
     */
    constructor(start = 0, stop = null, frequency = 1000) {
        super();

        this.frequency = frequency;
        this.set(start);
        this.setStart(start)
        this.setStop(stop);
        this.setCountDirection();
    }

    static Factory(start = 0, stop = null, frequency = 1000) {
        return new Timer(start, stop, frequency);
    }

    /**
     * Start the timer
     * @method start
     * @return {Void}
     */
    start() {
        this.emit('start', this);
        this.emit('update', this);
        this.interval = setInterval(() => {
            this.countUp ? this.time++ : this.time--;

            this.emit('update', this);
            if (this.stop != null && this.time == this.stopTime) this.stop();

        }, this.frequency);

        return this;
    }

    /**
     * Set timer time
     * @method set
     * @param  {Number} [int] [time in sec]
     */
    set(int = 0) {
        this.time = int;

        return this;
    }

    /**
     * Set timer start time
     * @method setStart
     * @param  {Number} [int] [start time in sec]
     */
    setStart(int = 0) {
        this.startTime = int;

        return this;
    }

    /**
     * [setStop description]
     * @method setStop
     * @param  {Number|null} [int] [Stop time in sec | null if not set]
     */
    setStop(int = null) {
        this.stopTime = int;

        return this;
    }

    /**
     * Set the count direction
     * @method setCountDirection
     * @param  {Bolean} [up] [CountUp]
     */
    setCountDirection(up = null) {
        this.countUp = up == null ? (this.stopTime == null ? 1 : this.startTime < this.stopTime) : up;

        return this.countUp;
    }

    /**
     * Seconds to toHumanReadable
     * @method toHumanReadable
     * @param  {int}        [int=this.time] [seconds]
     * @return {string}                     [HH:MM:SS]
     */
    static toHumanReadable(int = 0) {
        let sec = int % 60;
        let min = ~~((int / 60) % 60);
        let hour = ~~(int / 3600);

        return `${hour.toString.padStart(2, '0')}:${min.toString.padStart(2, '0')}:${sec.toString.padStart(2, '0')}`;
    }

    /**
     * Toggle start and stop
     * @method toggle
     * @return {Void}
     */
    toggle() {
        return this.isRunning() ? this.stop() : this.start();
    }

    /**
     * Check if the timer is running
     * @method isRunning
     * @return {Boolean}
     */
    isRunning() {
        return this.interval != null;
    }

    /**
     * Stop the timer
     * @method stop
     * @return {Number} [time in sec]
     */
    stop() {
        clearInterval(this.interval);
        this.interval = null;
        this.emit('stop', this);

        return this;
    }

    /**
     * Reset timer back to startTime
     * @method reset
     * @return {Number} [time in sec at reset point]
     */
    reset() {
        clearInterval(this.interval);
        this.interval = null;
        this.emit('reset', this);
        this.set(this.startTime);

        return this;
    }

    /**
     * Restart timer
     * @method restart
     * @return {Number} [time in sex at restart point]
     */
    restart() {
        this.reset();
        this.start();

        return this;
    }

}