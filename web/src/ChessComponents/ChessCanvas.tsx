"use client";

import { Canvas } from "@react-three/fiber";
import { FC, useRef } from "react";
import Board from "./Board";
import ArrowLayer from "./ArrowLayer";
import { useAppSelector } from "@/Redux/Hooks";
import { OrbitControls } from "@react-three/drei";
import PlaneForArrows from "./PlaneForArrows";

const ChessCanvas: FC<{}> = ({}) => {
  const { boardSize } = useAppSelector((s) => s.Chess);
  const canvasRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={canvasRef}
      style={{ width: boardSize, height: boardSize }}
      onContextMenu={(e) => e.preventDefault()}
      className="relative rounded-xl overflow-hidden shadow-2xl border border-slate-700/50 bg-slate-900/40 backdrop-blur-sm select-none"
    >
      <Canvas
        orthographic={true}
        camera={{
          position: [0, 0, -1000],
          left: -1 * (boardSize / 2),
          right: boardSize / 2,
          top: boardSize / 2,
          bottom: -1 * (boardSize / 2),
          near: 0.1,
          far: 2000,
        }}
        gl={{
          alpha: true,
        }}
      >
        <Board />
        {/* <OrbitControls /> */}
        <ArrowLayer />
        <PlaneForArrows />
        <ambientLight intensity={0.8} position={[0, 0, 20]} />
        <directionalLight position={[10, 10, 5]} />
      </Canvas>
    </div>
  );
};

export default ChessCanvas;
