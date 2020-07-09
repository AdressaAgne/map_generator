const Slider = require('./Slider');
const Orientation = require('../events/Orientation');

module.exports = class Player extends Orientation {

    constructor(target, options) {
        super();

        if (document.querySelectorAll('video[orientation]').length > 0) return;

        if (target == document) target = (document.querySelector('main'));
        this.target = target;
        this.options = options;
        this.node = this.generateVideo(this.orientation == 'landscape' ? this.options.wide : this.options.tall);
        this.mode = [];

        this.node.load();
        this.timeout = null;
        this.container = document.createElement('div');
        this.container.className = 'video-container';
        this.generateContainer(this.container, this.node);
        this.container.appendChild(this.node);
        this.addMode('controls');
        target.setAttribute('orientation', this.orientation);

        this.node.addEventListener('seeked', () => {
            if(this.node.currentTime >= this.node.duration) return;
            this.removeData('blur');
            this.node.play()
        });

        this.node.addEventListener('waiting', () => {
            this.setData('blur');
        });

        this.node.addEventListener('canplaythrough', () => {
            this.node.play();
        });

        this.node.addEventListener('timeupdate', () => {
            this.time = this.node.currentTime;
            this.slider.setValue(this.time, false);
            if(this.node.currentTime >= this.node.duration && !this.sliding) {
                this.fireEvent('end', this);
                this.container.remove();
            }
        });

        this.slider.on('start', () => {
            this.sliding = true;
        });

        this.slider.on('end', () => {
            this.sliding = false;
        });

        this.slider.on('change', slider => {
            this.node.currentTime = slider.value;
        });

        this.node.addEventListener('playing', () => {
            this.setData('playing', 'true');
        });
        this.node.addEventListener('pause', () => {
            this.setData('playing', 'false');
        });

        this.on('landscape', this.landscape);
        this.on('portrait', this.portrait);

        target.appendChild(this.container);

        this.container.addEventListener('touch', this.resetTimeout.bind(this));
        this.container.addEventListener('click', this.resetTimeout.bind(this));
        this.container.addEventListener('mousemove', this.resetTimeout.bind(this));
        this.container.addEventListener('keypress', this.resetTimeout.bind(this));
        this.container.addEventListener('mouseenter', this.resetTimeout.bind(this));
        this.container.addEventListener('touchmove', this.resetTimeout.bind(this));

    }

    setData(key, value = '') {
        this.target.setAttribute('data-'+key, value);
    }

    removeData(key) {
        this.target.removeAttribute('data-'+key);
    }

    hasData(key, value) {
        return this.target.getAttribute('data-'+key) == value;
    }

    addMode(mode) {
        let i = this.mode.indexOf(mode);
        if(i > -1) return;
        this.mode.push(mode);
        this.target.setAttribute('data-gui', this.mode.join(' '));
    }

    removeMode(mode) {
        let i = this.mode.indexOf(mode);
        if(i < 0) return;
        this.mode = this.mode.slice(i, 0);
        this.target.setAttribute('data-gui', this.mode.join(' '));
    }

    hasMode(mode) {
        return this.mode.indexOf(mode) > -1;
    }

    resetTimeout() {
        this.addMode('controls');
        clearTimeout(this.timeout);
        this.timeout = null;
        this.timeout = setTimeout(() => {
            if(this.hasData('playing', 'true')) this.removeMode('controls');
        }, 1000);
    }

    update() {
        this.node.currentTime = this.time;
        this.setData('orientation', this.orientation);
        this.setData('blur');
    }

    landscape() {
        this.node.src = this.options.wide;
        this.update();
    }

    portrait() {
        this.node.src = this.options.tall;
        this.update();
    }
    
    pause() {
        this.node.paused ? this.node.play() : this.node.pause();
    }

    sound() {
        this.node.volume = this.node.volume == 0 ? 1 : 0;
        this.node.volume == 0 ? this.setData('sound', 'true') : this.setData('sound', 'false');
    }

    generateContainer(container, node) {
        let captions = document.createElement('div');
        captions.className = 'captions';
        container.appendChild(captions)


        let controls = document.createElement('nav');
        controls.className = 'controls';

        let captionSound = document.createElement('a');
        captionSound.className = 'caption-sound';
        controls.appendChild(captionSound);
        captionSound.addEventListener('click', () => {
            this.sound();
        });

        let playPause = document.createElement('a');
        playPause.className = 'play-pause';
        controls.appendChild(playPause);
        playPause.addEventListener('click', () => {
            this.pause();
        });

        let close = document.createElement('a');
        close.className = 'close';
        close.innerHTML = '<span>Lukk</span>';
        controls.appendChild(close);
        close.addEventListener('click', () => {
            this.fireEvent('end', this);
                this.container.remove();
        });
        
        this.slider = new Slider(null, 0, 0, node.duration);
        node.addEventListener('loadedmetadata', e => {
            this.slider.max = node.duration;
            controls.appendChild(this.slider.get());
            container.appendChild(controls);
        });
        

        let buffer = document.createElement('div');
        buffer.className = 'buffer';
        buffer.innerHTML = '<span></span><span></span><span></span>';

        container.appendChild(buffer);
        
        let soundToast = document.createElement('span');
        soundToast.className = 'toast-sound';
        soundToast.innerText = 'Her kan du skru';

        container.appendChild(soundToast);
    }

    generateVideo(src, t = null) {
        let videoElm = document.createElement('video');
        videoElm.src = src;
        videoElm.setAttribute('playsinline', 'playsinline');
        videoElm.setAttribute('autoplay', 'autoplay');
        videoElm.volume = 0;

        if (t !== null) {
            let track = document.createElement('track');
            track.src = t;
            track.setAttribute('king', 'captions');
            track.setAttribute('srclang', 'no');
            track.setAttribute('label', 'Norsk tekst');
            track.setAttribute('mode', 'hidden');
            video.appendChild(track)
        }
        return videoElm;
    }

    static fullScreen(params) {
        return new Player(document, params);
    }
}