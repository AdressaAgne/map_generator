NodeList.prototype.filter = [].filter;
NodeList.prototype.map = [].map;
NodeList.prototype.reverse = [].reverse;
NodeList.prototype.sort = [].sort;
NodeList.prototype.get = [].item;
NodeList.prototype.indexOf = [].indexOf;
NodeList.prototype.forEach = [].forEach || function (callback) {
    for (let i = 0; i < this.length; i++) {
        callback(this[i], i);
    }
}

/**
 * String manipulation
 */
String.prototype.ucFirst = function () {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
}
String.prototype.ucWords = function () {
    return this.split(' ').map(e => e.ucFirst()).join(' ');
}

String.prototype.ucLast = function () {
    return this.split(' ').splice(-1).toLowerCase() + this.split(' ').pop().ucFirst();
}

/**
 * Other functions
 */
HTMLElement.prototype.rainbow = function (random, ...colors) {
    if (typeof random !== 'boolean') {
        colors.unshift(random);
        random = false;
    }
    colors = (colors[0] instanceof Object) ? Object.values(colors[0]) : colors;

    if (random) colors = colors.sort((a, b) => Math.random() - Math.random());

    let str = this.textContent;
    let divided = str.match(new RegExp('.{0,' + Math.ceil(str.length / colors.length) + '}', 'g')).map((value, i) => {
        return `<span style="color: ${colors[i]};">${value}</span>`;
    });

    this.innerHTML = divided.join("");
    return this;
}

NodeList.prototype.rainbow = function (...colors) {
    this.forEach(item => item.rainbow(...colors));
    return this;
}

/**
 * Get relative nodes
 */

NodeList.prototype.first = function () {
    return this.index(0);
}

HTMLElement.prototype.first = function () {
    return this;
}

NodeList.prototype.last = function () {
    return this.index(this.length - 1);
}

HTMLElement.prototype.last = function () {
    return this;
}

HTMLElement.prototype.next = function () {
    return this.nextElementSibling;
}

HTMLElement.prototype.prev = function () {
    return this.previousElementSibling;
}

NodeList.prototype.text = function (text = null) {
    if (typeof text == 'string') {
        this.forEach(item => item.text(text));
        return this;
    }
    return this.first().text();
}
HTMLElement.prototype.text = function (text = null) {
    if (typeof text == 'string') {
        this.textContent = text;
        return this;
    }
    return this.textContent;
}

NodeList.prototype.empty = function () {
    this.forEach(item => item.empty());

    return this;
}

HTMLElement.prototype.empty = function () {
    this.textContent = "";
    this.value = "";

    return this;
}

HTMLElement.prototype.val = function (text = null) {
    if (typeof value == 'string' || typeof value == 'number') {
        this.value = value;
        return this;
    }

    return this.value;
}

HTMLElement.prototype.parent = function () {
    return this.parentNode;
}

NodeList.prototype.find = function (selector) {
    return this.first().find(selector);
}

HTMLElement.prototype.find = function (selector) {
    let s = this.querySelectorAll(selector);
    return s.length == 1 && s[0] ? s[0] : s;
}

NodeList.prototype.parent = function () {
    return this.first().parent();
}
NodeList.prototype.odd = function () {
    return this.filter((v, i) => i & 1);
}
NodeList.prototype.even = function () {
    return this.filter((v, i) => i + 1 & 1);
}
NodeList.prototype.nth = function (n) {
    return this.filter((v, i) => i % n == 0);
}
NodeList.prototype.not = function (selector) {
    let q;

    if (selector instanceof NodeList) {
        q = selector;
    } else {
        q = document.querySelectorAll(selector);
    }

    return this.filter(item => q.indexOf(item) < 0);
}


NodeList.prototype.index = function (i) {
    if(i == undefined) {
        if(this.length < 2) return 0;
        return this.first().index();
    }

    return this.item(i);
}

