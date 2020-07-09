/**
 * Usage:
 * require('./libs/functions/Viewport');
 */

const _debounce = require('./Debounce');
const {setCssVar} = require('./Style');


let VPH, VPW;
const resize = () => {
    VPW = window.innerWidth;
    VPH = VPW <= 800 ? screen.height : window.innerHeight;

    setCssVar('vph', `${VPH}px`);
    setCssVar('vpw', `${VPW}px`);
    setCssVar('vphu', `${VPH}`);
    setCssVar('vpwu', `${VPW}`);
    setCssVar('vpwi', window.innerHeight + 'px');
    setCssVar('vphi', window.innerWidth + 'px');
}
resize();

window.addEventListener('resize', _debounce(resize, 250));

module.exports = {
    resize,
    VPH,
    VPW
};