const on = callback => window.addEventListener('online', callback);
const off = callback => window.addEventListener('offline', callback);
const online = () => navigator.onLine;
const {
    setElementStyle
} = require('./Style');
const {
    yellow,
    white
} = require('../Color');


module.exports = {
    online,
    on,
    off,
    setOfflineNotification: () => {
        let div = document.createElement('div');
        let body = document.querySelector('body');
        let style = `
            position: fixed;
            background-color: ${yellow};
            height: 64px;
            width: 100vw;
            line-height: 64px;
            color: ${white};
            text-align: center;
            transition: top 240ms ease;
            top: -64px;
            font-family: Roboto, Sans-serif;
            opacity: 0;
            `;
        setElementStyle(div, style);

        div.innerHTML = `Du har mistet internett forbindelsen.`;
        on(() => setElementStyle(div, style));
        off(() => setElementStyle(div, `
                ${style}
                top: 0px;
                opacity: 1;
            `));

        body.appendChild(div);
    }
}