HTMLElement.prototype.index = function (i) {
    if(i) return this;
    return [...this.parent().children].indexOf(this);
}

NodeList.prototype.bb = function () {
    return this.first().bb();
}

HTMLElement.prototype.bb = function () {
    return this.getBoundingClientRect();
}

/**
 * Set scrollTop
 */
NodeList.prototype.scrollTo = function (y, x = 0) {
    this.forEach(item => item.scrollTo(y, x));
    return this;
}

HTMLElement.prototype.scrollTo = function (y, x = 0) {
    /**
     * Bug in safari if you set scrollTop to more then scrollheight
     */
    let maxY = Math.max(
        document.body.scrollHeight,
        document.body.offsetHeight,
        document.documentElement.clientHeight,
        document.documentElement.scrollHeight,
        document.documentElement.offsetHeight
    ) - window.innerHeight;

    this.scrollTop = y > maxY ? maxY : y;
    this.scrollLeft = x;

    return this;
}


/**
 * Classlist
 */

HTMLElement.prototype.hasClass = function (cls) {
    return this.className.split(' ').indexOf(cls) > -1;
}

// Add
HTMLElement.prototype.addClass = function (cls) {
    if (this.hasClass(cls)) return this;
    this.className = [...this.className.split(' '), cls].join(' ').trim();
    return this;
}
NodeList.prototype.addClass = function (cls) {
    this.forEach(item => item.addClass(cls));
    return this;
}

// Remove
HTMLElement.prototype.removeClass = function (cls) {
    if (!this.hasClass(cls)) return this;

    let classes = this.className.trim().split(' ');
    classes.splice(classes.indexOf(cls), 1);

    this.className = classes.join(' ').trim();

    return this;
}
NodeList.prototype.removeClass = function (cls) {
    this.forEach(item => item.removeClass(cls));
    return this;
}

// Toggle
HTMLElement.prototype.toggleClass = function (cls) {
    return this.hasClass(cls) ? this.removeClass(cls) : this.addClass(cls);
}

NodeList.prototype.toggleClass = function (cls) {
    this.forEach(item => item.toggleClass(cls));
    return this;
}

/**
 * Remove Element
 */
HTMLElement.prototype.remove = function () {
    this.parentNode.removeChild(this);
}

NodeList.prototype.remove = function () {
    this.forEach(item => item.remove());
}

/**
 * Attribtues
 */
HTMLElement.prototype.attr = function (key, value) {
    return value ? this.setAttribute(key, value) : this.getAttribute(key);
}

NodeList.prototype.attr = function (key, value) {
    this.forEach(item => item.attr(key, value));
    return this;
}

HTMLElement.prototype.removeAttr = function (key) {
    this.removeAttribute(key);
    return this;
}

NodeList.prototype.removeAttr = function (key) {
    this.forEach(item => item.removeAttr(key));
    return this;
}


/**
 * Events
 */
HTMLElement.prototype.on = function (events, callback) {
    events.split(' ').forEach(event => this.addEventListener(event, callback));
    return this;
}

NodeList.prototype.on = function (event, callback) {
    this.forEach(item => item.on(event, callback));
    return this;
}

HTMLElement.prototype.off = function (events, callback) {
    events.split(' ').forEach(event => this.removeEventListener(event, callback));

    return this;
}

NodeList.prototype.off = function (event, callback) {
    this.forEach(item => item.off(event, callback));
    return this;
}


/**
 * Styling
 */

HTMLElement.prototype.css = function (key, value) {
    return (value ? this.style.setProperty(key, value) : this.style.getPropertyValue(key)) || this;
}

NodeList.prototype.css = function (key, value) {
    this.forEach(item => item.css(key, value));
    return this;
}


/**
 * Animations
 * todo: ScrollMotion/Bind ScrollTop to animations
 * css transforms
 */
window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };


NodeList.prototype.animate = function (...params) {
    this.forEach(item => item.animate(...params));
    return this;
}

