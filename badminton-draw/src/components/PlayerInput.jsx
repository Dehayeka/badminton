import React from 'react';
import { Shuffle, Trash2 } from 'lucide-react';

export default function PlayerInput({ 
  players, 
  onPlayerChange, 
  onShuffle, 
  onReset 
}) {
  return (
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
                onChange={(e) => onPlayerChange(index, e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                placeholder={`Nama pemain ${index + 1}`}
              />
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={onShuffle}
          className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
        >
          <Shuffle size={20} />
          Acak Pertandingan
        </button>
        <button
          onClick={onReset}
          className="bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
        >
          <Trash2 size={20} />
          Reset
        </button>
      </div>
    </div>
  );
}