/**
 * Used to manage events in classes
 */


// set EventArray class _evtContainer
class Event {

    /**
     * Event init, define event container
     * @method constructor
     */
    constructor() {
        this._evtContainer = {};

        this.fireEvent = this.emit.bind(this);
        this.dispatch = this.emit.bind(this);

        this.addEventListener = this.on.bind(this);
        this.removeEventListener = this.off.bind(this);

        setTimeout(() => this.fireEvent('load'), 0);
    }

    /**
     * Fire an event
     * @method fireEvent
     * @param  {String}  evt   [Event name]
     * @param  {Object}  param [function bind]
     * @return {void}
     */
    emit(evt, param) {
        // Does the event exist
        if (!this.has(evt)) return false;

        let events = this.get(evt);
        for (let i = 0; i < events.length; i++) {
            const callback = array[i];

            // Call callback functions if it exists
            if (callback && typeof callback === 'function') {
                let e = Object.assign((param || {}), {
                    _type: evt,
                    _emitter: this.constructor.name,
                    _off: () => this.delete(evt, callback),
                    _callback: callback
                });
                callback.bind(this)(e);
            }
        };

        return this;
    }

    /**
     * Set event functions
     * @method on
     * @param  {Event}    evts     [event names]
     * @param  {Function} callback [callback]
     * @return {this}
     */
    on(evts, callback = null) {
        if (typeof callback !== 'function') throw Error('Callback must be a function');

        let event_array = evts.split(' ');
        for (let i = 0; i < event_array.length; i++) {
            const evt = event_array[i];

            this.create(evt).add(evt, callback);
        }
        return this;
    }


    /**
     * Remove event function
     * @param {String} events
     * @param {Callback} function
     */
    off(evts, callback = null) {
        let event_array = evts.split(' ');
        for (let i = 0; i < event_array.length; i++) {
            const evt = event_array[i];
            callback !== null ? this.delete(evt, callback) : this.reset(evt);
        }

    }

    /**
     * Get an EventContainer
     * @param {String} evt 
     */
    get(evt) {
        return this._evtContainer[evt];
    }

    /**
     * check if event exists
     * @param {String} evt 
     */
    has(evt) {
        return this.get(evt) !== undefined && this.get(evt) instanceof Map;
    }

    /**
     * Add an event to an EventContainer
     * @param {String} evt 
     * @param {Function} callback 
     */
    add(evt, callback) {
        this.get(evt).set(callback, callback);

        if (this.get(evt).size > Event.MAX_LISTENERS) {
            console.warn(`Event ${evt} has more then ${Event.MAX_LISTENERS} listeners. (You can change Event.MAX_LISTENERS)`);
        }

        return this;
    }

    /**
     * Create Event container if it does not exist
     * @param {String} evt 
     */
    create(evt) {
        if (this.has(evt)) return this;

        this._evtContainer[evt] = new Map();

        return this;
    }

    /**
     * Reset an EventContainer to null
     * @param {String} evt 
     */
    reset(evt) {
        if (!this.has(evt)) return this;

        this._evtContainer[evt] = new Map();

        return this;

    }

    /**
     * Delete an EventContainer
     * @param {String} evt 
     */
    delete(evt, callback) {
        if (evt && callback && !this.has(evt) && this.get(evt).has(callback)) return this;

        this.get(evt).delete(callback);

        return this;
    }

}


let max_listeners = 10;
/**
 * Define Event vars, and set setters
 */
Object.defineProperties(Event, {

    MIN_MAX_LISTENERS: {
        value: 1,
        writable: false
    },

    MAX_LISTENERS: {
        set(value) {
            if (typeof value != 'number') throw new Error('Event.MAX_LISTENERS must be typeof Number, got ' + typeof value);

            if (value < Event.MIN_MAX_LISTENERS) throw new Error(`Event.MAX_LISTENERS should be abow ${Event.MIN_MAX_LISTENERS}`);

            max_listeners = value;
        },
        get() {
            return max_listeners;
        }
    }

});

/**
 * Export Event class
 */
module.exports = Event;