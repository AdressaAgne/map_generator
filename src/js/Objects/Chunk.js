const Canvas = require('../Canvas');
const BasicController = require('../BasicController');

const perlin = require('../funcs/perlin');



module.exports = class Chunk extends BasicController {
    constructor(x, y, w = 32, h = 32, tileSize = 10) {
        super();

        this.map = new Uint16Array();
        
        this.innerX = x;
        this.innerY = y;
        this.x = x;
        this.y = y;
        this.octaves = 4;

        this.innerW = w;
        this.innerH = h;
        this.w = w * tileSize;
        this.h = h * tileSize;
        this.tileSize = tileSize;
        this.scale = 200;

        this.levels = [
            {
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
            }
        ]
        this.maxLevelValue = this.levels.reduce((prev, current) => prev + current.weight, 0);
        this.vars = ['coords', 'biome'];
        this.map = this.generateMap();
        console.log(this.map);
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
        for (let i = 0; i < this.levels.length; i++) {
            const value = this.levels[i].weight;
            if (height <= (h += value)) return i;
        }
        return this.levels.length - 1;
    }

    generateMap() {
        let map = [];
        const l = this.vars.length;
        for (let i = 0; i < (this.innerW * this.innerH * l); i += l) {
            const index = Math.floor(i / l);
            const x = index % this.innerW + (this.innerX * this.innerW);
            const y = index / this.innerW + (this.innerY * this.innerH);
            let z = 0;

            const gain = 0.5;
            const lacunarity = 2;

            let frequency = 1.0
            let amplitude = gain;

            for (let j = 0; j < this.octaves; ++j) {
                z += Math.abs(perlin.simplex2((x / this.scale) * frequency, (y / this.scale) * frequency)) * amplitude;
                frequency *= lacunarity;
                amplitude *= gain;
            }

            map[i] = Math.floor(z * this.maxLevelValue);
            map[i + 1] = 0;

        }
        return map;
    }

    draw() {
        const l = this.vars.length;
        this.canvas = Canvas(this.innerW * this.tileSize, this.innerH * this.tileSize, (ctx, img) => {
            for (let i = 0; i < this.map.length; i += l) {
                const index = Math.floor(i / l);
                const biome = this.map[i + 1];
                const x = Math.floor(index % this.innerW);
                const y = Math.floor(index / this.innerW);

                const level = this.getLevel(this.map[i]);
                ctx.fillStyle = this.levels[level].color;
                ctx.fillRect(x * this.tileSize, y * this.tileSize, this.tileSize, this.tileSize);
            }
        });
    }
}