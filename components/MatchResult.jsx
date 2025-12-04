"use client";

export default function MatchResult({ matches }) {
  if (!matches || matches.length === 0) return null;

  return (
    <div style={{ marginTop: "30px" }}>
      <h3>Hasil Generate</h3>

      {matches.map((m, idx) => (
        <div
          key={idx}
          style={{
            padding: "10px 15px",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginBottom: "10px",
          }}
        >
          <strong>Match {idx + 1}</strong> <br />
          {m.team1} VS {m.team2}
        </div>
      ))}
    </div>
  );
}
