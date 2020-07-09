const Event = require('../Event');
const log = console.log;
const dataset = '_draggableData';

const defaults = {
    speed: 180,
}


module.exports = class DraggableList extends Event {

    constructor(ul) {
        super();

        this.down = null;
        this.ul = ul;
        this.order = [];

        /**
         * Set child id's
         */
        for (let i = 0; i < this.ul.children.length; i++) {
            const li = this.ul.children[i];
            li[dataset] = {
                id: i
            };
        }

        // Mouse
        ul.addEventListener('mousedown', this.mouseDown.bind(this));
        window.addEventListener('mousemove', this.mouseMove.bind(this));
        window.addEventListener('mouseup', this.mouseUp.bind(this));

        // Touch
        ul.addEventListener('touchstart', this.touchStart.bind(this));
        window.addEventListener('touchmove', this.touchMove.bind(this));
        window.addEventListener('touchend', this.touchEnd.bind(this));
    }

    /**
     * Check if the target is valid
     * @param {Event} e 
     */
    targetCheck(e) {
        return e.target == null || e.target.nodeName != 'LI'
    }

    /*********************
     * Mouse Events
     *********************/

    mouseDown(e) {
        if (this.targetCheck(e)) return;
        this.down = e;
        this.start(e.pageX, e.pageY, e);
    }
    mouseMove(e) {
        if (this.down == null) return;
        this.dragging(e.pageX, e.pageY, e);
    }
    mouseUp(e) {
        if (this.down == null) return;
        this.end(e.pageX, e.pageY, e);
    }

    /*********************
     * Touch Events
     *********************/
    touchStart(e) {
        if (this.targetCheck(e)) return;
        this.down = e;
        this.start(e.touches[0].pageX, e.touches[0].pageY, e);
    }
    touchMove(e) {
        if (this.down == null) return;
        this.dragging(e.touches[0].pageX, e.touches[0].pageY, e);
    }
    touchEnd(e) {
        if (this.down == null) return;
        this.end(e.touches[0].pageX, e.touches[0].pageY, e);
    }

    /**********************
     * Other events
     **********************/
    start(x, y, e) {
        this.setTransitions(e.target);
        this.order = this.getCurrentRealOrderString();
        this.fireEvent('start', x, y, this);
    }

    dragging(x, y, e) {
        this.fireEvent('dragging', x, y, this);

        this.setFakeOrder();

        // Move target
        const elm = this.down.target;
        const diffY = -(this.down.pageY - y);
        elm.style.setProperty('transform', `translateY(${diffY}px)`);

        // Make space for target
        //log(this.getCurrentFakeOrder());
    }

    end(x, y, e) {
        this.fireEvent('end', x, y, this);
        this.setTransitions();

        this.setRealOrder();
        this.resetAllTransforms();

        let target = this.down.target;
        
        if (this.order !== this.getCurrentRealOrderString()) {
            this.setTragetTransform(target);
            this.fireEvent('changed', this.ul.querySelectorAll('li'));
        }

        // We are done with the dragging, remove from memory
        this.down = null;
        this.order = [];
    }

    setTragetTransform(target) {
        let index = [...target.parentNode.children].indexOf(target);
        let id = target[dataset].id;
        let oldIndex = JSON.parse(this.order).indexOf(id);
        let h = target.offsetHeight;

        console.log(index, oldIndex, h, [target]);
    }


    setTransitions(target) {
        let lis = this.ul.children;
        for (let i = 0; i < lis.length; i++) {
            const li = lis[i];
            let remove = target && li == target;
            li.style[remove ? 'removeProperty' : 'setProperty']('transition', remove ? null : `transform ${defaults.speed}ms ease`);
        }
    }

    /*********************
     * Rearrange Methods
     *********************/

    /**
     * Get the order based on node possision
     */
    getCurrentRealOrder() {
        return [...this.ul.querySelectorAll('li')].map(li => li[dataset].id);
    }

    /**
     * Get the string version of the current real order, used to compare
     */
    getCurrentRealOrderString() {
        return JSON.stringify(this.getCurrentRealOrder());
    }

    /**
     * Get the order based on transforms
     */

    getCurrentFakeOrder() {
        return [...this.ul.querySelectorAll('li')].sort((a, b) => {
            let a1 = this.getOffset(a).y + this.getTransformValues(a).y;
            let b1 = this.getOffset(b).y + this.getTransformValues(b).y;
            return a1 - b1;
        });
    }

    /**
     * get the current fake order, used to compare
     */
    getCurrentFakeOrderString() {
        return JSON.stringify(this.getCurrentFakeOrder().map(li => li[dataset].id));
    }

    /**
     * Rearrange the list based on the fake order
     */
    setRealOrder() {
        const lis = this.getCurrentFakeOrder();
        for (let i = 0; i < lis.length; i++) {
            const li = lis[i];
            this.ul.appendChild(li);
        }

        return lis;
    }

    /**
     * Make it look like you change the list on drag
     */
    setFakeOrder() {
        const lis = this.getCurrentFakeOrder();
        const realLis = [...this.ul.querySelectorAll('li')];

        for (let i = 0; i < realLis.length; i++) {
            const li = realLis[i];
            const index = lis.indexOf(li);
            let offset = (index - i) * li.offsetHeight;
            li.style.setProperty('transform', `translateY(${offset}px)`);
        }
    }

    resetAllTransforms() {
        let lis = [...this.ul.querySelectorAll('li')];
        for (let i = 0; i < lis.length; i++) {
            const li = lis[i];
            if(li !== this.down.target) li.style.setProperty('transform', `translateY(0px)`)
        }

    }

    /*********************
     * Helpers Methods
     *********************/

    getTransformValues(elm) {
        let style = getComputedStyle(elm);
        let matrix = style.getPropertyValue("-webkit-transform") ||
            style.getPropertyValue("-moz-transform") ||
            style.getPropertyValue("-ms-transform") ||
            style.getPropertyValue("-o-transform") ||
            style.getPropertyValue("transform");

        if (!matrix || matrix == 'none') {
            return {
                x: 0,
                y: 0
            };
        }

        let values = matrix.split('(')[1];
        values = values.split(')')[0];
        values = values.split(',');

        values = values.map(i => parseFloat(i));

        return {
            x: values[4],
            y: values[5]
        };
    }

    /**
     * get the element offset
     * @param {HTMLElement} el 
     */
    getOffset(el) {
        var _x = 0;
        var _y = 0;
        while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
            _x += el.offsetLeft - el.scrollLeft;
            _y += el.offsetTop - el.scrollTop;
            el = el.offsetParent;
        }
        return {
            y: _y,
            x: _x
        };
    }

}