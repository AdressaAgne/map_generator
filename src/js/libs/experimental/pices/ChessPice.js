module.exports = class ChessPice {
    constructor(color) {
        this.color = color;
        this.x = 0;
        this.y = 0;
    }

    moveTo(x, y) {
        this.x = x;
        this.y = y;
    }

    isInsideBoard(x, y) {
        if (x > 7 || y > 7 || x < 0 || y < 0) return false;
        return true;
    }

    pos(x, y) {
        return this.board[x][y];
    }

    setBoard(board) {
        this.board = board;
    }
}
