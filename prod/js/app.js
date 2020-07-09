(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
const Animations = [];
const Easing = require('./libs/functions/Easing');
const noop = () => {};

const Animate = (item, xTo, yTo, callback, duration = 60, easing = Easing.cubicOut) => {
    let element = null;
    for (let i = 0; i < Animations.length; i++) {
        if(item == Animations[i].item) {
            element = Animations[i].item
            break;
        }
    }

    let data = {
        item,
        xFrom: item.altX || 0,
        yFrom: item.altY || 0,
        xTo,
        yTo,
        iterator: 0,
        duration: typeof callback == 'number' ? callback : duration,
        callback: typeof callback == 'function' ? callback : noop,
        cue: null,
        easing
    }

    if (element != null) {
        element._stopAnimation = true;
    }

    Animations.push(data);
}

const AnimationsLoop = () => {
    for (let i = 0; i < Animations.length; i++) {
        const element = Animations[i];

        element.item._isAnimating = i;

        if (++element.iterator >= element.duration || element._stopAnimation) {
            Animations.splice(i, 1);

            element.item._isAnimating = undefined;

            if (element.cue) element.cue();
            if (element.callback) element.callback();
        }

        element.item.altX = element.easing(element.iterator, element.xFrom, element.xTo - element.xFrom, element.duration);
        element.item.altY = element.easing(element.iterator, element.yFrom, element.yTo - element.yFrom, element.duration);

    }
}

module.exports = {
    Animate,
    AnimationsLoop
};
},{"./libs/functions/Easing":12}],2:[function(require,module,exports){
module.exports = class BasicController {

    setDrawIndex(index) {
        this._drawIndex = index;
    }

    loop(x, y) {
        this.setCoords({
            x,
            y
        });

        if(this._firstLoop) {
            this._firstLoop = false;
            if(this.update && typeof this.update === 'function') this.update();
        }

        return this.canvas;
    }

    resetCoords() {
        this.setAltCoords(this.getCoords());
    }

    getCoords() {
        return {
            x: this.x,
            y: this.y
        }
    }
    getAltCoords() {
        return {
            x: this.altX,
            y: this.altY
        }
    }

    setCoords(coords) {
        this.x = parseInt(coords.x);
        this.y = parseInt(coords.y);
    }

    setAltCoords(coords) {
        this.altX = parseInt(coords.x);
        this.altY = parseInt(coords.y);
    }

}
},{}],3:[function(require,module,exports){
const Controller = require('./Controller');
const Canvas = require('./Canvas');

const assets = {

}
const margins = 50;
const fontSize = 30;
module.exports = class Button extends Controller {

    constructor(text, x = 0, y = 0, w = 10, h = 10) {
        super(x, y, w, h);
        this.text = text;
        this.scale = 1;

        this.background = "#000";
        this.highlight = "#000";
        this.textColor = "#fff";
        this.highlightTextColor = "#f00";

        this.render();
    }

    static Factory(text, x, y, callback) {
        let width = 10;

        Canvas(0, 0, ctx => {
            ctx.font = (fontSize * this.scale) + "px arial";
            width = ctx.measureText(this.text).width;
        });

        const btn = new this(text, x, y, width + (margins * 2), 60);
        btn.click = callback;

        return btn;
    }

    render(highlight) {
        this.canvas = Canvas(this.w, this.h, (ctx, img) => {
            // background
            ctx.fillStyle = highlight ? this.highlight : this.background;
            ctx.fillRect(0, 0, this.w, this.h);

            // text
            ctx.fillStyle = highlight ? this.highlightTextColor : this.textColor;
            ctx.font = (fontSize * this.scale) + "px arial";
            ctx.textAlign = 'center';
            ctx.fillText(this.text, this.w / 2, this.h / 2 + (fontSize * this.scale / 2));
        });
    }

    hoverEnter(coords) {
        this.render(true);
    }

    hoverLeave(coords) {
        this.render();
    }

}
},{"./Canvas":4,"./Controller":5}],4:[function(require,module,exports){
let images = {};

const fetchImage = (url, callback) => {
    if(images[url] !== undefined) {
        callback(images[url])
        return images[url];
    }
    let image = null
    if(url instanceof HTMLCanvasElement) {
        image = url;
        callback(url);
    } else {
        image = new Image();
        image.src = '/Assets/' + url;
        image.onload = () => {
            images[url] = image;
            callback(image);
        }
    }
    return image;
}

module.exports = (w, h, callback, colorChange) => {
    let canvas = document.createElement('canvas');
    let context = canvas.getContext('2d');
    
    canvas.width = w;
    canvas.height = h;

    context.clearRect(0, 0, w, h);

    if(colorChange) {
        context.fillStyle = colorChange;
        context.fillRect(0, 0, w, h);
        context.globalCompositeOperation = "destination-in";
    }

    callback(context, fetchImage);

    return canvas;
}
},{}],5:[function(require,module,exports){
const bboxCheck = (items, x, y) => {
    let clicked = null;
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (!item.inDeck && item.click && x > item.x && x < item.x + item.w && y > item.y && y < item.y + item.h) {

            if (clicked == null || (clicked._drawIndex || 0) < (item._drawIndex || 0)) {
                clicked = item;
            }
        }
    }

    if (clicked !== null) {
        clicked.click({
            x,
            y
        });
    }

}

let clickEvents = [];
window.addEventListener('click', e => {
    const x = e.pageX;
    const y = e.pageY;
    bboxCheck(clickEvents, x, y);
});
let hoverEvents = [];

window.addEventListener('mousemove', e => {
    const x = e.pageX;
    const y = e.pageY;
    for (let i = 0; i < hoverEvents.length; i++) {
        const item = hoverEvents[i];
        if (x > item.item.x && x < item.item.x + item.item.w && y > item.item.y && y < item.item.y + item.item.h) {
            if (!item._isMouseOver) {
                item._isMouseOver = true;
                item.enter({
                    x,
                    y,
                });
            }
        } else {
            if (item._isMouseOver == true) {
                item._isMouseOver = false;
                item.leave({
                    x,
                    y
                });
            }
        }
    }

});

const BasicController = require('./BasicController');
module.exports = class Controller extends BasicController {

    constructor(x, y, w, h) {
        super();

        this.w = w;
        this.h = h;
        this._firstLoop = true;
        this.setAltCoords({
            x,
            y
        });
        this.setCoords({
            x,
            y
        });

        clickEvents.push(this);

        if (this.hoverEnter && typeof this.hoverEnter == 'function' && this.hoverLeave && typeof this.hoverLeave == 'function') {
            hoverEvents.push({
                item: this,
                enter: this.hoverEnter.bind(this),
                leave: this.hoverLeave.bind(this)
            });
        }
    }

}
},{"./BasicController":2}],6:[function(require,module,exports){
const Canvas = require('../Canvas');
const BasicController = require('../BasicController');

const perlin = require('../funcs/perlin');
const levels = [{
    name: 'deep ocean',
    color: '#0000CE',
    weight: 25
}, {
    name: 'ocean',
    color: '#2389da',
    weight: 15
}, {
    name: 'shore',
    color: '#c2b280',
    weight: 10
}, {
    name: 'plains',
    color: '#52a17b',
    weight: 20
}, {
    name: 'forest',
    color: '#1F3D0C',
    weight: 30
}, {
    name: 'hills',
    color: '#5A4D41',
    weight: 30
}, {
    name: 'mountains',
    color: '#f8f8f8',
    weight: 50
}];
const vars = ['coords'];
const maxLevelValue = levels.reduce((prev, current) => prev + current.weight, 0);


const octaves = 4;
const gain = 0.5;
const lacunarity = 2;
module.exports = class Chunk extends BasicController {
    constructor(x, y, w = 32, h = 32, tileSize = 10) {
        super();

        this.map = new Uint16Array();

        this.innerX = x;
        this.innerY = y;
        this.x = x;
        this.y = y;

        this.innerW = w;
        this.innerH = h;
        this.w = w * tileSize;
        this.h = h * tileSize;
        this.tileSize = tileSize;
        this.scale = 200;
        this.map = this.generateMap();
        this.draw();
    }

    static seed(seed = false) {
        perlin.seed(seed ? seed : Math.random());
    }

    setTile(x, y, value) {
        this.map[Math.floor(x + (y * this.innerW))] = value || 0;
    }

    getLevel(height) {
        let h = 0;
        for (let i = 0; i < levels.length; i++) {
            const value = levels[i].weight;
            if (height <= (h += value)) return i;
        }
        return levels.length - 1;
    }

    generateMap() {
        let map = [];
        const l = vars.length;
        for (let i = 0; i < (this.innerW * this.innerH * l); i += l) {
            const index = Math.floor(i / l);
            const x = index % this.innerW + (this.innerX * this.innerW);
            const y = index / this.innerW + (this.innerY * this.innerH);
            let z = 0;

            let frequency = 1.0
            let amplitude = gain;

            for (let j = 0; j < octaves; ++j) {
                z += Math.abs(perlin.simplex2((x / this.scale) * frequency, (y / this.scale) * frequency)) * amplitude;
                frequency *= lacunarity;
                amplitude *= gain;
            }

            map[i] = Math.floor(z * maxLevelValue);
        }
        return map;
    }

    draw() {
        const l = vars.length;
        this.canvas = Canvas(this.innerW * this.tileSize, this.innerH * this.tileSize, (ctx, img) => {
            for (let i = 0; i < this.map.length; i += l) {
                const index = Math.floor(i / l);
                const x = Math.floor(index % this.innerW);
                const y = Math.floor(index / this.innerW);

                const level = this.getLevel(this.map[i]);
                ctx.fillStyle = levels[level].color;
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        });
    }
}
},{"../BasicController":2,"../Canvas":4,"../funcs/perlin":8}],7:[function(require,module,exports){
const log = console.log;
const Animation = require('./libs/functions/RequestAnimationFrame');
const Game = require('./game.js');
class App {
    constructor(canvas) {

        this.w = window.innerWidth;
        this.h = window.innerHeight;

        window.addEventListener('resize', e => {
            this.w = window.innerWidth;
            this.h = window.innerHeight;
            canvas.width = this.w;
            canvas.height = this.h;
        });

        canvas.width = this.w;
        canvas.height = this.h;
        this.ctx = canvas.getContext('2d');


        if (Game.main && typeof Game.main == 'function') Game.main(this.ctx, this.w, this.h);
        Animation.Factory(this.loop.bind(this));
    }

    loop() {
        this.ctx.clearRect(0, 0, this.w, this.h);
        Game.loop(this.ctx, this.w, this.h);
    }
}

new App(document.querySelector('canvas'));
},{"./game.js":9,"./libs/functions/RequestAnimationFrame":13}],8:[function(require,module,exports){
/*
 * A speed-improved perlin and simplex noise algorithms for 2D.
 *
 * Based on example code by Stefan Gustavson (stegu@itn.liu.se).
 * Optimisations by Peter Eastman (peastman@drizzle.stanford.edu).
 * Better rank ordering method by Stefan Gustavson in 2012.
 * Converted to Javascript by Joseph Gentle.
 *
 * Version 2012-03-09
 *
 * This code was placed in the public domain by its original author,
 * Stefan Gustavson. You may use it as you see fit, but
 * attribution is appreciated.
 *
 */


var perlin = {};

function Grad(x, y, z) {
  this.x = x;
  this.y = y;
  this.z = z;
}

Grad.prototype.dot2 = function (x, y) {
  return this.x * x + this.y * y;
};

Grad.prototype.dot3 = function (x, y, z) {
  return this.x * x + this.y * y + this.z * z;
};

var grad3 = [new Grad(1, 1, 0), new Grad(-1, 1, 0), new Grad(1, -1, 0), new Grad(-1, -1, 0),
  new Grad(1, 0, 1), new Grad(-1, 0, 1), new Grad(1, 0, -1), new Grad(-1, 0, -1),
  new Grad(0, 1, 1), new Grad(0, -1, 1), new Grad(0, 1, -1), new Grad(0, -1, -1)
];

var p = [151, 160, 137, 91, 90, 15,
  131, 13, 201, 95, 96, 53, 194, 233, 7, 225, 140, 36, 103, 30, 69, 142, 8, 99, 37, 240, 21, 10, 23,
  190, 6, 148, 247, 120, 234, 75, 0, 26, 197, 62, 94, 252, 219, 203, 117, 35, 11, 32, 57, 177, 33,
  88, 237, 149, 56, 87, 174, 20, 125, 136, 171, 168, 68, 175, 74, 165, 71, 134, 139, 48, 27, 166,
  77, 146, 158, 231, 83, 111, 229, 122, 60, 211, 133, 230, 220, 105, 92, 41, 55, 46, 245, 40, 244,
  102, 143, 54, 65, 25, 63, 161, 1, 216, 80, 73, 209, 76, 132, 187, 208, 89, 18, 169, 200, 196,
  135, 130, 116, 188, 159, 86, 164, 100, 109, 198, 173, 186, 3, 64, 52, 217, 226, 250, 124, 123,
  5, 202, 38, 147, 118, 126, 255, 82, 85, 212, 207, 206, 59, 227, 47, 16, 58, 17, 182, 189, 28, 42,
  223, 183, 170, 213, 119, 248, 152, 2, 44, 154, 163, 70, 221, 153, 101, 155, 167, 43, 172, 9,
  129, 22, 39, 253, 19, 98, 108, 110, 79, 113, 224, 232, 178, 185, 112, 104, 218, 246, 97, 228,
  251, 34, 242, 193, 238, 210, 144, 12, 191, 179, 162, 241, 81, 51, 145, 235, 249, 14, 239, 107,
  49, 192, 214, 31, 181, 199, 106, 157, 184, 84, 204, 176, 115, 121, 50, 45, 127, 4, 150, 254,
  138, 236, 205, 93, 222, 114, 67, 29, 24, 72, 243, 141, 128, 195, 78, 66, 215, 61, 156, 180
];
// To remove the need for index wrapping, double the permutation table length
var perm = new Array(512);
var gradP = new Array(512);

// This isn't a very good seeding function, but it works ok. It supports 2^16
// different seed values. Write something better if you need more seeds.
perlin.seed = function (seed) {
  if (seed > 0 && seed < 1) {
    // Scale the seed out
    seed *= 65536;
  }

  seed = Math.floor(seed);
  if (seed < 256) {
    seed |= seed << 8;
  }

  for (var i = 0; i < 256; i++) {
    var v;
    if (i & 1) {
      v = p[i] ^ (seed & 255);
    } else {
      v = p[i] ^ ((seed >> 8) & 255);
    }

    perm[i] = perm[i + 256] = v;
    gradP[i] = gradP[i + 256] = grad3[v % 12];
  }
};

perlin.seed(0);

/*
for(var i=0; i<256; i++) {
  perm[i] = perm[i + 256] = p[i];
  gradP[i] = gradP[i + 256] = grad3[perm[i] % 12];
}*/

// Skewing and unskewing factors for 2, 3, and 4 dimensions
var F2 = 0.5 * (Math.sqrt(3) - 1);
var G2 = (3 - Math.sqrt(3)) / 6;

var F3 = 1 / 3;
var G3 = 1 / 6;

// 2D simplex noise
perlin.simplex2 = function (xin, yin) {
  var n0, n1, n2; // Noise contributions from the three corners
  // Skew the input space to determine which simplex cell we're in
  var s = (xin + yin) * F2; // Hairy factor for 2D
  var i = Math.floor(xin + s);
  var j = Math.floor(yin + s);
  var t = (i + j) * G2;
  var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
  var y0 = yin - j + t;
  // For the 2D case, the simplex shape is an equilateral triangle.
  // Determine which simplex we are in.
  var i1, j1; // Offsets for second (middle) corner of simplex in (i,j) coords
  if (x0 > y0) { // lower triangle, XY order: (0,0)->(1,0)->(1,1)
    i1 = 1;
    j1 = 0;
  } else { // upper triangle, YX order: (0,0)->(0,1)->(1,1)
    i1 = 0;
    j1 = 1;
  }
  // A step of (1,0) in (i,j) means a step of (1-c,-c) in (x,y), and
  // a step of (0,1) in (i,j) means a step of (-c,1-c) in (x,y), where
  // c = (3-sqrt(3))/6
  var x1 = x0 - i1 + G2; // Offsets for middle corner in (x,y) unskewed coords
  var y1 = y0 - j1 + G2;
  var x2 = x0 - 1 + 2 * G2; // Offsets for last corner in (x,y) unskewed coords
  var y2 = y0 - 1 + 2 * G2;
  // Work out the hashed gradient indices of the three simplex corners
  i &= 255;
  j &= 255;
  var gi0 = gradP[i + perm[j]];
  var gi1 = gradP[i + i1 + perm[j + j1]];
  var gi2 = gradP[i + 1 + perm[j + 1]];
  // Calculate the contribution from the three corners
  var t0 = 0.5 - x0 * x0 - y0 * y0;
  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * gi0.dot2(x0, y0); // (x,y) of grad3 used for 2D gradient
  }
  var t1 = 0.5 - x1 * x1 - y1 * y1;
  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * gi1.dot2(x1, y1);
  }
  var t2 = 0.5 - x2 * x2 - y2 * y2;
  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * gi2.dot2(x2, y2);
  }
  // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].
  return 70 * (n0 + n1 + n2);
};

