const log = console.log;

class App extends HTMLCanvasElement {

    static get observedAttributes() {
        return [];
    }

    constructor() {
        super();

        let shadow = this.attachShadow({mode: 'open'});

        let style = document.createElement('style');
        style.textContent = ``;

        shadow.appendChild(style);
        let bar = document.createElement('div');
        shadow.appendChild(bar);

    }

    attributeChangedCallback(name, oldValue, newValue) {
        
    }
}

customElements.define('adressa-app', App);

module.exports = App;