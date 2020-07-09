const setCssVar = (key, value, elm = document.documentElement || document.querySelector('html')) => elm.style.setProperty(`--${key}`, value);

let VPH, VPW;
const resize = () => {
    VPW = window.innerWidth;
    VPH = VPW <= 800 ? screen.height : window.innerHeight;

    setCssVar('vph', `${VPH}px`);
    setCssVar('vpw', `${VPW}px`);
    setCssVar('vphu', `${VPH}`);
    setCssVar('vpwu', `${VPW}`);
}

resize();

window.addEventListener('resize', resize);