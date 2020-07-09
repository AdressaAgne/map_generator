class ChessColor {
    constructor(color) {
        this.color = color;
    }
}

class ChessWhite extends ChessColor {
    constructor() {
        super('ffffff');
        this.step = -1;
    }
}

class ChessBlack extends ChessColor {
    constructor() {
        super('000000');
        this.step = 1;
    }
}

const black = new ChessBlack();
const white = new ChessWhite();

module.exports = {
    black,
    white
};