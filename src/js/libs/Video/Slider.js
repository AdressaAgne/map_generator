const Event = require('../events/Event');

module.exports = class Slider extends Event {

    /**
     * 
     * All params optional
     * @param {HTMLElement} element 
     * @param {Float} value 
     * @param {Float} min 
     * @param {Float} max 
     * @param {Float} step 
     */
    constructor(element = null, value = 0, min = 0, max = 100, step = 1.0) {
        super();

        this.element = element == null ? this.generate() : element;

        this.min = min == NaN ? 0 : min;
        this.max = max == NaN ? 100 : max;
        this.step = step;
        this.value = value;

        this.mousedown = false;

        this.element.element.addEventListener('mousedown', this.down.bind(this));
        this.element.element.addEventListener('touchstart', this.down.bind(this));

        window.addEventListener('mouseup', this.up.bind(this));
        window.addEventListener('touchend', this.up.bind(this));

        window.addEventListener('mousemove', this.move.bind(this));
        window.addEventListener('touchmove', this.move.bind(this));

    }

    /**
     * a factory to make Sliders
     */
    static Factory() {
        return new Slider();
    }

    /**
     * Get the generated element / the passed element constructor
     */
    getElm() {
        return this.element.element;
    }

    generate() {
        let element = document.createElement('span');
        element.className = 'progress-bar';

        let time = document.createElement('span');
        time.className = 'time';
        time.textContent = '00:00';

        let played = document.createElement('span');
        played.className = 'played';
        played.style.width = '0%';

        let scrubber = document.createElement('span');
        scrubber.className = 'scrubber';

        element.appendChild(time);
        element.appendChild(played);
        played.appendChild(scrubber);

        return {
            element,
            time,
            played,
            scrubber
        };
    }

    static getOffset(el) {
        var _x = 0;
        var _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return {
            top: _y,
            left: _x
        };
    }

    down(e) {
        this.mousedown = true;
        this.element.element.setAttribute('dirty', 'dirty');

        let x = (e.pageX == undefined) ? e.touches[0].pageX : e.pageX;

        let percent = (x - Slider.getOffset(this.element.element).left) / this.element.element.clientWidth * 100;

        this.setPercent(percent);

        this.element.element.setAttribute('mode', 'active');

        this.emit('start', {slider : this});
    }

    up(e) {
        this.mousedown = false;
        this.element.element.setAttribute('mode', 'static');

        this.emit('end', {slider : this});
    }

    move(e) {
        if (this.mousedown) {
            let x = (e.pageX == undefined) ? e.touches[0].pageX : e.pageX;
            let left = (x - Slider.getOffset(this.element.element).left) / this.element.element.clientWidth * 100;
            this.setPercent(left);
        }
    }

    getValue() {
        return this.value;
    }

    getPercent() {
        return ((this.value - this.min) * 100) / (this.max - this.min);
    }

    setPercent(percent, evt = true) {
        percent = percent < 0 ? 0 : percent;
        percent = percent > 100 ? 100 : percent;

        this.value = ((percent * (this.max - this.min) / 100) + this.min);

        this.element.played.style.width = `${percent}%`;
        this.element.element.setAttribute('data-value', this.value);

        this.setTime();

        if(evt) this.emit('change', {slider : this});
    }

    setValue(value, evt = true) {
        this.value = value < this.min ? this.min : value;
        this.value = value > this.max ? this.max : value;

        let percent = this.getPercent();

        this.element.played.style.width = `${percent}%`;
        this.element.element.setAttribute('data-value', this.value);

        this.setTime();

        if(evt) this.emit('change', {slider : this});
    }

    setTime() {
        this.element.time.textContent = `${this.getTime(this.value)} / ${this.getTime(this.max)}`;
    }

    getTime(totalSeconds) {
        let h = Math.floor(totalSeconds / 3600);
        totalSeconds %= 3600;
        let m = Math.floor(totalSeconds / 60);
        let s = parseInt(totalSeconds % 60);

        m = (m+"").padStart(2, "0");
        s = (s+"").padStart(2, "0");

        return (
            h > 0 ? (`${h}:${m}:${s}`) : (`${m}:${s}`)
        );
    }

}