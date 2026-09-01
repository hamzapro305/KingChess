import { Chess, Square, SQUARES } from "chess.js";

export type SquareT = {
    loc: Square;
    pos: number[];
    isWhite: boolean;
};

export class ChessBoardHelper {
    static getBoardSquaresNames(isWhite: boolean) {
        const arr = Array.from({ length: 8 }, (_, i) => (8 - i).toString());
        const ranks = isWhite ? arr : arr.reverse();
        if (isWhite) {
            return ranks.map((rank) =>
                SQUARES.filter((square) => square.includes(rank)).reverse()
            );
        } else {
            return ranks.map((rank) =>
                SQUARES.filter((square) => square.includes(rank))
            );
        }
    }

    static createSquares(isPlayerWhite: boolean): SquareT[] {
        const Squares: SquareT[] = [];
        const genArr = this.getBoardSquaresNames(isPlayerWhite);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                const loc = genArr[row][col];
                const Square: SquareT = {
                    loc: loc,
                    pos: [row, col],
                    isWhite: (row + col) % 2 === 0,
                };
                Squares.push(Square);
            }
        }
        return Squares;
    }

    static getSquarePosition(sq: SquareT, boardSize: number) {
        const squareSize = boardSize / 8;
        return {
            x: (sq.pos[1] - 3.5) * squareSize,
            y: (3.5 - sq.pos[0]) * squareSize,
        };
    }

    static squareToSquareT(sq: Square, isPlayerWhite: boolean): SquareT {
        const genArr = this.getBoardSquaresNames(isPlayerWhite);
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (genArr[row][col] === sq) {
                    return {
                        loc: sq,
                        pos: [row, col],
                        isWhite: (row + col) % 2 === 0,
                    };
                }
            }
        }
        return {
            loc: sq,
            pos: [0, 0],
            isWhite: true,
        };
    }
}

export class CanvasCoordinator {
    static checkSquareRange(
        isPlayerWhite: boolean,
        boardSize: number,
        x: number,
        y: number
    ): SquareT | undefined {
        const squareSize = boardSize / 8;

        const col = Math.floor((x + boardSize / 2) / squareSize);
        const row = Math.floor((boardSize / 2 - y) / squareSize);

        if (row < 0 || row >= 8 || col < 0 || col >= 8) {
            return undefined;
        }

        const genArr = ChessBoardHelper.getBoardSquaresNames(isPlayerWhite);

        return {
            loc: genArr[row][col],
            pos: [row, col],
            isWhite: (row + col) % 2 === 0,
        };
    }
}

export class ChessRulesHelper {
    static getTurn(instance: Chess) {
        const turn = instance.turn();
        return turn == "w" ? "white" : "black";
    }

    static getLegalMoves(selected: Square | null, instance: Chess) {
        if (selected) {
            return instance.moves({
                verbose: true,
                square: selected,
            });
        }
        return [];
    }

    static isLegalMove(selected: any, instance: Chess, location: Square) {
        return this.getLegalMoves(selected, instance).filter((x) => x.to == location).length > 0;
    }
}