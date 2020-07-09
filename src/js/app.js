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