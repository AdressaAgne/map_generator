/**
 * Usage:
 * const Fullscreeen = require('./libs/functions/Fullscreen');
 * 
 * Fullscreeen.start();
 * Fullscreeen.start(document.querySelector('main'));
 * 
 * Fullscreeen.exit();
 * 
 * Fullscreeen.toggle();
 * Fullscreeen.toggle(document.querySelector('main');
 * 
 */

module.exports = class FullScreen {

    /**
     * Find the right method, call on correct element
     * @param  {HTMLElement} elm [body as default]
     * @return {void}
     */
    static start(elm = window.document.documentElement) {
        let requestFullscreen = elm.requestFullscreen || elm.mozRequestFullScreen || elm.webkitRequestFullscreen || elm.msRequestFullscreen;
        requestFullscreen.call(elm);
    }

    /**
     * Exit fullscreen
     * @return {void}
     */
    static exit() {
        let exitFullscreen = document.exitFullscreen || document.mozCancelFullScreen || document.webkitExitFullscreen || document.msExitFullscreen;
        exitFullscreen.call(document);
    }

    /**
     * Toggle between this.start and this.exit
     * @param  {HTMLElement} elm [body]
     * @return {void}
     */
    static toggle(elm) {
        if (FullScreen.isFullScreen()) {
            FullScreen.exit();
        } else {
            FullScreen.start(elm || window.document.documentElement);
        }
    }

    /**
     * Check if app is in fullscreen
     */
    static isFullScreen() {
        return window.innerHeight == screen.height;
    }

}