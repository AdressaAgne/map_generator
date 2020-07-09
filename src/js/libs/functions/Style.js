let id = 0;
const generateId = () => {
    return `style-${++id}`;
}

let styles = document.styleSheets;
if (styles.length == 0) {
    document.querySelector('body').appendChild(document.createElement('style'));
    styles = document.styleSheets;
}
let styleSheet = styles[styles.length - 1];

const addStyle = (selector) => {
    return styleSheet.insertRule(selector, styleSheet.cssRules.length);
}
const removeStyle = (selector) => {
    let rules = styleSheet.cssRules || styleSheet.rules;
    for (var i = 0; i < rules.length; i++) {
        if (rules[i].selectorText === selector) {
            styleSheet.removeRule ? styleSheet.removeRule(i) : styleSheet.deleteRule(i);
        }
    }
}
const removeElementStyle = element => {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }

    if (!(element instanceof HTMLElement)) {
        return;
    }

    removeStyle(`#${element.getAttribute('id')}`)
};

const setElementStyle = (element, style) => {
    removeElementStyle(element);
    addElementStyle(element, style);
}
/**
 * Set style on an element
 * @param {HTMLElement} element 
 * @param {String|Array} style Array of prop: value; or String of css styling
 */
const addElementStyle = (element, style) => {
    if (typeof element === 'string') {
        element = document.querySelector(element);
    }

    if (!(element instanceof HTMLElement)) {
        return;
    }

    let id = element.getAttribute('id') || generateId();
    element.setAttribute('id', id);

    if (style instanceof Array) {
        style = style.map(string => string.endsWith(';') ? string : `${string};`).join('');
    }

    addStyle(`#${id} {${style}}`);

    return element;
}

module.exports = {
    addStyle,
    removeStyle,
    removeElementStyle,
    setElementStyle,
    addElementStyle,
    setCssVar: (key, value, elm = document.documentElement || document.querySelector('html')) => elm.style.setProperty(`--${key}`, value)
}