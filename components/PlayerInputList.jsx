export default function PlayerInputList({ count, names, setNames }) {
  return (
    <div>
      {Array.from({ length: count }).map((_, i) => (
        <input
          key={i}
          placeholder={`Nama pemain ${i + 1}`}
          onChange={(e) => {
            const updated = [...names];
            updated[i] = e.target.value;
            setNames(updated);
          }}
          className="border p-3 w-full rounded-xl shadow-sm mt-3"
        />
      ))}
    </div>
  );
}
