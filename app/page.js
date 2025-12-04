import { useState } from "react";
import PlayerInputList from "@/components/PlayerInputList";
import MatchResult from "@/components/MatchResult";

export default function Home() {
  const [count, setCount] = useState(0);
  const [names, setNames] = useState([]);
  const [pairs, setPairs] = useState([]);

  const generate = () => {
    const shuffled = [...names].filter(Boolean).sort(() => Math.random() - 0.5);
    const result = [];
    for (let i = 0; i < shuffled.length; i += 2) {
      result.push({ a: shuffled[i], b: shuffled[i + 1] ?? "BYE" });
    }
    setPairs(result);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 flex justify-center items-start">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-4">🎯 Badminton Match Generator</h1>

        <input
          type="number"
          className="border p-3 w-full rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500"
          placeholder="Jumlah pemain"
          onChange={(e) => setCount(parseInt(e.target.value) || 0)}
        />

        <PlayerInputList count={count} names={names} setNames={setNames} />

        <button
          onClick={generate}
          className="w-full bg-blue-600 text-white p-3 rounded-xl mt-4 text-lg hover:bg-blue-700 transition"
        >
          Generate Bagan
        </button>

        <MatchResult pairs={pairs} />
      </div>
    </div>
  );
}
