/**
 * Usage:
 * 
 * const ViewportChecker = {BAM, REVERSE} = require('./libs/events/ViewportChecker');
 * let vp = new ViewportChecker();
 * 
 * vp.add('selector', BAM)
 * vp.add('selector', REVERSE, 100,  {repeat : false})
 * vp.add('selector', BAM, '40%', {reverseOffset : true})
 * 
 * preload will only trigger once, and wil have the offset of scroll - 100% and scrollEnd + 100%;
 * vp.add('selector', BAM, 'prelaod', {singel : true})
 * vp.add('selector', (element, e) => {}, offsset, options)
 * 
 */
const Event = require('./Event');
const body = document.querySelector('body');
const html = document.querySelector('html');

module.exports = class ViewportChecker extends Event {

    constructor(options = {}) {
        super();

        this.debug = options.debug != undefined ? options.debug : false;

        this.last_start = null;
        this.elements = [];

        document.addEventListener('scroll', this.scroll.bind(this));
        document.addEventListener('load', this.scroll.bind(this));
    }

    setDebugLinePos(id, top) {
        document.querySelector(`#${id}.ViewportcheckerDebugDiv`).style.top = `${top}px`;
    }

    insertDebugLine(id, color = 'red', text) {
        let div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.zIndex = '10000';
        div.style.backgroundColor = color;
        div.style.height = '2px';
        div.style.width = '100vw';

        div.className = 'ViewportcheckerDebugDiv';
        div.setAttribute('id', id);
        div.innerHTML = `<span style="background-color: ${color};">${text}</span>`;

        document.querySelector('body').appendChild(div);
    }

    static Factory(debug = false) {
        return new ViewportChecker({
            debug
        });
    }

    setOptions(options) {
        this.options = options;
    }

    add(elm, callback, offset = 0, options = {}) {
        if (typeof elm == 'string') {
            elm = document.querySelectorAll(elm);
        }

        if (elm instanceof NodeList || elm instanceof Array) {
            elm.forEach(item => this.add(item, callback, offset, options));
            return;
        }

        this.elements.push({
            elm: elm,
            callback: callback || ViewportChecker.REVERSE,
            options: {},
            offset: offset,
            reverseOffset: options.reverseOffset || false,
            repeat: options.repeat !== undefined ? options.repeat : true,
            single: options.single !== undefined ? options.single : false,
            startOffset: options.startOffset !== undefined ? options.startOffset : offset,
            endOffset: options.endOffset !== undefined ? options.endOffset : offset,
        });

        if (this.debug) {
            let i = this.elements.length - 1;
            let l = parseInt(i * 72) % 360;

            this.insertDebugLine('elmStart' + (i), `hsl(${l}, 100%, 50%)`, 'elmStart: ' + i);
            this.insertDebugLine('elmEnd' + (i), `hsl(${l}, 100%, 50%)`, 'elmEnd: ' + i);
            this.insertDebugLine('elmInn' + (i), `hsl(${l}, 100%, 90%)`, 'less then bottom: ' + i);
            this.insertDebugLine('elmOut' + (i), `hsl(${l}, 100%, 90%)`, 'more then top: ' + i);
        }

        this.scroll.bind(this)();
    }

    offsetCalc(offset) {
        let height = window.innerHeight;
        return typeof offset === 'string' && offset.indexOf('%') > 0 ? (parseInt(offset) / 100) * height : offset == 'preload' ? 'preload' : parseInt(offset);
    }

    scroll(e) {
        let last_start = this.last_start || 0;
        let height = window.innerHeight;
        let start = Math.max(body.scrollTop, html.scrollTop, (window.scrollTop || 0));
        let end = start + height;

        for (let index = 0; index < this.elements.length; index++) {
            const item = this.elements[index];
            /**
             * Repeat
             */
            item.options.repeated = item.options.repeated || false;

            if (!item.repeat && item.options.repeated) {
                return;
            }

            /**
             * Calculate values
             */

            var boundingBox = item.elm.getBoundingClientRect();
            let elmStart = Math.round(boundingBox.top + start);

            let startOffset = this.offsetCalc(item.startOffset);
            let endOffset = this.offsetCalc(item.endOffset);

            let preload = false;

            if (startOffset == 'preload') {
                preload = true;
                startOffset = 0;
                endOffset = 0;
            }

            let elmHeight = boundingBox.height;
            let elmEnd = elmStart + elmHeight;
            let orgEnd = elmEnd;
            let dir = start > last_start ? 'down' : 'up';
            let action;

            if (this.debug) {
                this.setDebugLinePos('elmStart' + index, elmStart);
                this.setDebugLinePos('elmEnd' + index, elmEnd);
            }

            /**
             * reverseOffset
             */
            if (item.reverseOffset) {
                elmEnd -= (endOffset * 2);
            }


            if (this.debug) {
                this.setDebugLinePos('elmInn' + index, elmStart + startOffset);
                this.setDebugLinePos('elmOut' + index, elmEnd + endOffset);
            }

            item.options.inside = item.options.inside || false;

            let rep = item.options.repeated;
            if ((elmStart + startOffset) < (end + (preload ? height : 0)) && (elmEnd + endOffset) > (start - (preload ? height : 0))) {
                
                if(preload) {
                    this.elements.splice(index, 1);
                }

                action = 'add';
                item.options.repeated = true;
            } else {
                action = 'remove';
            }
            let currentIsAdd = action == 'add';
            let lastWasAdd = item.options.inside;

            let single = (item.single ? (lastWasAdd != currentIsAdd) : true);

            if (item.callback && typeof item.callback === 'function' && single) {
                item.callback(item.elm, {
                    'action': action,
                    'direction': dir,
                    'add': action == 'add',
                    'remove': action == 'remove',
                    'down': dir == 'down',
                    'up': dir == 'up',
                    'index': index,
                    'repeated': rep,
                    'data': {
                        start: elmHeight,
                        end: orgEnd
                    }
                });
            }

            item.options.inside = action == 'add';

        };
        this.last_start = start;
    }

    static isInViewport(node, offset = 0) {
        const rect = node.getBoundingClientRect();
        const h = ((window.innerHeight || document.documentElement.clientHeight));
        const w = ((window.innerWidth || document.documentElement.clientWidth));

        let value = (
            (rect.height > 0 || rect.width > 0) &&
            rect.right >= 0 &&
            rect.left <= w &&
            rect.bottom + offset <= h + rect.height &&
            rect.top >= -rect.height
        );

        return value;
    }

    /**
     * Default functions
     */
    static BAM(element, e) {
        element.classList[e.add ? 'add' : 'remove']('bam');
    }

    static REVERSE(element, e) {
        element.classList[e.add ? 'add' : 'remove']('bam');
        element.classList[e.remove ? 'add' : 'remove']('reverse-bam');
    }

    static INDEX(selector) {
        return (elm, e) => {
            if (e.add) {
                document.querySelector(selector).setAttribute('data-index', `index-${e.index}`);
            }
        }
    }

}