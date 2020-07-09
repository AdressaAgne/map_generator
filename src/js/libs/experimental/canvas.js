const log = console.log;
class Toolbox {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    onUpdate(callback) {
        this.update = callback;
    }

    setStyle(ctx, style) {
        ctx.fillStyle = style.color || 'black';
    }
}

class Pen extends Toolbox {
    constructor(color = 'red', x = 0, y = 0, w = 10, h = 10) {
        super(x, y);
        this.w = w;
        this.h = h;
        this.tick = 0;
        this.ticks = 0;
        this.style = {
            color
        };
    }

    draw(ctx, w, h) {
        if (this.update !== undefined && ++this.ticks >= this.tick) {
            this.ticks = 0;
            this.update(w, h);
        }

        this.setStyle(ctx, this.style);
        ctx.fillRect(this.x, this.y, this.w, this.h);
    }
}

class Paper {

    constructor(canvas) {
        this.canvas = canvas || document.createElement('canvas');
        this.canvas.width = parseInt(this.canvas.style.width) || 128;
        this.canvas.height = parseInt(this.canvas.style.height) || 128;
        this.context = this.canvas.getContext('2d');
    }

    img(img, x, y, w, h) {
        this.context.drawImage(img, x, y, w, h);
    }

    getPaper() {
        return this.canvas;
    }

}


class Book extends Paper {

    constructor(canvas) {
        super(canvas);
        this.elements = [];
    }


    update() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let i = 0; i < this.elements.length; i++) {
            const item = this.elements[i];
            item.draw(this.context, this.canvas.width, this.canvas.height);
        }
    }

    /**
     * returns the id
     * @param {Pen} item 
     */
    add(item) {
        this.elements.push(item);
        return this.elements.length - 1;
    }

    remove(id) {
        this.elements.slice(id, 1);
    }

}

const c = require('../Color');
const Loop = require('../functions/RequestAnimationFrame');
module.exports = class FlipBook extends Book {

    constructor(canvas) {
        super(canvas);

        this.loop = new Loop();
        this.loop.start(this.update.bind(this));

        let zoom = 1;
        let tiles = 64;
        let tile = this.canvas.width / tiles;
        let colors = Object.values(c);

        for (let x = 0; x < tiles - 1; x++) {
            for (let y = 0; y < tiles - 1; y++) {
                let id = Math.abs((x % colors.length) - (y % colors.length));
                let item = new Pen(colors[id], x * tile * zoom, y * tile * zoom, tile * zoom, tile * zoom);

                item.tick = 2;
                item.data = {};
                item.data.id = id;

                item.onUpdate(function() {
                    item.style.color = colors[item.data.id > colors.length -1 ? (item.data.id = 0) : ++item.data.id];
                });

                this.add(item);
            }
        }

    }

}