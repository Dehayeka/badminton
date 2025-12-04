"use client";

import { useState } from "react";
import PlayerInputList from "@/components/PlayerInputList";
import MatchResult from "@/components/MatchResult";

export default function Home() {
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);

  const handleGenerate = async () => {
    const res = await fetch("/api/matches", {
      method: "POST",
      body: JSON.stringify({ players }),
    });

    const data = await res.json();
    setMatches(data.matches);
  };

  return (
    <div style={{ padding: "40px", fontFamily: "sans-serif" }}>
      <h1>Badminton Match Generator</h1>
      <PlayerInputList players={players} setPlayers={setPlayers} />

      <button
        onClick={handleGenerate}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "black",
          color: "white",
          borderRadius: "8px",
          cursor: "pointer",
        }}
      >
        Generate Matches
      </button>

      <MatchResult matches={matches} />
    </div>
  );
}