const unitless = ['opacity', 'line-height', 'z-index', 'font-weight', 'order', 'scaleX', 'scaleY', 'scaleZ'];

HTMLElement.prototype.animate = function (props = {}, duration = 60, easing = null, callback = null) {
    let _this = this;

    if (easing == null || typeof easing !== 'function') {
        easing = (time, begin, change, duration) => change * time / duration + begin;
    }

    if (typeof duration == 'string') {
        // fast, medium, slow etc..
        duration = duration == 'fast' ? 60 : duration;
        duration = duration == 'medium' ? 180 : duration;
        duration = duration == 'slow' ? 260 : duration;
    }

    const keys = Object.keys(props);
    const styles = getComputedStyle(this);

    /**
     * Init properties
     */
    let properties = [];
    for (let i = 0; i < keys.length; i++) {
        const prop = keys[i];
        const value = props[prop];

        const isObject = typeof value == 'object';

        const begin = isObject && (value.start !== undefined || value.from !== undefined) ? (value.start || value.from) : parseFloat(styles.getPropertyValue(prop));

        properties.push({
            prop: prop,
            begin: begin,
            change: (isObject ? value.value || value.to : value) - begin,
            time: (isObject && value.time !== undefined) ? value.time || 0 : 0,
            duration: (isObject && value.duration !== undefined ? value.duration : duration),
            unit: (isObject ? value.unit || 'px' : 'px'),
            easing: (isObject && value.easing !== undefined && typeof value.easing === 'function') ? value.easing : easing,
            callback: isObject && value.callback ? value.callback : false,
        });
    }

    /**
     * Animation loop
     */
    const loop = () => {
        let transform = [];

        for (let i = 0; i < properties.length; i++) {
            const item = properties[i];
            const key = item.prop;
            const value = item.easing(item.time, item.begin, item.change, item.duration).toFixed(2);
            const unit = unitless.indexOf(key) > -1 ? '' : item.unit;

            let transforms = ['translateY', 'translateX', 'translateZ', 'scaleX', 'scaleY', 'scaleZ', 'rotateX', 'rotateY', 'rotateZ', 'skewX', 'skewZ', 'skewY'];
            //let transforms = [0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0];
            let t = transforms.indexOf(key);
            if (t > -1) {
                transform.push(`${transforms[t]}(${value}${unit})`);
            } else {
                _this.style.setProperty(key, value + unit);
            }
            /**
             * If the animation is done, remove it
             */
            if (++item.time > item.duration) {
                if (item.callback) {
                    item.callback(_this);
                }
                properties.splice(i, 1);
            }
        }

        if (transform.length > 0) {
            _this.style.setProperty('transform', transform.join(' '));
        }

        // request the execution of the loop if there is properites that is not finsihed
        if (properties.length > 0) {
            requestAnimationFrame(loop);
        } else {
            if (typeof callback == 'function') {
                callback(_this)
            }
        }
    }

    /**
     * Start
     */
    loop();

    return this;
}


/**
 * fadeIn
 */
NodeList.prototype.fadeIn = function (duration = 'fast') {
    this.forEach(item => item.fadeIn(duration));
    return this;
}

HTMLElement.prototype.fadeIn = function (duration = 'fast') {
    this.animate({
        'opacity': {
            from: 0,
            to: 1
        }
    }, duration);
    return this;
}

/**
 * fadeOut
 */
NodeList.prototype.fadeOut = function (duration = 'fast') {
    this.forEach(item => item.fadeOut(duration));
    return this;
}

HTMLElement.prototype.fadeOut = function (duration = 'fast') {
    this.animate({
        'opacity': {
            from: 1,
            to: 0
        }
    }, duration);
    return this;
}


module.exports = selector => {
    let s = document.querySelectorAll(selector);
    return s.length <= 1 && s[0] ? s[0] : s;
}