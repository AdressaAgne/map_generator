const log = console.log;

const {
    Animate,
    AnimationsLoop
} = require('./Animation');
const Button = require('./Button');

let buttons = [];



const paddingV = 20;
const paddingH = paddingV;

let time = 0;


const Chunk = require('./Objects/Chunk');
let chunks = [];
Chunk.seed();

/*
buttons.push(Button.Factory('Seed', 0, 0, e => {

}));
*/

let player = {x : 0, y : 0};

module.exports = {
    main: (ctx, w, h) => {
        const chunkSize = 32;
        const tileSize = 4;
        for (let x = 0; x < Math.ceil(w / (chunkSize * tileSize)); x++) {
            for (let y = 0; y < Math.ceil(h / (chunkSize * tileSize)); y++) {
                console.log('generating chunk');
                chunks.push(new Chunk(x, y, chunkSize, chunkSize, tileSize));
            }
        }
    },
    loop: (ctx, w, h) => {
        time++;
        // background
        ctx.fillStyle = "#000000";
        ctx.fillRect(0, 0, w, h);

        let drawIndex = 0;
        const Pencil = (cls, x = 0, y = 0, rotate = 0) => {

            cls.setDrawIndex(drawIndex++);
            ctx.drawImage(cls.loop(x, y), x, y);

            return cls;
        }

        AnimationsLoop();

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            Pencil(chunk, chunk.innerX * chunk.w, chunk.innerY * chunk.h);
        }

        for (let i = 0; i < buttons.length; i++) {
            const button = buttons[i];
            Pencil(button, w - button.w - paddingH, h - (button.h * (i + 1)) - (paddingV * (i + 1)));
        }

    }
}