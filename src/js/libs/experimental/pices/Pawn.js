const ChessPice = require('./ChessPice');

module.exports = class Pawn extends ChessPice {

    constructor(color) {
        super(color);
    }

    move(x, y) {
        if (this.isInsideBoard(x, y)) {



        }
        return false;
    }

}