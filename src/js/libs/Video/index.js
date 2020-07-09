/**
 * Usage:
 * require('./libs/Video');
 * 
 */
const Captions = require('./Captions');
const Slider = require('./Slider');

let responsiveVideo = require('./ResponsiveVideo').Factory({
    attributesAllowed: ['muted', 'playsinline', 'loop', 'controls', 'data-cc', 'data-gui', 'crossorigin']
});

let captions = [];

responsiveVideo.on('load', e => {
    responsiveVideo.elements.forEach(ratio => {
        if (ratio.children[0].getAttribute('data-gui') == null) {
            // // Autoplay in viewport if viewportchecker is set on window.
            if (window.vp) {
                window.vp.add(ratio, (elm, options) => options.add ? elm.play() : elm.pause(), '0');
            }
            return;
        }
        // Autoplay in viewport if viewportchecker is set on window.
        if (window.vp) {
            window.vp.add(ratio, (elm, options) => options.add ? elm.play() : elm.pause(), '50%', {
                reverseOffset: true
            });
        }

        let figcaption = document.createElement('figcaption');
        ratio.parentNode.appendChild(figcaption);

        let nav = document.createElement('nav');
        nav.className = 'controls';
        ratio.parentNode.appendChild(nav);

        let rewind = document.createElement('a');
        rewind.className = 'rewind';
        nav.appendChild(rewind);

        let soundToggle = document.createElement('a');
        soundToggle.className = 'sound-toggle';
        nav.appendChild(soundToggle);


        let slider = new Slider();
        ratio.parentNode.appendChild(slider.getElm());
        ratio.ontimeupdate = e => {
            slider.max = ratio.duration();
            slider.setValue(ratio.currentTime(), false);

            if (slider.getPercent() > 95) {
                ratio.parentNode.classList.add('finished');
            } else {
                ratio.parentNode.classList.remove('finished');
            }
        }

        slider.on('change', e => {
            ratio.setTime(slider.value);
        });

        if (ratio.children[0].getAttribute('data-cc')) {
            // Add the TextTracks
            let cap = Captions.Factory({
                video: [...ratio.children],
                vtt: ratio.children[0].getAttribute('data-cc'),
                container: figcaption,
                srclang: 'no'
            });
            cap.forEach(c => captions.push(c));
        }


        soundToggle.addEventListener('click', e => {
            mute(!ratio.muted());
        });

        rewind.addEventListener('click', e => {
            ratio.setTime(0);
            ratio.parentNode.classList.remove('finished');
            captions.forEach(caption => {
                caption.empty();
            });
        });
    });
});


function mute(muted = true) {
    responsiveVideo.videos.forEach(video => {
        video.muted = muted;
    });
    responsiveVideo.elements.forEach(ratio => ratio.parentNode.classList[muted ? 'add' : 'remove']('muted'));
}
mute();

module.exports = responsiveVideo;