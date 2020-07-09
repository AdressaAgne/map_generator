/**
 * Usage:
 * 
 * const Parallax = require('./libs/functions/Parallax');
 * 
 * Parallax.add(node, factor, callback);
 * Parallax.add('li', 1);
 * Parallax.add('li', 'data-ratio');
 * 
 * Parallax.start();
 * Parallax.stop();
 * 
 */

// Polyfills
require('core-js/fn/set-immediate');
/**
 * Debug
 */
const log = console.log;

/**
 * Imports
 */
const Animation = require('./RequestAnimationFrame');
const ViewprortChecker = require('../events/ViewportChecker');

/**
 * Declaring consts
 */
const render = new Animation();

const q = document.querySelector.bind(document);
const elements = {
    html: q('html'),
    body: q('body')
}

/**
 * Only draw when in view.. (viewportchecker)
 * use Animations to render
 */
class Parallax {
    constructor() {
        this.elements = [];
    }

    /**
     * Add element
     */
    add(elm, factor = 1, callback = null) {

        if (typeof elm == 'string') {
            elm = document.querySelectorAll(elm);
        }

        if (elm instanceof NodeList || elm instanceof Array) {
            elm.forEach(elm => this.add(elm, factor, callback));

            return;
        }

        if (typeof factor == 'string') {
            factor = parseFloat(elm.getAttribute(factor));
        }

        elm.factor = factor;

        if (!callback || typeof callback !== 'function') {
            callback = el => {
                let scrolled = Parallax.getScrollTop();
                let top = el.offsetTop;
                let diff = scrolled - top;

                return -((diff * factor)).toFixed(1);
            }
        }

        this.elements.push({
            elm,
            calculate: () => callback(elm)
        });

        /**
         * Call the loop once without viewport checker to position elements correctly
         */
        //setImmediate(() => loop(true));
    }

    /**
     * Get scrolltop
     */
    static getScrollTop() {
        return Math.max(elements.body.scrollTop, elements.html.scrollTop, (window.scrollTop || 0));
    }

    /**
     * Get all elements in paralex
     */
    getElements() {
        return this.elements;
    }

    /**
     * Check if the HTMLElement is using best practeces.
     * @param {HTMLElement} elm 
     */
    checker(elm) {
        if (!(elm instanceof HTMLElement)) {
            throw new Error(`Parallax takes HTMLElement, Element is not instanceof HTMLElement`);
        }

        let style = window.getComputedStyle(elm);

        let allowedStyles = {
            'position': ['absolute', 'fixed'],
        }

        let avoidStyle = {
            'background-size': ['cover'],
        }

        for (let key in allowedStyles) {
            let value = allowedStyles[key];
            if (value.indexOf(style.getPropertyValue(key)) < 0) {
                let str = value.map(item => `${key}: ${item};`).join(" or ");
                console.warn('[Parallax]', elm, `HTMLElement should have ${str} for best preformance.`);
                console.warn('[Parallax]', `See: https://medium.com/@dhg/parallax-done-right-82ced812e61c`);
            }
        }

    }

}

let parallax = new Parallax();


const loop = e => {
    let arr = parallax.getElements();
    for (let i = 0; i < arr.length; i++) {
        const item = arr[i];

        if (e !== true) {
            if (!ViewprortChecker.isInViewport(item.elm, -(item.elm.offsetTop * item.elm.factor), false)) {
                continue;
            }
        }

        let value = item.calculate();

        /**
         * Lt 5 v.
         */
        item.elm.style.setProperty('-webkit-transform', `translateY(${value}px)`);
        item.elm.style.setProperty('-ms-transform', `translateY(${value}px)`);
        item.elm.style.setProperty('transform', `translateY(${value}px)`);

    }
};

/**
 * Start the Animation loop
 */
render.start(loop);


// Send relevant functions to user
module.exports = {
    add: parallax.add.bind(parallax),
    stop: render.stop,
    start: () => render.start(loop),
};