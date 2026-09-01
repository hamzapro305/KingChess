"use client";

import { useAppSelector } from "@/Redux/Hooks";
import { CHESS_ACTIONS } from "@/Redux/slices/ChessSlice";
import { ARROW_ACTIONS } from "@/Redux/slices/ArrowSlice";
import { motion } from "framer-motion-3d";
import { Text } from "@react-three/drei";
import React, { FC, useState } from "react";
import { useDispatch } from "react-redux";
import { ChessRulesHelper, SquareT } from "@/utils/Chess/Functions";
import { ThreeEvent } from "@react-three/fiber";

type Props = {
    Sq: SquareT;
};
const Square: FC<Props> = ({ Sq }) => {
    const { isWhite, loc, pos } = Sq;
    const { selected, instance, squareSize } = useAppSelector((s) => s.Chess);
    const [Hover, setHover] = useState(false);
    const dispatch = useDispatch();

    const item = instance.get(loc);

    // Board center se relative position
    const position: [number, number, number] = [
        (pos[1] - 3.5) * squareSize,
        (3.5 - pos[0]) * squareSize,
        -4,
    ];

    const isAttacked = () => {
        return (
            ChessRulesHelper.isLegalMove(selected, instance, loc) &&
            ChessRulesHelper.getLegalMoves(selected, instance).filter(
                (x) => x?.captured && x.captured === item?.type
            ).length
        );
    };

    const onClick = (event: ThreeEvent<PointerEvent>) => {
        if (event.button !== 0) return;

        if (selected && ChessRulesHelper.isLegalMove(selected, instance, loc)) {
            instance.move({ from: selected, to: loc });
            dispatch(CHESS_ACTIONS.initChess(instance.fen()));
            dispatch(CHESS_ACTIONS.setSelected(null));
            dispatch(ARROW_ACTIONS.clearArrows());
        } else if (item && item?.color == instance.turn()) {
            dispatch(CHESS_ACTIONS.setSelected(loc));
        } else if (item && item?.color != instance.turn()) {
            dispatch(CHESS_ACTIONS.setSelected(null));
        } else {
            dispatch(CHESS_ACTIONS.setSelected(null));
        }
    };
    const getBoxColor = () => {
        if (isThisPieceIsKingAndChecked()) {
            // Check Color
            return "#ff0000";
        }
        let color = isWhite ? "#ffffff" : "#769656";
        if (Hover) {
            // On Hover
            color = "#c1e3f7";
        }
        if (ChessRulesHelper.isLegalMove(selected, instance, loc)) {
            // For Possible for this piece
            color = "#c1e3f7";
        }
        if (isAttacked()) {
            // If this piece is attacked by selected piece
            color = "#ff0000";
        }
        if (selected === loc) {
            // If This Piece Selected
            color = "#0000ff";
        }

        return color;
    };

    const isThisPieceIsKingAndChecked = () => {
        if (
            item.type &&
            item.type === "k" &&
            instance.inCheck() &&
            item.color === instance.turn()
        ) {
            return true;
        }
    };

    return (
        <group
            position={position}
            onPointerEnter={() => setHover(true)}
            onPointerLeave={() => setHover(false)}
        >
            <mesh onPointerUp={onClick}>
                <boxGeometry args={[squareSize, squareSize, 1]} />
                <motion.meshStandardMaterial
                    animate={{
                        color: getBoxColor(),
                    }}
                />
            </mesh>
            <Text
                scale={[-6, 6, 6]}
                position={[5 + squareSize / 3, 3 - squareSize / 3, -16]}
                fontSize={1}
                color="black"
                anchorX="left"
                anchorY="top"
            >
                {loc}
            </Text>
            {ChessRulesHelper.isLegalMove(selected, instance, loc) && !isAttacked() && (
                <PieceBall Hover={Hover} />
            )}
        </group>
    );
};

const PieceBall: FC<{ Hover: boolean }> = ({
    Hover,
}) => {
    const { squareSize } = useAppSelector((s) => s.Chess);
    return (
        <motion.mesh
            position={[0, 0, -12]}
            animate={{ scale: Hover ? 0.3 : 0.2 }}
            initial={{ scale: 0 }}
        >
            <sphereGeometry args={[squareSize - 15, 6, 6]} />
            <motion.meshStandardMaterial
                transparent={true}
                animate={{
                    color: "#878585",
                    opacity: Hover ? 1 : 0.3,
                }}
            />
        </motion.mesh>
    );
};

export default Square;
