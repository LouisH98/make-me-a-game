"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "@uiw/react-textarea-code-editor/dist.css";

const CodeEditor = dynamic(
  () => import("@uiw/react-textarea-code-editor").then((mod) => mod.default),
  { ssr: false }
);

export default function GamePlayer() {
  const params = useSearchParams();
  const [gameScript, setGameScript] = useState<string | null>(null);
  const [instructions, setInstructions] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const gameDescription = params.get("game");

  useEffect(() => {
    if (gameDescription) {
      // fetch the game JS from the API
      fetch("/api/game", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameDescription }),
      }).then(async (res) => {
        const { game, instructions } = await res.json();
        setGameScript(game);
        setInstructions(instructions);
      });
    }
  }, [gameDescription]);

  if (gameScript && !error) {
    try {
      eval(`${gameScript}`);
    } catch (e) {
      setError(`${e}`);
    }
  }

  return (
    <>
      <h1 className="text-2xl">{gameDescription}</h1>
      {instructions && <div>Instructions: {instructions}</div>}
      <span id="score"></span>
      <span id="error" className="text-red">
        {error}
      </span>
      <canvas id="game-canvas" />
      <CodeEditor
        value={gameScript ?? ""}
        className="w-[80%] h-96 rounded-md shadow-sm"
        language="js"
        readOnly={gameScript ? true : false}
        placeholder="Generated code will be shown here."
        onChange={(evn) => setGameScript(evn.target.value)}
        padding={15}
        style={{
          fontSize: 12,
          backgroundColor: "rgba(0,0,0,0.7)",
          overflow: "auto",
          fontFamily:
            "ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace",
        }}
      />
      <button onClick={() => eval(gameScript ?? "")}>Run</button>
    </>
  );
}
