/**
 * Usage:
 * 
 * const ruler = require('./libs/functions/Ruler');
 * 
 * let width = ruler(HTMLElement);
 * 
 */

const csv = document.createElement('canvas');
const ctx = csv.getContext('2d');

module.exports = (node) => {
    let style = getComputedStyle(node);
    let text = node.textContent || node.value;
    ctx.font = `${style.fontSize} ${style.fontFamily}`;
    return ctx.measureText(text).width;
}
