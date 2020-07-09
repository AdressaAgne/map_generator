const bboxCheck = (items, x, y) => {
    let clicked = null;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.inDeck && item.click && x > item.x && x < item.x + item.w && y > item.y && y < item.y + item.h) {

            if (clicked == null || (clicked._drawIndex || 0) < (item._drawIndex || 0)) {
                clicked = item;
            }
        }
    }

    if (clicked !== null) {
        clicked.click({
            x,
            y
        });
    }

}

let clickEvents = [];
window.addEventListener('click', e => {
    const x = e.pageX;
    const y = e.pageY;
    bboxCheck(clickEvents, x, y);
});
let hoverEvents = [];

window.addEventListener('mousemove', e => {
    const x = e.pageX;
    const y = e.pageY;
    for (let i = 0; i < hoverEvents.length; i++) {
        const item = hoverEvents[i];
        if (x > item.item.x && x < item.item.x + item.item.w && y > item.item.y && y < item.item.y + item.item.h) {
            if (!item._isMouseOver) {
                item._isMouseOver = true;
                item.enter({
                    x,
                    y,
                });
            }
        } else {
            if (item._isMouseOver == true) {
                item._isMouseOver = false;
                item.leave({
                    x,
                    y
                });
            }
        }
    }

});

const BasicController = require('./BasicController');
module.exports = class Controller extends BasicController {

    constructor(x, y, w, h) {
        super();

        this.w = w;
        this.h = h;
        this._firstLoop = true;
        this.setAltCoords({
            x,
            y
        });
        this.setCoords({
            x,
            y
        });

        clickEvents.push(this);

        if (this.hoverEnter && typeof this.hoverEnter == 'function' && this.hoverLeave && typeof this.hoverLeave == 'function') {
            hoverEvents.push({
                item: this,
                enter: this.hoverEnter.bind(this),
                leave: this.hoverLeave.bind(this)
            });
        }
    }

}