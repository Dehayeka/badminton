import React from 'react';

export default function MatchDisplay({ matches }) {
  if (matches.length === 0) return null;

  return (
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
  );
}