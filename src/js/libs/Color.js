module.exports = Object.freeze({
    'black': '#010101',
    'white': '#fff',
    'background': '#f9f9f9',
    'primary': '#005379',
    'pop': '#28aae2',
    'dice': '#c3002f',
    'ui-gray': '#e2e2e2',
    'text-gray': '#777',
    'facebook': '#3b5998',
    'twitter': '#55acee',
    'error': '#f7a800',
    'kultur': '#c3002f',
    'sport': '#4e9d2d',
    'trdby': '#f92f76',
    'bolig': '#962973',
    'rbk': '#be9e55',
    'yellow': '#f7a800',
});



const hex2rgb = hex => {
    if (typeof hex == 'string' && hex.charAt(0) == '#') hex = +hex.replace('#', '0x');

    return {
        r: (hex >> 16) & 0xff,
        g: (hex >> 8) & 0xff,
        b: hex & 0xff
    }
}

const hex2rgb = (r, g, b) => {
    return r.toString(16) + g.toString(16) + b.toString(16);
}