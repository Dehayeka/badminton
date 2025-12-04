import React, { useState } from 'react';
import { Shuffle, Users, Trash2 } from 'lucide-react';

export default function App() {
  const [numPlayers, setNumPlayers] = useState('');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showInput, setShowInput] = useState(true);

  const handleNumPlayersSubmit = () => {
    const num = parseInt(numPlayers);
    if (num >= 2 && num <= 20) {
      setPlayers(Array(num).fill(''));
      setShowInput(false);
      setMatches([]);
    } else {
      alert('Jumlah pemain harus antara 2-20');
    }
  };

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  const shuffleMatches = () => {
    const filledPlayers = players.filter(p => p.trim() !== '');
    
    if (filledPlayers.length < 2) {
      alert('Minimal 2 pemain harus diisi!');
      return;
    }

    const shuffled = [...filledPlayers].sort(() => Math.random() - 0.5);
    const newMatches = [];

    for (let i = 0; i < shuffled.length - 1; i += 2) {
      if (i + 1 < shuffled.length) {
        newMatches.push({
          id: Math.floor(i / 2) + 1,
          player1: shuffled[i],
          player2: shuffled[i + 1],
        });
      }
    }

    if (shuffled.length % 2 !== 0) {
      newMatches.push({
        id: newMatches.length + 1,
        player1: shuffled[shuffled.length - 1],
        player2: 'BYE',
        isBye: true,
      });
    }

    setMatches(newMatches);
  };

  const reset = () => {
    setNumPlayers('');
    setPlayers([]);
    setMatches([]);
    setShowInput(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center justify-center gap-3 mb-8">
            <Users className="text-blue-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">
              Pengacak Bagan Badminton
            </h1>
          </div>

          {showInput ? (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Jumlah Pemain (2-20)
                </label>
                <input
                  type="number"
                  value={numPlayers}
                  onChange={(e) => setNumPlayers(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNumPlayersSubmit()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Masukkan jumlah pemain"
                  min="2"
                  max="20"
                />
              </div>
              <button
                onClick={handleNumPlayersSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
              >
                Lanjutkan
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">
                  Nama Pemain
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-2">
                  {players.map((player, index) => (
                    <div key={index}>
                      <label className="block text-sm text-gray-600 mb-1">
                        Pemain {index + 1}
                      </label>
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => handlePlayerChange(index, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        placeholder={`Nama pemain ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={shuffleMatches}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  <Shuffle size={20} />
                  Acak Pertandingan
                </button>
                <button
                  onClick={reset}
                  className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Trash2 size={20} />
                  Reset
                </button>
              </div>

              {matches.length > 0 && (
                <div className="mt-8 space-y-4">
                  <h2 className="text-2xl font-bold text-gray-800 text-center">
                    Hasil Pengacakan
                  </h2>
                  <div className="space-y-3">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="bg-gradient-to-r from-blue-50 to-green-50 border border-gray-200 rounded-lg p-4"
                      >
                        <div className="text-sm font-semibold text-gray-600 mb-2">
                          Pertandingan {match.id}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex-1 bg-white rounded px-4 py-3 font-medium text-gray-800">
                            {match.player1}
                          </div>
                          <div className="px-4 font-bold text-gray-600">VS</div>
                          <div className={`flex-1 bg-white rounded px-4 py-3 font-medium ${
                            match.isBye ? 'text-gray-400 italic' : 'text-gray-800'
                          }`}>
                            {match.isBye ? 'BYE (Langsung lanjut)' : match.player2}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}