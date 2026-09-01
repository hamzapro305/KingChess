import { useTexture } from "@react-three/drei";
import { motion } from "framer-motion-3d";
import { PiecesImages } from "@/utils/Chess/PieceImages";
import { useGesture } from "react-use-gesture";
import { CHESS_ACTIONS } from "@/Redux/slices/ChessSlice";
import { ARROW_ACTIONS } from "@/Redux/slices/ArrowSlice";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { FC, useMemo, useState } from "react";
import {
    ChessBoardHelper,
    CanvasCoordinator,
    ChessRulesHelper,
    SquareT,
} from "@/utils/Chess/Functions";

type PieceImageProps = {
    boardSize: number;
    Sq: SquareT;
};

const PieceImageComp: FC<PieceImageProps> = ({
    Sq,
    boardSize,
}) => {
    const dispatch = useAppDispatch();

    const {
        instance,
        squareSize,
        isPlayerWhite,
    } = useAppSelector((s) => s.Chess);

    const { loc } = Sq;

    const item = instance.get(loc);

    if (!item) {
        return null;
    }

    const pieceTexture = useTexture(
        PiecesImages[item.type][item.color]
    );

    const pieceSize = squareSize - 4;

    /*
     * Calculate the center position of this square.
     * This is derived from row/col and board size,
     * so we don't need to store x/y inside SquareT.
     */
    const squarePosition = useMemo(
        () => ChessBoardHelper.getSquarePosition(Sq, boardSize),
        [Sq, boardSize]
    );

    const [position, setPosition] = useState<
        [number, number]
    >([
        squarePosition.x,
        squarePosition.y,
    ]);

    const resetPosition = () => {
        setPosition([
            squarePosition.x,
            squarePosition.y,
        ]);
    };

    const bind: any = useGesture({
        onDragStart: ({ event }) => {
            if (event.button == 2) {
                return;
            }

            /*
             * Don't allow dragging opponent's piece.
             */
            if (item.color !== instance.turn()) {
                return;
            }

            dispatch(
                CHESS_ACTIONS.setSelected(loc)
            );
        },

        onDrag: ({
            movement: [mx, my],
            event
        }) => {
            if (event.buttons == 2) return;
            /*
             * Safety check.
             */
            if (item.color !== instance.turn()) {
                return;
            }

            /*
             * movement gives us the drag delta.
             *
             * X:
             *     original X + mouse movement
             *
             * Y:
             *     Three.js Y axis is opposite to screen Y,
             *     therefore we subtract mouse Y movement.
             */
            const x = squarePosition.x - mx;
            const y = squarePosition.y - my;

            setPosition([x, y]);
        },

        onDragEnd: ({
            movement: [mx, my],
            event
        }) => {
            if (event.button == 2) {
                resetPosition();
                return;
            }
            /*
             * Safety check.
             */
            if (item.color !== instance.turn()) {
                resetPosition();

                dispatch(
                    CHESS_ACTIONS.setSelected(null)
                );

                return;
            }

            /*
             * Final world position of the dragged piece.
             */
            const x = squarePosition.x - mx;
            const y = squarePosition.y - my;

            /*
             * Find which chess square contains
             * the dropped position.
             */
            const square = CanvasCoordinator.checkSquareRange(
                isPlayerWhite,
                boardSize,
                x,
                y
            );

            /*
             * Dropped outside the board.
             */
            if (!square) {
                resetPosition();

                dispatch(
                    CHESS_ACTIONS.setSelected(null)
                );

                return;
            }

            /*
             * Piece was dropped on its original square.
             */
            if (square.loc === loc) {
                resetPosition();

                dispatch(
                    CHESS_ACTIONS.setSelected(null)
                );

                return;
            }

            /*
             * Check whether the move is legal.
             */
            if (
                ChessRulesHelper.isLegalMove(
                    loc,
                    instance,
                    square.loc
                )
            ) {
                instance.move({
                    from: loc,
                    to: square.loc,
                });

                /*
                 * Update Redux with the new board state.
                 */
                dispatch(
                    CHESS_ACTIONS.initChess(
                        instance.fen()
                    )
                );
                dispatch(ARROW_ACTIONS.clearArrows());
            }

            /*
             * Always reset local drag position.
             *
             * After a successful move, Redux will re-render
             * the piece using its new square position.
             */
            resetPosition();

            dispatch(
                CHESS_ACTIONS.setSelected(null)
            );
        }
    });

    return (
        <motion.mesh
            {...bind()}
            whileHover={{
                scale: 1.1,
            }}
            position={[
                position[0],
                position[1],
                -8,
            ]}
        >
            <boxGeometry
                args={[
                    pieceSize,
                    pieceSize,
                    1,
                ]}
            />

            <meshStandardMaterial
                map={pieceTexture}
                transparent
                alphaTest={0.1}
            />
        </motion.mesh>
    );
};

export default PieceImageComp;