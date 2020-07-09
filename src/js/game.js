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
const tileSize = 8;
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
const renderDistance = 4;
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
    log('Generating chucnk', x, y);
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