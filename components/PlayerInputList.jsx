"use client";

export default function PlayerInputList({ players, setPlayers }) {
  const addPlayer = () => {
    setPlayers([...players, ""]);
  };

  const updatePlayer = (index, value) => {
    const updated = [...players];
    updated[index] = value;
    setPlayers(updated);
  };

  return (
    <div>
      <h3>Input Nama Pemain</h3>

      {players.map((p, idx) => (
        <input
          key={idx}
          value={p}
          onChange={(e) => updatePlayer(idx, e.target.value)}
          placeholder={`Pemain ${idx + 1}`}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "6px 10px",
            borderRadius: "5px",
          }}
        />
      ))}

      <button
        onClick={addPlayer}
        style={{
          padding: "8px 15px",
          background: "gray",
          color: "white",
          borderRadius: "6px",
          cursor: "pointer",
        }}
      >
        Tambah Pemain
      </button>
    </div>
  );
}
