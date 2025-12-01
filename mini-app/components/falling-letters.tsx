"use client";

import { useEffect, useState, useRef } from "react";
import { cn } from "@/lib/utils";

const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

type Letter = {
  id: number;
  char: string;
  top: number;
  speed: number;
};

export default function FallingLetters() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [score, setScore] = useState(0);
  const [multiplier, setMultiplier] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef(0);

  // Spawn a new letter every 800ms
  useEffect(() => {
    if (gameOver) return;
    const interval = setInterval(() => {
      const newLetter: Letter = {
        id: idRef.current++,
        char: LETTERS[Math.floor(Math.random() * LETTERS.length)],
        top: -20,
        speed: 1 + Math.random() * 2,
      };
      setLetters((prev) => [...prev, newLetter]);
    }, 800);
    return () => clearInterval(interval);
  }, [gameOver]);

  // Move letters
  useEffect(() => {
    if (gameOver) return;
    const animation = setInterval(() => {
      setLetters((prev) =>
        prev
          .map((l) => ({ ...l, top: l.top + l.speed }))
          .filter((l) => l.top < 600) // remove if beyond bottom
      );
    }, 30);
    return () => clearInterval(animation);
  }, [gameOver]);

  // Keyboard handling
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      const key = e.key.toUpperCase();
      setLetters((prev) => {
        const idx = prev.findIndex((l) => l.char === key);
        if (idx === -1) return prev;
        const matched = prev[idx];
        // Update score and multiplier
        setScore((s) => s + 10 * multiplier);
        setMultiplier((m) => m + 1);
        // Remove matched letter
        return prev.filter((_, i) => i !== idx);
      });
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [multiplier]);

  // Game over detection
  useEffect(() => {
    if (letters.some((l) => l.top >= 580)) {
      setGameOver(true);
    }
  }, [letters]);

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[600px] bg-black rounded-lg overflow-hidden mt-6"
    >
      {letters.map((l) => (
        <div
          key={l.id}
          className={cn(
            "absolute text-4xl font-bold text-white drop-shadow-[0_0_10px_rgba(0,255,255,0.7)]",
            "transition-all duration-200"
          )}
          style={{ top: `${l.top}px`, left: `${Math.random() * 90}%` }}
        >
          {l.char}
        </div>
      ))}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <div className="text-white text-lg">
          Score: {score}  Multiplier: x{multiplier}
        </div>
        {gameOver && (
          <div className="text-2xl text-red-400 font-bold">
            Game Over
          </div>
        )}
      </div>
    </div>
  );
}
