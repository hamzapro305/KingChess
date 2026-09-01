import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Chess, Square } from "chess.js";

const SIZE = 500;

type init = {
    instance: Chess;
    selected: Square | null;
    boardSize: number;
    squareSize: number;
    isPlayerWhite: boolean;
};
const initialState: init = {
    instance: new Chess(),
    selected: null,
    boardSize: SIZE,
    squareSize: SIZE / 8,
    isPlayerWhite: false,
};

const Slice = createSlice({
    name: "Chess",
    initialState,
    reducers: {
        initChess: (state, action: PayloadAction<string | undefined>) => {
            state.instance = new Chess(action.payload);
        },
        setSelected: (state, action: PayloadAction<Square | null>) => {
            state.selected = action.payload;
        },
        setIsPlayerWhite: (state, action: PayloadAction<boolean>) => {
            state.isPlayerWhite = action.payload;
        },
        undoMove: (state) => {
            state.instance.undo();
            state.instance = new Chess(state.instance.fen());
            state.selected = null;
        },
        resetGame: (state) => {
            state.instance = new Chess();
            state.selected = null;
        }
    },
});

export const CHESS_ACTIONS = Slice.actions;

export default Slice.reducer;
