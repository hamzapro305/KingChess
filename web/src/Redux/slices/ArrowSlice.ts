import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Square } from "chess.js";

export type Arrow = {
    from: Square;
    to: Square;
};

type ArrowState = {
    arrows: Arrow[];
    drawingFrom: Square | null;
    previewArrow: Arrow | null;
};

const initialState: ArrowState = {
    arrows: [],
    drawingFrom: null,
    previewArrow: null,
};

const ArrowSlice = createSlice({
    name: "Arrow",
    initialState,

    reducers: {
        startDrawing: (
            state,
            action: PayloadAction<Square>
        ) => {
            state.drawingFrom = action.payload;
            state.previewArrow = null;
        },

        updatePreview: (
            state,
            action: PayloadAction<Square>
        ) => {
            if (
                !state.drawingFrom ||
                state.drawingFrom === action.payload
            ) {
                state.previewArrow = null;
                return;
            }

            state.previewArrow = {
                from: state.drawingFrom,
                to: action.payload,
            };
        },

        finishDrawing: (
            state,
            action: PayloadAction<Square>
        ) => {
            const from = state.drawingFrom;
            const to = action.payload;

            if (!from || from === to) {
                state.drawingFrom = null;
                state.previewArrow = null;
                return;
            }

            const existingIndex =
                state.arrows.findIndex(
                    (arrow) =>
                        arrow.from === from &&
                        arrow.to === to
                );

            if (existingIndex >= 0) {
                // Toggle existing arrow
                state.arrows.splice(existingIndex, 1);
            } else {
                state.arrows.push({
                    from,
                    to,
                });
            }

            state.drawingFrom = null;
            state.previewArrow = null;
        },

        cancelDrawing: (state) => {
            state.drawingFrom = null;
            state.previewArrow = null;
        },

        clearArrows: (state) => {
            state.arrows = [];
            state.drawingFrom = null;
            state.previewArrow = null;
        },
    },
});

export const ARROW_ACTIONS = ArrowSlice.actions;

export default ArrowSlice.reducer;