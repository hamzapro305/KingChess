"use client";

import React, {
    FC,
    useMemo,
    useState,
    useEffect,
} from "react";
import * as THREE from "three";
import { motion } from "framer-motion-3d";
import { Square } from "chess.js";
import { useAppSelector } from "@/Redux/Hooks";
import { ChessBoardHelper } from "@/utils/Chess/Functions";

type ArrowMeshProps = {
    from: Square;
    to: Square;
    customColor?: string;
};

const ArrowMesh: FC<ArrowMeshProps> = ({
    from,
    to,
    customColor,
}) => {
    const {
        boardSize,
        isPlayerWhite,
        squareSize,
    } = useAppSelector((s) => s.Chess);

    const [savedColor, setSavedColor] =
        useState("#facc15");

    useEffect(() => {
        const saved =
            localStorage.getItem("arrowColor");

        if (saved) {
            setSavedColor(saved);
        }
    }, []);

    const color =
        customColor || savedColor;

    const posData = useMemo(() => {
        const fromSq =
            ChessBoardHelper.squareToSquareT(
                from,
                isPlayerWhite
            );

        const toSq =
            ChessBoardHelper.squareToSquareT(
                to,
                isPlayerWhite
            );

        const fromPos =
            ChessBoardHelper.getSquarePosition(
                fromSq,
                boardSize
            );

        const toPos =
            ChessBoardHelper.getSquarePosition(
                toSq,
                boardSize
            );

        const dx =
            toPos.x - fromPos.x;

        const dy =
            toPos.y - fromPos.y;

        const length = Math.sqrt(
            dx * dx + dy * dy
        );

        const ux = dx / length;
        const uy = dy / length;

        const offsetStart =
            squareSize * 0.25;

        const offsetEnd =
            squareSize * 0.25;

        const shortenedLength = Math.max(
            0.1,
            length -
                offsetStart -
                offsetEnd
        );

        const startX =
            fromPos.x +
            ux * offsetStart;

        const startY =
            fromPos.y +
            uy * offsetStart;

        const angle =
            Math.atan2(dy, dx);

        const shaftWidth =
            squareSize * 0.15;

        const headLength =
            squareSize * 0.35;

        const headWidth =
            squareSize * 0.45;

        const shaftLength =
            Math.max(
                0.01,
                shortenedLength -
                    headLength
            );

        return {
            startX,
            startY,
            angle,
            shaftLength,
            shaftWidth,
            headLength,
            headWidth,
        };
    }, [
        from,
        to,
        boardSize,
        isPlayerWhite,
        squareSize,
    ]);

    const arrowheadShape = useMemo(() => {
        const shape =
            new THREE.Shape();

        shape.moveTo(
            0,
            posData.headWidth / 2
        );

        shape.lineTo(
            posData.headLength,
            0
        );

        shape.lineTo(
            0,
            -posData.headWidth / 2
        );

        shape.closePath();

        return shape;
    }, [
        posData.headLength,
        posData.headWidth,
    ]);

    return (
        <motion.group
            position={[
                posData.startX,
                posData.startY,
                -10,
            ]}
            rotation={[
                0,
                0,
                posData.angle,
            ]}
            initial={{
                scale: 0,
                opacity: 0,
            }}
            animate={{
                scale: 1,
                opacity: 1,
            }}
            transition={{
                duration: 0.15,
                ease: "easeOut",
            }}
        >
            {/* Arrow Shaft */}
            <mesh
                position={[
                    posData.shaftLength / 2,
                    0,
                    0,
                ]}
            >
                <planeGeometry
                    args={[
                        posData.shaftLength,
                        posData.shaftWidth,
                    ]}
                />

                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.65}
                    side={THREE.DoubleSide}
                />
            </mesh>

            {/* Arrow Head */}
            <mesh
                position={[
                    posData.shaftLength,
                    0,
                    0,
                ]}
            >
                <shapeGeometry
                    args={[arrowheadShape]}
                />

                <meshBasicMaterial
                    color={color}
                    transparent
                    opacity={0.65}
                    side={THREE.DoubleSide}
                />
            </mesh>
        </motion.group>
    );
};

export default ArrowMesh;