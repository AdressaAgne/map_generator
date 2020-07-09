const {
    black,
    white
} = require('./pices/ChessColor');
const Pawn      = require('./pices/Pawn');
const Rook      = require('./pices/Rook');
const Knight    = require('./pices/Knight');
const Bishop    = require('./pices/Bishop');
const Queen     = require('./pices/Queen');
const King      = require('./pices/King');


class Chess {
    constructor() {
        this.board = [
            [new Rook(black), new Knight(black), new Bishop(black), new Queen(black), new King(black), new Bishop(black), new Knight(black), new Rook(black)],
            [new Pawn(black), new Pawn(black), new Pawn(black), new Pawn(black), new Pawn(black), new Pawn(black), new Pawn(black), new Pawn(black)],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [null, null, null, null, null, null, null, null],
            [new Pawn(white), new Pawn(white), new Pawn(white), new Pawn(white), new Pawn(white), new Pawn(white), new Pawn(white), new Pawn(white)],
            [new Rook(white), new Knight(white), new Bishop(white), new Queen(white), new King(white), new Bishop(white), new Knight(white), new Rook(white)],
        ];

        for (let x = 0; x < this.board.length; x++) {
            for (let y = 0; y < this.board[x].length; y++) {
                if (this.board[x][y] !== null) {
                    this.board[x][y].moveTo(x, y);
                    this.board[x][y].setBoard(this);
                }
            }
        }

        console.log(this.board);

    }

    move(x1, y1, x2, y2) {
        this.board[x1][y1].moveTo(x2, y2)
        this.board[x2][y2] = this.board[x1][y1];
        this.board[x1][y1] = null;
    }

}


module.exports = Chess;