"use client";

import ChessCanvas from "@/ChessComponents/ChessCanvas";
import React, { useEffect, useState, useMemo } from "react";
import Header from "@/WebComponents/Header";
import { useAppDispatch, useAppSelector } from "@/Redux/Hooks";
import { CHESS_ACTIONS } from "@/Redux/slices/ChessSlice";

// Helper to format seconds to MM:SS
const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
};

export default function Page() {
    const dispatch = useAppDispatch();
    const { instance, isPlayerWhite } = useAppSelector((s) => s.Chess);

    // Turn indicator: "w" or "b"
    const currentTurn = instance.turn();
    const isGameOver = instance.isGameOver();

    // 10 minute chess timers
    const [whiteTime, setWhiteTime] = useState(600);
    const [blackTime, setBlackTime] = useState(600);

    // Active Timer effect
    useEffect(() => {
        if (isGameOver) return;
        const interval = setInterval(() => {
            if (currentTurn === "w") {
                setWhiteTime((prev) => (prev > 0 ? prev - 1 : 0));
            } else {
                setBlackTime((prev) => (prev > 0 ? prev - 1 : 0));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [currentTurn, isGameOver]);

    // Reset timers when game is reset
    const handleReset = () => {
        dispatch(CHESS_ACTIONS.resetGame());
        setWhiteTime(600);
        setBlackTime(600);
    };

    const handleUndo = () => {
        dispatch(CHESS_ACTIONS.undoMove());
    };

    const handleFlip = () => {
        dispatch(CHESS_ACTIONS.setIsPlayerWhite(!isPlayerWhite));
    };

    const handleRandomMove = () => {
        const moves = instance.moves();
        if (moves.length > 0) {
            const move = moves[Math.floor(Math.random() * moves.length)];
            instance.move(move);
            dispatch(CHESS_ACTIONS.initChess(instance.fen()));
        }
    };

    // Calculate captured pieces
    const capturedPieces = useMemo(() => {
        const initialCounts: Record<string, { w: number; b: number }> = {
            p: { w: 8, b: 8 },
            r: { w: 2, b: 2 },
            n: { w: 2, b: 2 },
            b: { w: 2, b: 2 },
            q: { w: 1, b: 1 },
            k: { w: 1, b: 1 },
        };

        const currentCounts: Record<string, { w: number; b: number }> = {
            p: { w: 0, b: 0 },
            r: { w: 0, b: 0 },
            n: { w: 0, b: 0 },
            b: { w: 0, b: 0 },
            q: { w: 0, b: 0 },
            k: { w: 0, b: 0 },
        };

        // Scan the board
        const board = instance.board();
        for (const row of board) {
            for (const square of row) {
                if (square) {
                    currentCounts[square.type][square.color] += 1;
                }
            }
        }

        const capturedW: string[] = [];
        const capturedB: string[] = [];

        Object.keys(initialCounts).forEach((type) => {
            const diffW = initialCounts[type].w - currentCounts[type].w;
            const diffB = initialCounts[type].b - currentCounts[type].b;

            // If white pieces are missing, black captured them
            for (let i = 0; i < diffW; i++) {
                capturedB.push(type.toUpperCase());
            }
            // If black pieces are missing, white captured them
            for (let i = 0; i < diffB; i++) {
                capturedW.push(type);
            }
        });

        return { white: capturedW, black: capturedB };
    }, [instance]);

    // Format moves history list
    const rawHistory = instance.history();
    const moveHistoryList = useMemo(() => {
        const list = [];
        for (let i = 0; i < rawHistory.length; i += 2) {
            list.push({
                num: Math.floor(i / 2) + 1,
                white: rawHistory[i],
                black: rawHistory[i + 1] || "",
            });
        }
        return list;
    }, [rawHistory]);

    // Determine status message
    let statusTitle = "Active Match";
    let statusMessage = `${currentTurn === "w" ? "White" : "Black"} to move`;
    let statusColor = "bg-emerald-500";

    if (instance.inCheck()) {
        statusTitle = "In Check!";
        statusMessage = `${currentTurn === "w" ? "White" : "Black"} King is under attack`;
        statusColor = "bg-amber-500 animate-pulse";
    }
    if (instance.isCheckmate()) {
        statusTitle = "Checkmate!";
        statusMessage = `Game Over. ${currentTurn === "w" ? "Black" : "White"} wins!`;
        statusColor = "bg-rose-500";
    } else if (instance.isDraw()) {
        statusTitle = "Draw";
        statusMessage = "The game ended in a draw";
        statusColor = "bg-slate-500";
    }

    // Players setup based on orientation
    const topPlayer = isPlayerWhite
        ? { name: "Opponent (Black)", avatar: "🤖", time: blackTime, color: "b", captured: capturedPieces.black }
        : { name: "Player (White)", avatar: "👤", time: whiteTime, color: "w", captured: capturedPieces.white };

    const bottomPlayer = isPlayerWhite
        ? { name: "Player (White)", avatar: "👤", time: whiteTime, color: "w", captured: capturedPieces.white }
        : { name: "Opponent (Black)", avatar: "🤖", time: blackTime, color: "b", captured: capturedPieces.black };

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
            <Header />

            <main className="flex-1 flex flex-col lg:flex-row max-w-[1400px] w-full mx-auto p-4 lg:p-8 gap-8 items-center lg:items-start justify-center">
                {/* Chess Board Area */}
                <div className="flex flex-col gap-4 items-center">
                    {/* Top Player Card */}
                    <div className="w-[500px] flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                                {topPlayer.avatar}
                            </div>
                            <div>
                                <div className="font-semibold text-white flex items-center gap-2 text-sm">
                                    {topPlayer.name}
                                    {currentTurn === topPlayer.color && !isGameOver && (
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                    )}
                                </div>
                                <div className="flex gap-1 mt-1 text-[11px] text-slate-400 font-mono">
                                    {topPlayer.captured.length > 0 ? (
                                        topPlayer.captured.map((p, idx) => (
                                            <span key={idx} className="bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800/40 font-semibold">
                                                {p}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="opacity-40">No captures</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-lg font-bold font-mono tracking-wider border ${
                            currentTurn === topPlayer.color && !isGameOver
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800/40 text-slate-300 border-slate-700/30"
                        }`}>
                            {formatTime(topPlayer.time)}
                        </div>
                    </div>

                    {/* R3F Interactive Canvas */}
                    <div className="shadow-2xl shadow-emerald-950/20 rounded-xl overflow-hidden">
                        <ChessCanvas />
                    </div>

                    {/* Bottom Player Card */}
                    <div className="w-[500px] flex items-center justify-between bg-slate-900/60 border border-slate-800/80 rounded-xl p-4 backdrop-blur-md">
                        <div className="flex items-center gap-3">
                            <div className="text-2xl w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700">
                                {bottomPlayer.avatar}
                            </div>
                            <div>
                                <div className="font-semibold text-white flex items-center gap-2 text-sm">
                                    {bottomPlayer.name}
                                    {currentTurn === bottomPlayer.color && !isGameOver && (
                                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                                    )}
                                </div>
                                <div className="flex gap-1 mt-1 text-[11px] text-slate-400 font-mono">
                                    {bottomPlayer.captured.length > 0 ? (
                                        bottomPlayer.captured.map((p, idx) => (
                                            <span key={idx} className="bg-slate-850 px-1.5 py-0.5 rounded border border-slate-800/40 font-semibold">
                                                {p}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="opacity-40">No captures</span>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className={`px-3 py-1.5 rounded-lg text-lg font-bold font-mono tracking-wider border ${
                            currentTurn === bottomPlayer.color && !isGameOver
                                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                                : "bg-slate-800/40 text-slate-300 border-slate-700/30"
                        }`}>
                            {formatTime(bottomPlayer.time)}
                        </div>
                    </div>
                </div>

                {/* Game Sidebar Controls & Info Panel */}
                <div className="flex-grow w-full lg:max-w-[420px] flex flex-col gap-6">
                    {/* Active Match Status */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex items-center gap-4">
                        <div className={`w-3.5 h-3.5 rounded-full ${statusColor}`} />
                        <div>
                            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">{statusTitle}</h3>
                            <p className="text-white font-semibold text-lg mt-0.5">{statusMessage}</p>
                        </div>
                    </div>

                    {/* Live Game Controls */}
                    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col gap-4">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Game Actions</h3>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={handleReset}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-sm font-medium transition-all duration-200 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182m0-4.991v4.99" />
                                </svg>
                                New Game
                            </button>

                            <button
                                onClick={handleUndo}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-sm font-medium transition-all duration-200 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15 3 9m0 0 6-6M3 9h12a6 6 0 0 1 0 12h-3" />
                                </svg>
                                Undo Move
                            </button>

                            <button
                                onClick={handleFlip}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/60 text-sm font-medium transition-all duration-200 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                </svg>
                                Flip Board
                            </button>

                            <button
                                onClick={handleRandomMove}
                                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 hover:brightness-110 text-slate-950 font-bold shadow-lg shadow-emerald-500/10 text-sm transition-all duration-200 cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 0 0-3.7-3.7 48.656 48.656 0 0 0-7.324 0 4.006 4.006 0 0 0-3.7 3.7c-.017.22-.032.441-.046.662M19.5 12l3-3m-3 3-3-3m-12 3c0 1.232.046 2.453.138 3.662a4.006 4.006 0 0 0 3.7 3.7 48.656 48.656 0 0 0 7.324 0 4.006 4.006 0 0 0 3.7-3.7c.017-.22.032-.441.046-.662M4.5 12l3 3m-3-3-3 3" />
                                </svg>
                                Random Move
                            </button>
                        </div>
                    </div>

                    {/* Move History */}
                    <div className="flex-grow min-h-[250px] bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md flex flex-col">
                        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">Move Log</h3>
                        <div className="flex-1 overflow-y-auto max-h-[300px] custom-scrollbar pr-1">
                            {moveHistoryList.length > 0 ? (
                                <div className="grid grid-cols-12 gap-y-2 text-sm font-medium">
                                    {moveHistoryList.map((move) => (
                                        <React.Fragment key={move.num}>
                                            <div className="col-span-2 text-slate-500 font-mono">{move.num}.</div>
                                            <div className="col-span-5 text-slate-200 font-mono">{move.white}</div>
                                            <div className="col-span-5 text-slate-400 font-mono">{move.black}</div>
                                        </React.Fragment>
                                    ))}
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-slate-500 text-sm italic">
                                    No moves played yet
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
