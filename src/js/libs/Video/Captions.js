let id = 0;

module.exports = class Captons {

    constructor(options) {
        this.video = options.video;
        this.vtt = options.vtt;
        this.container = options.container;
        this.hidden = false;

        // Track
        this.track = document.createElement('track');
        this.track.id = `track-${++id}`;
        this.track.kind = options.kind;
        this.track.label = "Tekst";
        this.track.src = this.vtt;
        this.track.default = true;
        this.track.srclang = options.srclang;

        this.video.appendChild(this.track);

        let TextTrack = this.video.textTracks[0];
        TextTrack.mode = 'hidden';
        TextTrack.oncuechange = e => {
            for (let i = 0; i < TextTrack.activeCues.length; i++) {
                const cue = TextTrack.activeCues[i];
                this.empty();
                this.draw(cue);
            }
        };
    }

    empty() {
        this.container.innerHTML = '';
    }


    draw(cue) {
        if (this.hidden) return;

        let span = document.createElement('span');
        span.setAttribute('data-caption', cue.text);
        //span.innerHTML = `<span>${cue.text}</span>`;

        this.container.appendChild(span);
    }

    static Factory(options) {
        if (options.video instanceof Array) {
            let caps = [];
            options.video.forEach(video => {
                caps.push(new Captons({
                    video: video,
                    vtt: options.vtt,
                    container: options.container,
                    kind: options.kind || 'captions',
                    srclang : options.srclang
                }));
            });
            return caps;
        }

        return new Captons(options);
    }

}