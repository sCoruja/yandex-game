import { useEffect, useRef, useState } from "react";
import { Game } from "../../services/game";
import { GAME_LEVELS } from "../../services/game/levels";

export const GamePage = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [blockSize, setBlockSize] = useState(16);
    useEffect(() => {
        const context = canvasRef.current?.getContext("2d");
        if (!context) throw new Error("context is null!");
        const game = new Game(context, GAME_LEVELS[1]);
        setBlockSize(game._blockSize);
        game.renderMap();
        game.initPlayer();
        game.renderplayer();
        function keyDownHandler(e: KeyboardEvent) {
            if (e.key == "ArrowLeft") {
                game.moveKeyDownHandler("left");
            }
            if (e.key == "ArrowUp") {
                game.jumpKeyDownHandler();
            }
            if (e.key == "ArrowRight") {
                game.moveKeyDownHandler("right");
            }
        }
        function keyUpHandler(e: KeyboardEvent) {
            if (e.key == "ArrowLeft") {
                game.moveKeyUpHandler();
            }
            if (e.key == "ArrowUp") {
                game.jumpKeyUpHandler();
            }
            if (e.key == "ArrowRight") {
                game.moveKeyUpHandler();
            }
        }
        document.addEventListener("keydown", keyDownHandler);
        document.addEventListener("keyup", keyUpHandler);
        game.loop();
        return () => {
            document.removeEventListener("keydown", keyDownHandler);
            document.removeEventListener("keyup", keyUpHandler);
        };
    }, []);
    return (
        <>
            <p>Game will be here!</p>
            <canvas
                ref={canvasRef}
                height={20 * blockSize}
                width={40 * blockSize}
                style={{ border: "1px solid black" }}
            ></canvas>
        </>
    );
};
