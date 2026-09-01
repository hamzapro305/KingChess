import { useGesture } from "react-use-gesture";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { ARROW_ACTIONS } from "@/Redux/slices/ArrowSlice";
import {
    CanvasCoordinator,
} from "@/utils/Chess/Functions";
import { CHESS_ACTIONS } from "@/Redux/slices/ChessSlice";

const useArrowDragHook = () => {
    const dispatch = useAppDispatch();

    const {
        boardSize,
        isPlayerWhite,
    } = useAppSelector((s) => s.Chess);

    const {
        drawingFrom,
    } = useAppSelector((s) => s.Arrow);

    const eventToSquare = (
        event: PointerEvent
    ) => {
        const threeEvent = event as any;

        if (!threeEvent.point) {
            return null;
        }

        return CanvasCoordinator.checkSquareRange(
            isPlayerWhite,
            boardSize,
            threeEvent.point.x,
            threeEvent.point.y
        );
    };

    const bind: any = useGesture({
        onDragStart: ({ event }) => {
            const pointer = event as PointerEvent;

            // Right click only
            if (pointer.button !== 2) {
                dispatch(ARROW_ACTIONS.clearArrows());
                return;
            }

            dispatch(CHESS_ACTIONS.setSelected(null));

            const square =
                eventToSquare(pointer);

            if (!square) {
                return;
            }

            dispatch(
                ARROW_ACTIONS.startDrawing(
                    square.loc
                )
            );
        },

        onDrag: ({ event }) => {
            if (!drawingFrom) {
                return;
            }

            const square =
                eventToSquare(
                    event as PointerEvent
                );

            if (!square) {
                return;
            }

            if (
                square.loc === drawingFrom
            ) {
                dispatch(
                    ARROW_ACTIONS.updatePreview(
                        square.loc
                    )
                );

                return;
            }

            dispatch(
                ARROW_ACTIONS.updatePreview(
                    square.loc
                )
            );
        },

        onDragEnd: ({ event }) => {
            if (!drawingFrom) {
                return;
            }

            const square =
                eventToSquare(
                    event as PointerEvent
                );

            if (!square) {
                dispatch(
                    ARROW_ACTIONS.cancelDrawing()
                );

                return;
            }

            // Same square = clear/toggle
            if (
                square.loc === drawingFrom
            ) {
                dispatch(
                    ARROW_ACTIONS.clearArrows()
                );

                return;
            }

            dispatch(
                ARROW_ACTIONS.finishDrawing(
                    square.loc
                )
            );
        },
    });

    return bind;
};

export default useArrowDragHook;