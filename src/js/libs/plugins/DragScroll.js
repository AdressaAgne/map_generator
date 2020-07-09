module.exports = class DragScroll {
    constructor(node, options = {
        left: true,
        top: false
    }) {
        this.node = node;
        this.start_e = null;
        this.current_e = null;
        this.options = options;
        this.node.addEventListener('mousedown', this.down.bind(this));
        document.addEventListener('mouseup', this.up.bind(this));
        document.addEventListener('mousemove', this.move.bind(this));
    }

    down(e) {
        this.start_e = e;
        this.node.style['scroll-snap-type'] = 'none';
        this.node.style['-webkit-scroll-snap-type'] = 'none';
    }

    up(e) {
        this.node.removeAttribute('style');
        this.node.style['scroll-snap-type'] = 'x mandatory';
        this.node.style['-webkit-scroll-snap-type'] = 'x mandatory';
        this.start_e = null;
    }

    move(e) {
        if (this.start_e == null) return;
        if (this.options.left) this.scrollHorizontal(e, this.start_e);
        if (this.options.top) this.scrollVertical(e, this.start_e);
        this.start_e = e;
    }


    scrollVertical(a, b) {
        let diff = a.pageY - b.pageY;
        let top = this.node.scrollTop;
        this.node.scrollTop -= diff;
    }

    scrollHorizontal(a, b) {
        let diff = a.pageX - b.pageX;
        let left = this.node.scrollLeft;
        this.node.scrollLeft -= diff;
    }

}