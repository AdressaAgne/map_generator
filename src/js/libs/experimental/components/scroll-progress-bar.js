const log = console.log;

class Progress extends HTMLElement {

    static get observedAttributes() {
        return ['for'];
    }

    constructor() {
        super();
        let _this = this;

        let shadow = this.attachShadow({
            mode: 'open'
        });

        let style = document.createElement('style');
        style.textContent = `
div {
    position: fixed;
    width: 10%;
    height: 2px;
    background: #ce0000;
    border-radius: 3px;
    top: 0;
    left: 0;
}`;

        shadow.appendChild(style);
        let bar = document.createElement('div');
        shadow.appendChild(bar);

        Object.defineProperty(this, 'for', {
            configurable: false,
            enumerable: false,
            writable: true,
            set value(value) {

                // if not number etc
                if(document.querySelector('#'+value).length < 1) {
                    console.error('scroll-progress-bar must have a valid for="id"');
                };

                _this.setAttribute('for', value);

                update();
            },

            get value() {
                return _this.getAttribute('for');
            }
        });
    }

    attributeChangedCallback(name, oldValue, newValue) {
        let div = this.shadowRoot.querySelector('div');

        const update = () => {
            let y = (document.querySelector('html').scrollTop || document.querySelector('body').scrollTop);
            let maxY = Math.max(
                document.body.scrollHeight,
                document.body.offsetHeight,
                document.documentElement.clientHeight,
                document.documentElement.scrollHeight,
                document.documentElement.offsetHeight
            ) - window.innerHeight;
        
            let scrollTop = y > maxY ? maxY : y;

            let v = ((scrollTop / maxY) * 100).toFixed(2);
            div.style.width = v  + '%';
        }

        document.addEventListener('scroll', update);
        update()
    }
}

customElements.define('scroll-progress-bar', Progress);

module.exports = Progress;