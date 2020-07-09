const Controller = require('./Controller');
const Canvas = require('./Canvas');

const assets = {

}
const margins = 50;
const fontSize = 30;
module.exports = class Button extends Controller {

    constructor(text, x = 0, y = 0, w = 10, h = 10) {
        super(x, y, w, h);
        this.text = text;
        this.scale = 1;

        this.background = "#000";
        this.highlight = "#000";
        this.textColor = "#fff";
        this.highlightTextColor = "#f00";

        this.render();
    }

    static Factory(text, x, y, callback) {
        let width = 10;

        Canvas(0, 0, ctx => {
            ctx.font = (fontSize * this.scale) + "px arial";
            width = ctx.measureText(this.text).width;
        });

        const btn = new this(text, x, y, width + (margins * 2), 60);
        btn.click = callback;

        return btn;
    }

    render(highlight) {
        this.canvas = Canvas(this.w, this.h, (ctx, img) => {
            // background
            ctx.fillStyle = highlight ? this.highlight : this.background;
            ctx.fillRect(0, 0, this.w, this.h);

            // text
            ctx.fillStyle = highlight ? this.highlightTextColor : this.textColor;
            ctx.font = (fontSize * this.scale) + "px arial";
            ctx.textAlign = 'center';
            ctx.fillText(this.text, this.w / 2, this.h / 2 + (fontSize * this.scale / 2));
        });
    }

    hoverEnter(coords) {
        this.render(true);
    }

    hoverLeave(coords) {
        this.render();
    }

}