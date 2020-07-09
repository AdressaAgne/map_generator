/**
 * Usage:
 * 
 * let responsiveVideo = require('./ResponsiveVideo').Factory();
 * 
 */
const Orientation = require('../events/Orientation');
const _debounce = require('../functions/Debounce');
const log = console.log;

let defaults = {

    directionParam: '{dir}',
    orientations: {
        portrait: '-tall',
        landscape: '-wide'
    },

    sizeParam: '{size}',
    videoSizeAttr: 'data-size',
    sizes: {
        small: '-small',
        big: '-big',
    },

    containerName: 'ratio',
    activeElementClass: 'active',
    videoPlaceholderAttr: 'data-src',
    videoOrientaionAttr: 'data-orientation',
    attributesAllowed: ['muted', 'playsinline', 'loop', 'controls', 'crossorigin'],
    attributesActive: ['controls'],

    // Func == true Small else Big
    resizeAttributeFunc: width => width >= 640,
    resizeAttributeSmallClass: 'data-ratio-small',
    resizeAttributeSmallDefault: '',
    resizeAttributeBigClass: 'data-ratio-big',
    resizeAttributeBigDefault: '',
}

module.exports = class ResponsiveVideo extends Orientation {

    constructor(selector = 'div[data-video-src]', options = {}) {
        super();

        this.defaults = Object.assign(defaults, options);
        this.videos = [];
        this.elements = [];
        this.middleware = [];

        this.size = this.currentSize();

        document.querySelectorAll(selector).forEach(video => {
            this.elements.push(this.replace(video));
        });

        this.orientationChange();
        this.resizeChange();

        this.on('change', this.orientationChange.bind(this));
        window.addEventListener('resize', _debounce(this.resizeChange.bind(this), 100));
    }

    /**
     * 
     * @param {function} middleware 
     */
    static Factory(selector = 'video[data-src]', options = {}) {

        if (typeof selector == 'object') {
            options = selector;
            selector = 'video[data-src]';
        }

        let rv = new ResponsiveVideo(selector, options);


        return rv;
    }

    /**
     * on window resize
     * @param {Event} e 
     */
    resizeChange(e) {
        this.elements.forEach(video => {

            let small = video.resizeAttributeSmallClass !== null ? video.resizeAttributeSmallClass : this.defaults.resizeAttributeSmallDefault;
            let big = video.resizeAttributeBigClass !== null ? video.resizeAttributeBigClass : this.defaults.resizeAttributeBigDefault;

            let check = this.defaults.resizeAttributeFunc(window.innerWidth);

            if (big !== "" && small !== "") {
                video.classList.remove(check ? small : big);
                video.classList.add(!check ? small : big);
            }

            if (video.hasSize && video.size !== this.currentSize()) {
                video.size = this.currentSize();
                this.emit('size', {
                    size: this.currentSize(),
                    element: video
                });
                this.swapSize(video, this.currentSize());
            }
        });
    }


    /**
     * On Orientation change Event
     */
    orientationChange() {
        this.elements.forEach(video => {
            if (video.hasOrientation) {
                this.emit('dir', {
                    orientation: this.orientation,
                    element: video
                });
                this.swapOrientation(video, this.currentOrientation());
            }
        });
    }

    /**
     * Bring a video to the front
     * @param {HTMLVideoElement} video
     */
    bringToFront(video) {
        [...video.parentNode.children].forEach(child => {
            child.style.opacity = 0;
        });
        video.style.opacity = 1;
    }

    /**
     * Swap videos to play what correspends to the current Orientation
     * @param {video container} element 
     * @param {callbackfunc} compare(video) 
     */
    swapOrientation(element, orientation) {
        // console.log('swapOrientation');
        this.swap(element, video => video.getAttribute(this.defaults.videoOrientaionAttr) == orientation);
    }

    /**
     * Swap videos to play what correspends to the current size
     * @param {video container} element 
     * @param {callbackfunc} compare(video) 
     */
    swapSize(element, size) {
        this.swap(element, video => video.getAttribute(this.defaults.videoSizeAttr) == size);
    }

    /**
     * swap a video with the current active.
     * @param {video container} element 
     * @param {callbackfunc} compare(video) 
     */
    swap(element, compare) {
        const videos = element.querySelectorAll('video');
        const active = element.querySelector(`.${this.defaults.activeElementClass}`) || videos[0];
        let isPlaying = !active.paused;

        videos.forEach(video => {
            if (compare(video)) {
                video.classList.add(this.defaults.activeElementClass);
                video.currentTime = active.currentTime;

                if (isPlaying) {
                    let promise = video.play();
                }

                this.bringToFront(video);
            } else {
                video.pause();
                video.classList.remove(this.defaults.activeElementClass);
            }
        });
    }


    /**
     * Get the current page orientation name
     */
    currentOrientation() {
        return this.defaults.orientations[this.orientation];
    }

    /**
     * Get the current size
     */
    currentSize() {
        return window.innerWidth <= 640 ? this.defaults.sizes.small : this.defaults.sizes.big;
    }

    /**
     * change the video source
     * @param {Video Source} str
     */
    changeVideoSource(str, dir = null, param) {
        return str.replace(param, dir ? dir : this.currentOrientation());
    }

    /**
     * replace the DOM element with Videor element
     * @param {HTMLElement} elm
     */
    replace(elm) {
        const div = this.createPlaceholderElement(elm);
        elm.parentNode.replaceChild(div, elm);

        elm.newElement = div;

        return div;
    }
    /**
     * Get Allowed attributes
     */
    getAllowedAttributes(element, check = this.defaults.attributesAllowed) {
        return Object.keys(element.attributes).map(key => {
            const attr = element.attributes[key].name;
            const value = element.attributes[key].value;
            if (check.indexOf(attr) > -1) {
                return {
                    key: attr,
                    value
                };
            }
            return false;
        }).filter(attr => attr !== false);
    }

    createVideo(source, value, param, attr, attrs, attrsActive, compare) {
        const video = document.createElement('video');
        video.src = this.changeVideoSource(source, value, param);
        video.setAttribute(attr, value);
        /**
         * Set the allowed attributes
         */
        attrs.forEach(item => video.setAttribute(item.key, item.value == undefined ? item.key : item.value));
        if (video.getAttribute('muted') == 'muted') {
            video.muted = true;
        }
        video.style.opacity = 0;
        /**
         * Add active class if its the current orientation
         */
        if (this[compare]() == value) {
            video.className = this.defaults.activeElementClass;
            attrsActive.forEach(attr => video.setAttribute(attr, attr));
            video.currentTime = 0;
            //video.play();
            video.style.opacity = 1;
        }

        /**
         * Append to container
         */
        return video
    }

    /**
     * Create a placeholder element for the videoContainer
     * @param {HTMLElement} originalElement
     */
    createPlaceholderElement(originalElement) {
        let div = document.createElement('div');
        div.className = `${this.defaults.containerName} ${originalElement.className}`.trim();

        div.resizeAttributeBigClass = originalElement.getAttribute(this.defaults.resizeAttributeBigClass);
        div.resizeAttributeSmallClass = originalElement.getAttribute(this.defaults.resizeAttributeSmallClass);

        const source = originalElement.getAttribute(this.defaults.videoPlaceholderAttr);
        const attrs = this.getAllowedAttributes(originalElement);
        const attrsActive = this.getAllowedAttributes(originalElement, this.defaults.attributesActive);

        if (source == null) {
            console.error(`[${this.defaults.videoPlaceholderAttr}] can not be null`);
        }

        //log(source);

        // Add video based on Orientation
        if (source.indexOf(this.defaults.directionParam) > -1) {

            div.hasOrientation = true;

            Object.keys(this.defaults.orientations).forEach(orientation => {
                /**
                 * Append to container
                 */
                let video = this.createVideo(source, this.defaults.orientations[orientation], this.defaults.directionParam, this.defaults.videoOrientaionAttr, attrs, attrsActive, 'currentOrientation');
                div.appendChild(video);
                this.videos.push(video);
            });
        }

        // Add video based on size

        if (source.indexOf(this.defaults.sizeParam) > -1) {

            div.hasSize = true;

            Object.keys(this.defaults.sizes).forEach(size => {
                /**
                 * Append to container
                 */
                let video = this.createVideo(source, this.defaults.sizes[size], this.defaults.sizeParam, this.defaults.videoSizeAttr, attrs, attrsActive, 'currentSize');
                div.appendChild(video);
                this.videos.push(video);
            });
        }


        div.muted = function () {
            return this.querySelector('video.active').muted;
        }

        div.duration = function () {
            return this.querySelector('video.active').duration;
        }

        div.currentTime = function () {
            return this.querySelector('video.active').currentTime;
        }

        div.play = function () {
            this.querySelector('video.active').play();
        }

        div.pause = function () {
            this.querySelector('video.active').pause();
        }

        div.setTime = function (float) {
            div.querySelectorAll('video').forEach(video => {
                video.currentTime = float;
            });
        }

        div.load = function() {
            div.querySelectorAll('video').forEach(video => {
                video.load();
            });
        }

        div.abort = function() {
            div.querySelectorAll('video').forEach(video => {
                video.preload = 'none';

                let s = video.src;
                let t = video.currentTime;

                video.pause();
                video.src = '';
                video.load();

                video.src = s;
                video.currentTime = t;
            });
        }

        div.querySelectorAll('video').forEach(video => {
            video.ontimeupdate = e => {
                if (typeof div.ontimeupdate == 'function') {
                    div.ontimeupdate(e);
                }
            }
        });

        return div;
    }

}