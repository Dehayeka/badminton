export default function MatchResult({ pairs }) {
  return (
    <div className="mt-6">
      {pairs.length > 0 && <h2 className="text-xl font-semibold mb-2">Hasil Pertandingan</h2>}
      {pairs.map((p, i) => (
        <div key={i} className="border p-3 rounded-xl shadow-sm bg-gray-50 mt-2">
          {p.a} vs {p.b}
        </div>
      ))}
    </div>
  );
}
