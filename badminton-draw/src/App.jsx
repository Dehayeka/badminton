import React, { useState } from 'react';
import { Shuffle, Users, Trash2, Trophy, Sparkles } from 'lucide-react';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-500 p-4 sm:p-6 lg:p-8">
      {/* Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-5xl mx-auto relative z-10">
        {/* Header Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 mb-6 border border-white/20">
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="relative">
              <Trophy className="text-yellow-500" size={40} />
              <Sparkles className="absolute -top-1 -right-1 text-yellow-400" size={20} />
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Badminton Draw
            </h1>
          </div>
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Sistem Pengacakan Bagan Pertandingan Otomatis
          </p>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
          {showInput ? (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <Users className="mx-auto text-blue-600 mb-3" size={48} />
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Mulai Turnamen</h2>
                <p className="text-gray-600">Masukkan jumlah pemain yang akan bertanding</p>
              </div>
              
              <div className="max-w-md mx-auto">
                <label className="block text-sm font-semibold text-gray-700 mb-3 text-center">
                  Jumlah Pemain (2-20)
                </label>
                <input
                  type="number"
                  value={numPlayers}
                  onChange={(e) => setNumPlayers(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleNumPlayersSubmit()}
                  className="w-full px-6 py-4 text-lg text-center border-2 border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all shadow-lg"
                  placeholder="8"
                  min="2"
                  max="20"
                />
              </div>
              
              <button
                onClick={handleNumPlayersSubmit}
                className="w-full max-w-md mx-auto block bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-105 shadow-xl hover:shadow-2xl"
              >
                Lanjutkan →
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Player Input Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <Users className="text-blue-600" size={28} />
                    Daftar Pemain
                  </h2>
                  <span className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full font-semibold text-sm">
                    {players.filter(p => p.trim() !== '').length} / {players.length}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                  {players.map((player, index) => (
                    <div key={index} className="group">
                      <label className="block text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
                        Pemain {index + 1}
                      </label>
                      <input
                        type="text"
                        value={player}
                        onChange={(e) => handlePlayerChange(index, e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all group-hover:border-gray-300 shadow-sm"
                        placeholder={`Nama pemain ${index + 1}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t-2 border-gray-100">
                <button
                  onClick={shuffleMatches}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <Shuffle size={22} />
                  Acak Pertandingan
                </button>
                <button
                  onClick={reset}
                  className="sm:w-auto bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-2xl transition-all transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center justify-center gap-3"
                >
                  <Trash2 size={22} />
                  Reset
                </button>
              </div>

              {/* Match Results */}
              {matches.length > 0 && (
                <div className="mt-10 space-y-6 animate-fadeIn">
                  <div className="text-center">
                    <h2 className="text-3xl font-black text-gray-800 mb-2 flex items-center justify-center gap-3">
                      <Trophy className="text-yellow-500" size={32} />
                      Hasil Undian
                    </h2>
                    <p className="text-gray-600">Bagan pertandingan telah diacak!</p>
                  </div>
                  
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <div
                        key={match.id}
                        className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 border-2 border-gray-200 rounded-2xl p-5 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
                            Match {match.id}
                          </span>
                          {match.isBye && (
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
                              BYE
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between gap-4">
                          <div className="flex-1 bg-white rounded-xl px-5 py-4 font-bold text-gray-800 shadow-md border-2 border-blue-200 hover:border-blue-400 transition-colors">
                            {match.player1}
                          </div>
                          
                          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-black text-sm shadow-lg">
                            VS
                          </div>
                          
                          <div className={`flex-1 bg-white rounded-xl px-5 py-4 font-bold shadow-md border-2 transition-colors ${
                            match.isBye 
                              ? 'text-gray-400 italic border-gray-200' 
                              : 'text-gray-800 border-purple-200 hover:border-purple-400'
                          }`}>
                            {match.isBye ? 'BYE (Auto Win)' : match.player2}
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

        {/* Footer */}
        <div className="text-center mt-8 text-white/80 text-sm">
          <p>🏸 Selamat bertanding! Semoga beruntung!</p>
        </div>
      </div>

      {/* Custom Scrollbar Style */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #3b82f6, #8b5cf6);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(to bottom, #2563eb, #7c3aed);
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}   