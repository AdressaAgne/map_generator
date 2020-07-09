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