// 3D simplex noise
perlin.simplex3 = function (xin, yin, zin) {
  var n0, n1, n2, n3; // Noise contributions from the four corners

  // Skew the input space to determine which simplex cell we're in
  var s = (xin + yin + zin) * F3; // Hairy factor for 2D
  var i = Math.floor(xin + s);
  var j = Math.floor(yin + s);
  var k = Math.floor(zin + s);

  var t = (i + j + k) * G3;
  var x0 = xin - i + t; // The x,y distances from the cell origin, unskewed.
  var y0 = yin - j + t;
  var z0 = zin - k + t;

  // For the 3D case, the simplex shape is a slightly irregular tetrahedron.
  // Determine which simplex we are in.
  var i1, j1, k1; // Offsets for second corner of simplex in (i,j,k) coords
  var i2, j2, k2; // Offsets for third corner of simplex in (i,j,k) coords
  if (x0 >= y0) {
    if (y0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    } else if (x0 >= z0) {
      i1 = 1;
      j1 = 0;
      k1 = 0;
      i2 = 1;
      j2 = 0;
      k2 = 1;
    } else {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 1;
      j2 = 0;
      k2 = 1;
    }
  } else {
    if (y0 < z0) {
      i1 = 0;
      j1 = 0;
      k1 = 1;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else if (x0 < z0) {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 0;
      j2 = 1;
      k2 = 1;
    } else {
      i1 = 0;
      j1 = 1;
      k1 = 0;
      i2 = 1;
      j2 = 1;
      k2 = 0;
    }
  }
  // A step of (1,0,0) in (i,j,k) means a step of (1-c,-c,-c) in (x,y,z),
  // a step of (0,1,0) in (i,j,k) means a step of (-c,1-c,-c) in (x,y,z), and
  // a step of (0,0,1) in (i,j,k) means a step of (-c,-c,1-c) in (x,y,z), where
  // c = 1/6.
  var x1 = x0 - i1 + G3; // Offsets for second corner
  var y1 = y0 - j1 + G3;
  var z1 = z0 - k1 + G3;

  var x2 = x0 - i2 + 2 * G3; // Offsets for third corner
  var y2 = y0 - j2 + 2 * G3;
  var z2 = z0 - k2 + 2 * G3;

  var x3 = x0 - 1 + 3 * G3; // Offsets for fourth corner
  var y3 = y0 - 1 + 3 * G3;
  var z3 = z0 - 1 + 3 * G3;

  // Work out the hashed gradient indices of the four simplex corners
  i &= 255;
  j &= 255;
  k &= 255;
  var gi0 = gradP[i + perm[j + perm[k]]];
  var gi1 = gradP[i + i1 + perm[j + j1 + perm[k + k1]]];
  var gi2 = gradP[i + i2 + perm[j + j2 + perm[k + k2]]];
  var gi3 = gradP[i + 1 + perm[j + 1 + perm[k + 1]]];

  // Calculate the contribution from the four corners
  var t0 = 0.6 - x0 * x0 - y0 * y0 - z0 * z0;
  if (t0 < 0) {
    n0 = 0;
  } else {
    t0 *= t0;
    n0 = t0 * t0 * gi0.dot3(x0, y0, z0); // (x,y) of grad3 used for 2D gradient
  }
  var t1 = 0.6 - x1 * x1 - y1 * y1 - z1 * z1;
  if (t1 < 0) {
    n1 = 0;
  } else {
    t1 *= t1;
    n1 = t1 * t1 * gi1.dot3(x1, y1, z1);
  }
  var t2 = 0.6 - x2 * x2 - y2 * y2 - z2 * z2;
  if (t2 < 0) {
    n2 = 0;
  } else {
    t2 *= t2;
    n2 = t2 * t2 * gi2.dot3(x2, y2, z2);
  }
  var t3 = 0.6 - x3 * x3 - y3 * y3 - z3 * z3;
  if (t3 < 0) {
    n3 = 0;
  } else {
    t3 *= t3;
    n3 = t3 * t3 * gi3.dot3(x3, y3, z3);
  }
  // Add contributions from each corner to get the final noise value.
  // The result is scaled to return values in the interval [-1,1].
  return 32 * (n0 + n1 + n2 + n3);

};

// ##### Perlin noise stuff

function fade(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

function lerp(a, b, t) {
  return (1 - t) * a + t * b;
}

// 2D Perlin Noise
perlin.perlin2 = function (x, y) {
  // Find unit grid cell containing point
  var X = Math.floor(x),
    Y = Math.floor(y);
  // Get relative xy coordinates of point within that cell
  x = x - X;
  y = y - Y;
  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
  X = X & 255;
  Y = Y & 255;

  // Calculate noise contributions from each of the four corners
  var n00 = gradP[X + perm[Y]].dot2(x, y);
  var n01 = gradP[X + perm[Y + 1]].dot2(x, y - 1);
  var n10 = gradP[X + 1 + perm[Y]].dot2(x - 1, y);
  var n11 = gradP[X + 1 + perm[Y + 1]].dot2(x - 1, y - 1);

  // Compute the fade curve value for x
  var u = fade(x);

  // Interpolate the four results
  return lerp(
    lerp(n00, n10, u),
    lerp(n01, n11, u),
    fade(y));
};

// 3D Perlin Noise
perlin.perlin3 = function (x, y, z) {
  // Find unit grid cell containing point
  var X = Math.floor(x),
    Y = Math.floor(y),
    Z = Math.floor(z);
  // Get relative xyz coordinates of point within that cell
  x = x - X;
  y = y - Y;
  z = z - Z;
  // Wrap the integer cells at 255 (smaller integer period can be introduced here)
  X = X & 255;
  Y = Y & 255;
  Z = Z & 255;

  // Calculate noise contributions from each of the eight corners
  var n000 = gradP[X + perm[Y + perm[Z]]].dot3(x, y, z);
  var n001 = gradP[X + perm[Y + perm[Z + 1]]].dot3(x, y, z - 1);
  var n010 = gradP[X + perm[Y + 1 + perm[Z]]].dot3(x, y - 1, z);
  var n011 = gradP[X + perm[Y + 1 + perm[Z + 1]]].dot3(x, y - 1, z - 1);
  var n100 = gradP[X + 1 + perm[Y + perm[Z]]].dot3(x - 1, y, z);
  var n101 = gradP[X + 1 + perm[Y + perm[Z + 1]]].dot3(x - 1, y, z - 1);
  var n110 = gradP[X + 1 + perm[Y + 1 + perm[Z]]].dot3(x - 1, y - 1, z);
  var n111 = gradP[X + 1 + perm[Y + 1 + perm[Z + 1]]].dot3(x - 1, y - 1, z - 1);

  // Compute the fade curve value for x, y, z
  var u = fade(x);
  var v = fade(y);
  var w = fade(z);

  // Interpolate
  return lerp(
    lerp(
      lerp(n000, n100, u),
      lerp(n001, n101, u), w),
    lerp(
      lerp(n010, n110, u),
      lerp(n011, n111, u), w),
    v);
};

module.exports = perlin;
},{}],9:[function(require,module,exports){
const log = console.log;

const {
    Animate,
    AnimationsLoop
} = require('./Animation');
const Button = require('./Button');
const keyHandler = require('./libs/events/KeyHandler').Factory();

let buttons = [];



const paddingV = 20;
const paddingH = paddingV;

const chunkSize = 32;
const tileSize = 6;
const chunkCalcSize = chunkSize * tileSize;
const Chunk = require('./Objects/Chunk');
Chunk.seed();

let renderChuncks = [];
let chunks = {};
buttons.push(Button.Factory('new Map', 0, 0, e => {
    Chunk.seed();
    chunks = {};
    renderChuncks = [];
}));



/**
 * renderDistance in chucnks
 */
const renderDistance = Math.ceil(Math.max(window.innerWidth, window.innerHeight) / chunkCalcSize);

console.log('Render Distance', renderDistance);
console.log('ChunkSize', chunkSize);
console.log('TileSize', tileSize);

const playerAccseleration = 1.5;
const playerDeceleration = 0.9;
let player = {
    dir: {
        w: false,
        a: false,
        d: false,
        s: false,
    },
    coords: {
        x: 0,
        y: 0
    },
    momentum: {
        x: 0,
        y: 0
    },
    loop: function () {
        if (this.dir.a) player.momentum.x += playerAccseleration
        if (this.dir.d) player.momentum.x -= playerAccseleration
        if (this.dir.w) player.momentum.y += playerAccseleration
        if (this.dir.s) player.momentum.y -= playerAccseleration


        this.coords.x += this.momentum.x;
        this.coords.y += this.momentum.y;

        this.momentum.y *= playerDeceleration;
        if (Math.abs(this.momentum.y) < playerDeceleration) this.momentum.y = 0;
        this.momentum.x *= playerDeceleration;
        if (Math.abs(this.momentum.x) < playerDeceleration) this.momentum.x = 0;
    }
};

keyHandler.on('a', e => {
    player.dir.a = true
});
keyHandler.on('a-up', e => {
    player.dir.a = false
});
keyHandler.on('d', e => {
    player.dir.d = true
});
keyHandler.on('d-up', e => {
    player.dir.d = false
});
keyHandler.on('w', e => {
    player.dir.w = true
});
keyHandler.on('w-up', e => {
    player.dir.w = false
});
keyHandler.on('s', e => {
    player.dir.s = true
});
keyHandler.on('s-up', e => {
    player.dir.s = false
});

const generateChunk = (x, y) => {
    const chunk = new Chunk(x, y, chunkSize, chunkSize, tileSize);
    chunks[`${x}:${y}`] = chunk;
    return chunk;
}

const generateChunks = () => {
    let playerX = player.coords.x;
    let playerY = player.coords.y;
    renderChuncks = [];
    for (let x = -renderDistance; x < renderDistance; x++) {
        for (let y = -renderDistance; y < renderDistance; y++) {
            const chunkX = -(Math.floor(playerX / chunkCalcSize) + x);
            const chunkY = -(Math.floor(playerY / chunkCalcSize) + y);
            renderChuncks.push(`${chunkX}:${chunkY}`);
            if (!chunks[`${chunkX}:${chunkY}`]) {
                generateChunk(chunkX, chunkY);
            }
        }
    }
}


let grd = null;

module.exports = {
    main: (ctx, w, h) => {
        grd = ctx.createRadialGradient(w / 2, h / 2, w / 4, w / 2, h / 2, w / 2);
        grd.addColorStop(0, "rgba(0, 0, 0, 0)");
        grd.addColorStop(1, "rgba(0, 0, 0, 1)");

        console.log('generating chunks');
        generateChunks();
        console.log(chunks);
    },
    loop: (ctx, w, h) => {
        player.loop();
        // background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        let drawIndex = 0;
        const Pencil = (cls, x = 0, y = 0, offsetX = 0, offsetY = 0) => {
            cls.setDrawIndex(drawIndex++);
            ctx.drawImage(cls.loop(x, y), x + offsetX, y + offsetY);

            return cls;
        }

        AnimationsLoop();
        generateChunks();

        for (let i = 0; i < renderChuncks.length; i++) {
            const chunk = chunks[renderChuncks[i]];

            const x = chunk.innerX * chunk.w;
            const offsetX = player.coords.x;

            const y = chunk.innerY * chunk.h;
            const offsetY = player.coords.y;

            Pencil(chunk, x, y, offsetX + (w / 2) - (renderDistance * chunkCalcSize / 2), offsetY + (h / 2) - (renderDistance * chunkCalcSize / 2));
        }


        // Fill with gradient
        ctx.fillStyle = grd;
        ctx.fillRect(0, 0, w, h);

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            Pencil(button, w - button.w - paddingH, h - (button.h * (i + 1)) - (paddingV * (i + 1)));
        }


    }
}
},{"./Animation":1,"./Button":3,"./Objects/Chunk":6,"./libs/events/KeyHandler":11}],10:[function(require,module,exports){
/**
 * Used to manage events in classes
 */
const log = console.log;

// set EventArray class _evtContainer
class Event {

    /**
     * Event init, define event container
     * @method constructor
     */
    constructor() {
        this._evtContainer = {};

        this.fireEvent = this.emit.bind(this);
        this.dispatch = this.emit.bind(this);

        this.addEventListener = this.on.bind(this);
        this.removeEventListener = this.off.bind(this);

        setTimeout(() => this.fireEvent('load'), 0);
    }

    /**
     * Fire an event
     * @method fireEvent
     * @param  {String}  evt   [Event name]
     * @param  {Object}  param [function bind]
     * @return {void}
     */
    emit(evt, param) {
        // Does the event exist
        if (!this.has(evt)) return false;

        let events = this.get(evt);
        events.forEach(callback => {
            // Call callback functions if it exists
            if (callback && typeof callback === 'function') {
                let e = Object.assign((param || {}), {
                    _type: evt,
                    _emitter: this.constructor.name,
                    _off: () => this.delete(evt, callback),
                    _callback: callback
                });
                callback.bind(this)(e);
            }
        });

        return this;
    }

    /**
     * Set event functions
     * @method on
     * @param  {Event}    evts     [event names]
     * @param  {Function} callback [callback]
     * @return {this}
     */
    on(evts, callback = null) {
        if (typeof callback !== 'function') throw Error('Callback must be a function');

        let event_array = evts.split(' ');
        for (let i = 0; i < event_array.length; i++) {
            const evt = event_array[i];

            this.create(evt).add(evt, callback);
        }
        return this;
    }


    /**
     * Remove event function
     * @param {String} events
     * @param {Callback} function
     */
    off(evts, callback = null) {
        let event_array = evts.split(' ');
        for (let i = 0; i < event_array.length; i++) {
            const evt = event_array[i];
            callback !== null ? this.delete(evt, callback) : this.reset(evt);
        }

    }

    /**
     * Get an EventContainer
     * @param {String} evt 
     */
    get(evt) {
        return this._evtContainer[evt];
    }

    /**
     * check if event exists
     * @param {String} evt 
     */
    has(evt) {
        return this.get(evt) !== undefined && this.get(evt) instanceof Map;
    }

    /**
     * Add an event to an EventContainer
     * @param {String} evt 
     * @param {Function} callback 
     */
    add(evt, callback) {
        this.get(evt).set(callback, callback);

        if (this.get(evt).size > Event.MAX_LISTENERS) {
            console.warn(`Event ${evt} has more then ${Event.MAX_LISTENERS} listeners. (You can change Event.MAX_LISTENERS)`);
        }

        return this;
    }

    /**
     * Create Event container if it does not exist
     * @param {String} evt 
     */
    create(evt) {
        if (this.has(evt)) return this;

        this._evtContainer[evt] = new Map();

        return this;
    }

    /**
     * Reset an EventContainer to null
     * @param {String} evt 
     */
    reset(evt) {
        if (!this.has(evt)) return this;

        this._evtContainer[evt] = new Map();

        return this;

    }

    /**
     * Delete an EventContainer
     * @param {String} evt 
     */
    delete(evt, callback) {
        if (evt && callback && !this.has(evt) && this.get(evt).has(callback)) return this;

        this.get(evt).delete(callback);

        return this;
    }

}


let max_listeners = 10;
/**
 * Define Event vars, and set setters
 */
Object.defineProperties(Event, {

    MIN_MAX_LISTENERS: {
        value: 1,
        writable: false
    },

    MAX_LISTENERS: {
        set(value) {
            if (typeof value != 'number') throw new Error('Event.MAX_LISTENERS must be typeof Number, got ' + typeof value);

            if (value < Event.MIN_MAX_LISTENERS) throw new Error(`Event.MAX_LISTENERS should be abow ${Event.MIN_MAX_LISTENERS}`);

            max_listeners = value;
        },
        get() {
            return max_listeners;
        }
    }

});

/**
 * Export Event class
 */
module.exports = Event;
},{}],11:[function(require,module,exports){
/**
 * Usage:
 * let keyHandler = require('./libs/events/KeyHandler').Factory();
 * keyHandler.on('tab a g', e => {
 *  // code
 * });
 */

const Event = require('./Event');

module.exports = class KeyHandler extends Event {
    constructor() {
        super();
        
        window.addEventListener('keydown', e => this.emit(this.convertKeyCode(e.keyCode).toLowerCase(), e));
        window.addEventListener('keyup', e => this.emit(this.convertKeyCode(e.keyCode).toLowerCase()+"-up", e));
    }

    static Factory() {
        return new KeyHandler();
    }

    convertKeyCode(key) {
        const keyCodes = [
            "",
            "",
            "",
            "CANCEL",
            "",
            "",
            "HELP",
            "",
            "BACK_SPACE",
            "TAB",
            "",
            "",
            "CLEAR",
            "ENTER",
            "ENTER_SPECIAL",
            "",
            "SHIFT",
            "CONTROL",
            "ALT",
            "PAUSE",
            "CAPS_LOCK",
            "KANA",
            "EISU",
            "JUNJA",
            "FINAL",
            "HANJA",
            "",
            "ESCAPE",
            "CONVERT",
            "NONCONVERT",
            "ACCEPT",
            "MODECHANGE",
            "SPACE",
            "PAGE_UP",
            "PAGE_DOWN",
            "END",
            "HOME",
            "LEFT",
            "UP",
            "RIGHT",
            "DOWN",
            "SELECT",
            "PRINT",
            "EXECUTE",
            "PRINTSCREEN",
            "INSERT",
            "DELETE",
            "",
            "0",
            "1",
            "2",
            "3",
            "4",
            "5",
            "6",
            "7",
            "8",
            "9",
            "COLON",
            "SEMICOLON",
            "LESS_THAN",
            "EQUALS",
            "GREATER_THAN",
            "QUESTION_MARK",
            "AT",
            "A",
            "B",
            "C",
            "D",
            "E",
            "F",
            "G",
            "H",
            "I",
            "J",
            "K",
            "L",
            "M",
            "N",
            "O",
            "P",
            "Q",
            "R",
            "S",
            "T",
            "U",
            "V",
            "W",
            "X",
            "Y",
            "Z",
            "OS_KEY",
            "",
            "CONTEXT_MENU",
            "",
            "SLEEP",
            "NUMPAD0",
            "NUMPAD1",
            "NUMPAD2",
            "NUMPAD3",
            "NUMPAD4",
            "NUMPAD5",
            "NUMPAD6",
            "NUMPAD7",
            "NUMPAD8",
            "NUMPAD9",
            "MULTIPLY",
            "ADD",
            "SEPARATOR",
            "SUBTRACT",
            "DECIMAL",
            "DIVIDE",
            "F1",
            "F2",
            "F3",
            "F4",
            "F5",
            "F6",
            "F7",
            "F8",
            "F9",
            "F10",
            "F11",
            "F12",
            "F13",
            "F14",
            "F15",
            "F16",
            "F17",
            "F18",
            "F19",
            "F20",
            "F21",
            "F22",
            "F23",
            "F24",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "NUM_LOCK",
            "SCROLL_LOCK",
            "WIN_OEM_FJ_JISHO",
            "WIN_OEM_FJ_MASSHOU",
            "WIN_OEM_FJ_TOUROKU",
            "WIN_OEM_FJ_LOYA",
            "WIN_OEM_FJ_ROYA",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "CIRCUMFLEX",
            "EXCLAMATION",
            "DOUBLE_QUOTE",
            "HASH",
            "DOLLAR",
            "PERCENT",
            "AMPERSAND",
            "UNDERSCORE",
            "OPEN_PAREN",
            "CLOSE_PAREN",
            "ASTERISK",
            "PLUS",
            "PIPE",
            "HYPHEN_MINUS",
            "OPEN_CURLY_BRACKET",
            "CLOSE_CURLY_BRACKET",
            "TILDE",
            "",
            "",
            "",
            "",
            "VOLUME_MUTE",
            "VOLUME_DOWN",
            "VOLUME_UP",
            "",
            "",
            "SEMICOLON",
            "EQUALS",
            "COMMA",
            "MINUS",
            "PERIOD",
            "SLASH",
            "BACK_QUOTE",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "OPEN_BRACKET",
            "BACK_SLASH",
            "CLOSE_BRACKET",
            "QUOTE",
            "",
            "META",
            "ALTGR",
            "",
            "WIN_ICO_HELP",
            "WIN_ICO_00",
            "",
            "WIN_ICO_CLEAR",
            "",
            "",
            "WIN_OEM_RESET",
            "WIN_OEM_JUMP",
            "WIN_OEM_PA1",
            "WIN_OEM_PA2",
            "WIN_OEM_PA3",
            "WIN_OEM_WSCTRL",
            "WIN_OEM_CUSEL",
            "WIN_OEM_ATTN",
            "WIN_OEM_FINISH",
            "WIN_OEM_COPY",
            "WIN_OEM_AUTO",
            "WIN_OEM_ENLW",
            "WIN_OEM_BACKTAB",
            "ATTN",
            "CRSEL",
            "EXSEL",
            "EREOF",
            "PLAY",
            "ZOOM",
            "",
            "PA1",
            "WIN_OEM_CLEAR",
            ""
        ];

        return keyCodes[key] != undefined ? keyCodes[key] : key;
    }
}
},{"./Event":10}],12:[function(require,module,exports){
/**
 * Usage:
 * const {bounceOut, circInOut, linear} = require('./libs/functions/Easing');
 * bounceOut()
 * circInOut()
 * linear()
 * 
 * OR
 * 
 * const easing = require('./libs/functions/Easing');
 * easing.bounceOut()
 * easing.circInOut()
 * easing.linear()
 */


module.exports = {
    bounceOut: function (time, begin, change, duration) {
        if ((time /= duration) < 1 / 2.75) {
            return change * (7.5625 * time * time) + begin;
        } else if (time < 2 / 2.75) {
            return change * (7.5625 * (time -= 1.5 / 2.75) * time + 0.75) + begin;
        } else if (time < 2.5 / 2.75) {
            return change * (7.5625 * (time -= 2.25 / 2.75) * time + 0.9375) + begin;
        } else {
            return change * (7.5625 * (time -= 2.625 / 2.75) * time + 0.984375) + begin;
        }
    },

    bounceIn: function (time, begin, change, duration) {
        return change - this.bounceOut(duration - time, 0, change, duration) + begin;
    },

    bounceInOut: function (time, begin, change, duration) {
        if (time < duration / 2) {
            return this.bounceIn(time * 2, 0, change, duration) * 0.5 + begin;
        } else {
            return this.bounceOut(time * 2 - duration, 0, change, duration) * 0.5 + change * 0.5 + begin;
        }
    },

    linear: function (time, begin, change, duration) {
        return change * time / duration + begin;
    },

    circIn: function (time, begin, change, duration) {
        return -change * (Math.sqrt(1 - (time = time / duration) * time) - 1) + begin;
    },

    circOut: function (time, begin, change, duration) {
        return change * Math.sqrt(1 - (time = time / duration - 1) * time) + begin;
    },

    circInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return -change / 2 * (Math.sqrt(1 - time * time) - 1) + begin;
        } else {
            return change / 2 * (Math.sqrt(1 - (time -= 2) * time) + 1) + begin;
        }
    },

    cubicIn: function (time, begin, change, duration) {
        return change * (time /= duration) * time * time + begin;
    },

    cubicOut: function (time, begin, change, duration) {
        return change * ((time = time / duration - 1) * time * time + 1) + begin;
    },

    cubicInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time * time + begin;
        } else {
            return change / 2 * ((time -= 2) * time * time + 2) + begin;
        }
    },

    expoIn: function (time, begin, change, duration) {
        if (time === 0) {
            return begin;
        }
        return change * Math.pow(2, 10 * (time / duration - 1)) + begin;
    },

    expoOut: function (time, begin, change, duration) {
        if (time === duration) {
            return begin + change;
        }
        return change * (-Math.pow(2, -10 * time / duration) + 1) + begin;
    },

    expoInOut: function (time, begin, change, duration) {
        if (time === 0) {
            return begin;
        } else if (time === duration) {
            return begin + change;
        } else if ((time = time / (duration / 2)) < 1) {
            return change / 2 * Math.pow(2, 10 * (time - 1)) + begin;
        } else {
            return change / 2 * (-Math.pow(2, -10 * (time - 1)) + 2) + begin;
        }
    },

    quadIn: function (time, begin, change, duration) {
        return change * (time = time / duration) * time + begin;
    },

    quadOut: function (time, begin, change, duration) {
        return -change * (time = time / duration) * (time - 2) + begin;
    },

    quadInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time + begin;
        } else {
            return -change / 2 * ((time -= 1) * (time - 2) - 1) + begin;
        }
    },

    quartIn: function (time, begin, change, duration) {
        return change * (time = time / duration) * time * time * time + begin;
    },

    quartOut: function (time, begin, change, duration) {
        return -change * ((time = time / duration - 1) * time * time * time - 1) + begin;
    },

    quartInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time * time * time + begin;
        } else {
            return -change / 2 * ((time -= 2) * time * time * time - 2) + begin;
        }
    },

    quintIn: function (time, begin, change, duration) {
        return change * (time = time / duration) * time * time * time * time + begin;
    },

    quintOut: function (time, begin, change, duration) {
        return change * ((time = time / duration - 1) * time * time * time * time + 1) + begin;
    },

    quintInOut: function (time, begin, change, duration) {
        if ((time = time / (duration / 2)) < 1) {
            return change / 2 * time * time * time * time * time + begin;
        } else {
            return change / 2 * ((time -= 2) * time * time * time * time + 2) + begin;
        }
    },

    sineIn: function (time, begin, change, duration) {
        return -change * Math.cos(time / duration * (Math.PI / 2)) + change + begin;
    },

    sineOut: function (time, begin, change, duration) {
        return change * Math.sin(time / duration * (Math.PI / 2)) + begin;
    },

    sineInOut: function (time, begin, change, duration) {
        return -change / 2 * (Math.cos(Math.PI * time / duration) - 1) + begin;
    },

};
},{}],13:[function(require,module,exports){
/**
 * Usage:
 * const Animate = require('./libs/functions/Animate');
 * let loop = new Animate();
 * 
 * // Run a 60fps loop
 * loop.start(() => {
 *      if(a == b) {
 *          loop.stop();
 *      }
 * });
 * 
 */

window.requestAnimationFrame = window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.oRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };

module.exports = class Animate {

    static Factory(cb) {
        let loop =  new Animate();
        return loop.start(cb);
    }

    /**
     * @param {Callback} cb 
     */
    start(callback) {
        if (typeof callback !== 'function') return;

        this.done = false;

        let func = function (e) {
            callback(e);
            if (!this.done) {
                window.requestAnimationFrame(func);
            }
        }.bind(this);

        this.id = window.requestAnimationFrame(func);

        return this;
    }

    /**
     * Stop
     */
    stop() {
        this.done = true;

        return this;
    }

}
},{}]},{},[7])
//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiIiwic291cmNlcyI6WyJhcHAuanMiXSwic291cmNlc0NvbnRlbnQiOlsiY29uc3QgbG9nID0gY29uc29sZS5sb2c7XG5jb25zdCBBbmltYXRpb24gPSByZXF1aXJlKCcuL2xpYnMvZnVuY3Rpb25zL1JlcXVlc3RBbmltYXRpb25GcmFtZScpO1xuY29uc3QgR2FtZSA9IHJlcXVpcmUoJy4vZ2FtZS5qcycpO1xuY2xhc3MgQXBwIHtcbiAgICBjb25zdHJ1Y3RvcihjYW52YXMpIHtcblxuICAgICAgICB0aGlzLncgPSB3aW5kb3cuaW5uZXJXaWR0aDtcbiAgICAgICAgdGhpcy5oID0gd2luZG93LmlubmVySGVpZ2h0O1xuXG4gICAgICAgIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdyZXNpemUnLCBlID0+IHtcbiAgICAgICAgICAgIHRoaXMudyA9IHdpbmRvdy5pbm5lcldpZHRoO1xuICAgICAgICAgICAgdGhpcy5oID0gd2luZG93LmlubmVySGVpZ2h0O1xuICAgICAgICAgICAgY2FudmFzLndpZHRoID0gdGhpcy53O1xuICAgICAgICAgICAgY2FudmFzLmhlaWdodCA9IHRoaXMuaDtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgY2FudmFzLndpZHRoID0gdGhpcy53O1xuICAgICAgICBjYW52YXMuaGVpZ2h0ID0gdGhpcy5oO1xuICAgICAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG5cbiAgICAgICAgaWYgKEdhbWUubWFpbiAmJiB0eXBlb2YgR2FtZS5tYWluID09ICdmdW5jdGlvbicpIEdhbWUubWFpbih0aGlzLmN0eCwgdGhpcy53LCB0aGlzLmgpO1xuICAgICAgICBBbmltYXRpb24uRmFjdG9yeSh0aGlzLmxvb3AuYmluZCh0aGlzKSk7XG4gICAgfVxuXG4gICAgbG9vcCgpIHtcbiAgICAgICAgdGhpcy5jdHguY2xlYXJSZWN0KDAsIDAsIHRoaXMudywgdGhpcy5oKTtcbiAgICAgICAgR2FtZS5sb29wKHRoaXMuY3R4LCB0aGlzLncsIHRoaXMuaCk7XG4gICAgfVxufVxuXG5uZXcgQXBwKGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJ2NhbnZhcycpKTsiXSwiZmlsZSI6ImFwcC5qcyJ9
