"use client";

import { ChessBoardHelper } from "@/utils/Chess/Functions";
import React, { FC, Fragment, useMemo } from "react";
import Square from "./Square";
import { useAppSelector } from "@/Redux/Hooks";
import PieceImageComp from "./PieceImageComp";
import useArrowDragHook from "@/hooks/useArrowDragHook";
type Props = {

};
const Board: FC<Props> = ({  }) => {
    const { instance, boardSize, isPlayerWhite } = useAppSelector((s) => s.Chess);
    
    const AllSquares = useMemo(() => ChessBoardHelper.createSquares(isPlayerWhite), [isPlayerWhite]);


    const arrowBind = useArrowDragHook();

    return (
        <group {...arrowBind}>
            <mesh position={[0, 0, 0]}>
                <boxGeometry args={[boardSize, boardSize, 1]} />
                <meshStandardMaterial />
            </mesh>
            {AllSquares.map((sq) => {
                const item = instance.get(sq.loc);
                const pieceKey = `${sq.pos[0]}_${sq.pos[1]}_${boardSize}`;
                return (
                    <Fragment key={pieceKey}>
                        <Square Sq={sq}  />
                        {item?.type && (
                            <PieceImageComp
                                
                                boardSize={boardSize}
                                Sq={sq}
                            />
                        )}
                    </Fragment>
                );
            })}
        </group>
    );
};

export default Board;
