const Animation = require('../functions/RequestAnimationFrame');
const Event = require('../events/Event');

module.exports = class VideoFilter extends Event {

    constructor(video, canvas) {
        super();

        this.src = video;
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.canvas.width = this.w = 512;
        this.canvas.height = this.h = 512 * 0.5625;

        this.createVideo();

        this.range = {
            max: {
                r: 255,
                g: 255,
                b: 255
            },
            min: {
                r: 0,
                g: 200,
                b: 0
            }
        };
        this.rangeRange = [];

        this.other = {};

        this.canvas.addEventListener('click', e => {

            let x = e.offsetX;
            let y = e.offsetY;

            let imgData = this.ctx.getImageData(x, y, 1, 1);

            let r = imgData.data[0];
            let g = imgData.data[1];
            let b = imgData.data[2];

            let diff = this.other.click || 0;

            this.range.max.r = r + diff > 255 ? 255 : r + diff;
            this.range.max.g = g + diff > 255 ? 255 : g + diff;
            this.range.max.b = b + diff > 255 ? 255 : b + diff;

            this.range.min.r = r - diff < 0 ? 0 : r - diff;
            this.range.min.g = g - diff < 0 ? 0 : g - diff;
            this.range.min.b = b - diff < 0 ? 0 : b - diff;

            document.querySelectorAll('#min input[type=range], #max input[type=range]').forEach(input => {
                const id = input.getAttribute('id');
                const dir = input.parentNode.parentNode.getAttribute('id');
                input.value = this.range[dir][id];
                out.innerText = JSON.stringify(this.range);
            });
        });

        let out = document.querySelector('#out');
        let outother = document.querySelector('#outother');
        document.querySelectorAll('#min input[type=range], #max input[type=range]').forEach(input => {
            const id = input.getAttribute('id');
            const dir = input.parentNode.parentNode.getAttribute('id');
            this.range[dir][id] = +input.value;

            input.addEventListener('input', e => {
                this.range[dir][id] = +input.value;
                out.innerText = JSON.stringify(this.range);
            });
        });

        document.querySelectorAll('#other input[type=range]').forEach(input => {
            const id = input.getAttribute('id');
            this.other[id] = +input.value;

            input.addEventListener('input', e => {
                this.other[id] = +input.value;

                outother.innerText = JSON.stringify(this.other);
            });
        });

        let btn = document.querySelector('#add');
        btn.addEventListener('click', e => {
            this.rangeRange.push(JSON.parse(JSON.stringify(this.range)));
            console.log(this.rangeRange, this.range);
        })



    }

    createVideo() {
        let video = document.createElement('video');
        video.src = this.src;
        video.muted = true;
        video.load();
        video.currentTime = 0;
        let btn2 = document.querySelector('#pause');
        let pause = false;
        video.loop = true;
        btn2.addEventListener('click', e => {
            if (!video.paused) {
                video.pause();
            } else {
                video.play();
            }
        })
        video.onload = e => {
            video.play();
        }

        video.ontimeupdate = e => {

        }
        //video.style.display = 'none';
        //document.querySelector('body').appendChild(video);
        console.log(this.ctx.getImageData(0, 0, this.w, this.h));

        let anim = new Animation();
        anim.start(e => {
            this.ctx.drawImage(video, 0, 0, this.w, this.h);
            
            let imgData = this.ctx.getImageData(0, 0, this.w, this.h);
            
            let chroma = [];
            for (let i = 0; i < imgData.data.length; i += 4) {
                // Alpha
                let g = imgData.data[i + 1];
                let r = imgData.data[i];
                let b = imgData.data[i + 2];

                if (chromaKeyCheck(r, g, b, this.range)) {
                    imgData.data[i + 3] = 0;
                    chroma.push(i + 3);
                }

                for (let j = 0; j < this.rangeRange.length; j++) {
                    let range = this.rangeRange[j];
                    if (chromaKeyCheck(r, g, b, range)) {
                        imgData.data[i + 3] = 0;
                        chroma.push(i + 3);
                        let size = this.other.feather;
                        for (let x = -size; x < size; x++) {
                            for (let y = -size; y < size; y++) {
                                let j = i + 3 + (x * 4) + (y * this.w * 4);
                                imgData.data[j] = imgData.data[j] - this.other.strength < 0 ? 0 : imgData.data[j] - this.other.strength;
                            }
                        }
                    }
                }
            }
            // feather
            for (let l = 0; l < chroma.length; l += 2) {
                let i = chroma[l];

                let edges = 0;
                let all = [i - 4, i + 4, i - (this.w * 4), i + (this.w * 4)];
                for (let k = 0; k < all.length; k++) {
                    let a = all[k];
                    if (a >= 0 && a < imgData.data.length && imgData.data[a] == 0) {
                        edges++;
                    }
                }

                if (edges > 0) {
                    let size = this.other.feather;
                    for (let x = -size; x < size; x++) {
                        for (let y = -size; y < size; y++) {
                            let j = i + (x * 4) + (y * this.w * 4);
                            if (j >= 0 && j < imgData.data.length) {
                                imgData.data[j] = imgData.data[j] - this.other.strength < 0 ? 0 : imgData.data[j] - this.other.strength;
                            }
                        }
                    }
                }
            }
            this.ctx.putImageData(imgData, 0, 0);

        });

        function chromaKeyCheck(r, g, b, range) {
            return (g >= range.min.g &&
                g <= range.max.g &&

                r >= range.min.r &&
                r <= range.max.r &&

                b >= range.min.b &&
                b <= range.max.b)
        }
    }


    static Factory(...args) {
        return new VideoFilter(...args);
    }

}