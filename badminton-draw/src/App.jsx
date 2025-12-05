import React, { useState, useCallback, useEffect } from 'react';
import { Shuffle, Users, Trash2, Trophy, Sparkles, CheckCircle, Clock, Save, XCircle } from 'lucide-react';

// --- Firebase Imports ---
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken, onAuthStateChanged } from 'firebase/auth';
import { 
  getFirestore, doc, setDoc, onSnapshot, collection, query, limit, orderBy 
} from 'firebase/firestore';


// --- Inisialisasi Firebase dan Global Variables ---
// Variabel yang disediakan oleh lingkungan Canvas
const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
const initialAuthToken = typeof __initial_auth_token !== 'undefined' ? __initial_auth_token : null;

// KONFIGURASI FIREBASE ANDA (Disalin dari Firebase Console)
const userFirebaseConfig = {
  apiKey: "AIzaSyDKT0Xr_aw5_e_TC_Pxd3YyYLR0OapiOFE",
  authDomain: "badmintondrawapp.firebaseapp.com",
  projectId: "badmintondrawapp",
  storageBucket: "badmintondrawapp.firebasestorage.app",
  messagingSenderId: "58022733890",
  appId: "1:58022733890:web:cd5b2086a9c09ea69425db",
  measurementId: "G-HNJEY49CJ6"
};

// Gabungkan konfigurasi dari lingkungan Canvas dan konfigurasi Anda
const firebaseConfig = typeof __firebase_config !== 'undefined' ? JSON.parse(__firebase_config) : userFirebaseConfig;


let db = null;
let auth = null;

if (firebaseConfig.projectId) { // Cek jika konfigurasi valid
  const app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  auth = getAuth(app);
}

// Lokasi penyimpanan (Public data)
const HISTORY_COLLECTION_PATH = `/artifacts/${appId}/public/data/matchHistory`;


// --- Komponen MatchDisplay (Dipindahkan ke sini agar kode tunggal) ---

/**
 * Komponen untuk menampilkan detail pertandingan dan menginput skor.
 */
const MatchDisplay = React.memo(({ match, currentRound, onScoreSubmit }) => {
  const [score1, setScore1] = useState(match.score1 || 0);
  const [score2, setScore2] = useState(match.score2 || 0);
  const [editing, setEditing] = useState(!match.winner);

  // Periksa apakah pertandingan sudah memiliki pemenang
  const hasWinner = match.winner && match.winner !== 'TBA';
  const winnerName = match.winner === match.player1 ? match.player1 : match.player2;
  const winnerClass = "bg-green-100 text-green-800 border-green-400";
  const loserClass = "bg-red-100 text-red-800 border-red-400";

  const handleScoreSubmit = () => {
    const s1 = parseInt(score1);
    const s2 = parseInt(score2);

    if (isNaN(s1) || isNaN(s2) || s1 < 0 || s2 < 0) {
      // NOTE: Mengganti alert() dengan pesan di UI lebih disarankan
      alert("Skor harus angka positif.");
      return;
    }

    // Aturan sederhana: pemenang harus memiliki skor > 0 dan skor harus berbeda
    if (s1 === s2) {
      // NOTE: Mengganti alert() dengan pesan di UI lebih disarankan
      alert("Skor tidak boleh seri.");
      return;
    }

    const winner = s1 > s2 ? match.player1 : match.player2;
    const loser = s1 > s2 ? match.player2 : match.player1;

    onScoreSubmit(match.id, s1, s2, winner, loser);
    setEditing(false);
  };

  const isPlayer1Winner = hasWinner && match.winner === match.player1;
  const isPlayer2Winner = hasWinner && match.winner === match.player2;

  return (
    <div
      key={match.id}
      className={`bg-white rounded-2xl p-5 shadow-lg transition-all transform hover:-translate-y-0.5 border-2 ${
        hasWinner ? 'border-blue-500/50' : 'border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full font-bold text-sm shadow-md">
          Match {match.id}
        </span>
        {match.isBye ? (
          <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-xs font-semibold">
            BYE (Pemenang: {match.player1})
          </span>
        ) : hasWinner ? (
          <div className="flex items-center gap-1 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
            <Trophy size={14} /> Pemenang: {winnerName}
          </div>
        ) : (
          <span className="text-sm text-gray-500">Menunggu Skor</span>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 items-center">
        {/* Player 1 */}
        <div className={`col-span-2 rounded-xl px-3 py-3 font-bold text-center transition-colors border-2 ${
          isPlayer1Winner ? winnerClass : isPlayer2Winner ? loserClass : 'text-gray-800 border-gray-300'
        }`}>
          {match.player1}
        </div>
        
        {/* VS */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-2 py-1 rounded-lg font-black text-sm shadow-lg">
            VS
          </div>
        </div>

        {/* Player 2 */}
        <div className={`col-span-2 rounded-xl px-3 py-3 font-bold text-center transition-colors border-2 ${
          isPlayer2Winner ? winnerClass : isPlayer1Winner ? loserClass : 'text-gray-800 border-gray-300'
        }`}>
          {match.isBye ? 'BYE (Auto Win)' : match.player2}
        </div>

        {/* Score Input Row */}
        {!match.isBye && (
          <>
            <input
              type="number"
              value={score1}
              onChange={(e) => setScore1(e.target.value)}
              className={`col-span-2 w-full text-center border p-2 rounded-lg text-sm transition-all ${
                editing ? 'bg-white border-blue-400' : 'bg-gray-50 border-gray-200'
              }`}
              disabled={!editing || hasWinner}
              min="0"
            />
            <div className="text-center text-sm font-bold text-gray-600">
              {editing ? 'Skor' : hasWinner ? ':' : '-'}
            </div>
            <input
              type="number"
              value={score2}
              onChange={(e) => setScore2(e.target.value)}
              className={`col-span-2 w-full text-center border p-2 rounded-lg text-sm transition-all ${
                editing ? 'bg-white border-blue-400' : 'bg-gray-50 border-gray-200'
              }`}
              disabled={!editing || hasWinner}
              min="0"
            />
          </>
        )}
      </div>
      
      {/* Action Button */}
      {!match.isBye && (
        <div className="mt-4 text-right">
          {hasWinner ? (
            <button
              onClick={() => setEditing(true)}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-4 rounded-xl text-xs transition-all flex items-center gap-1 float-right"
            >
              <Sparkles size={16} /> Edit Skor
            </button>
          ) : (
            <button
              onClick={handleScoreSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl text-sm transition-all shadow-md float-right"
            >
              <CheckCircle size={16} className="inline mr-1" /> Simpan Skor
            </button>
          )}
        </div>
      )}
    </div>
  );
});

// --- Komponen Utama App ---

export default function App() {
  const [numPlayers, setNumPlayers] = useState('');
  const [players, setPlayers] = useState([]);
  const [matches, setMatches] = useState([]);
  const [showInput, setShowInput] = useState(true);
  
  // STATE: Untuk melacak ronde saat ini
  const [currentRound, setCurrentRound] = useState(1);
  // STATE: Untuk menyimpan daftar pemain yang menang di ronde sebelumnya
  const [roundWinners, setRoundWinners] = useState([]);
  // STATE BARU: Untuk menyimpan riwayat pertandingan dari Firestore
  const [history, setHistory] = useState([]);
  // STATE BARU: Untuk status Firebase
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [userId, setUserId] = useState(null);


  // --- Firebase Setup and History Listener ---
  useEffect(() => {
    if (!auth || !db) return;

    // 1. Authentication
    const authenticate = async () => {
      try {
        if (initialAuthToken) {
          await signInWithCustomToken(auth, initialAuthToken);
        } else {
          await signInAnonymously(auth);
        }
      } catch (error) {
        console.error("Firebase Auth Error:", error);
      }
    };
    
    // 2. Auth State Listener
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        console.log("User authenticated:", user.uid);
      } else {
        setUserId(null);
        console.log("User signed out or anonymous.");
      }
      setIsAuthReady(true);
    });

    authenticate();
    return () => unsubscribeAuth();
  }, []);

  // 3. History Listener (Runs after Auth is ready)
  useEffect(() => {
    if (!isAuthReady || !db) return;

    console.log("Attaching Firestore listener...");
    
    // Query: Ambil 5 riwayat terakhir, diurutkan berdasarkan waktu pembuatan
    const q = query(
      collection(db, HISTORY_COLLECTION_PATH),
      // Untuk menghindari error index pada Firestore, kita ambil semua data 
      // dan sorting di client (diasumsikan data history tidak terlalu besar).
    );

    const unsubscribeHistory = onSnapshot(q, (snapshot) => {
      const historyData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Parse time if needed
        timestamp: doc.data().timestamp ? new Date(doc.data().timestamp) : new Date(0)
      }));
      
      // Sortir di client (descending order)
      historyData.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

      setHistory(historyData);
      console.log("History updated:", historyData.length, "items.");
    }, (error) => {
      console.error("Firestore History Listener Error:", error);
    });

    return () => unsubscribeHistory();
  }, [isAuthReady]);


  // --- Game Logic Functions ---

  const handleNumPlayersSubmit = () => {
    const num = parseInt(numPlayers);
    if (num >= 2 && num <= 20) {
      setPlayers(Array(num).fill(''));
      setShowInput(false);
      setMatches([]);
      setCurrentRound(1); // Reset ronde ke 1
      setRoundWinners([]);
    } else {
      alert('Jumlah pemain harus antara 2-20');
    }
  };

  const handlePlayerChange = (index, value) => {
    const newPlayers = [...players];
    newPlayers[index] = value;
    setPlayers(newPlayers);
  };

  // FUNGSI DIPERBAIKI (Menggunakan useCallback): Menyimpan juara ke database
  const saveChampionToHistory = useCallback(async (championName, totalRounds, finalMatches) => {
    if (!db || !userId) {
        console.error("Database atau User tidak siap.");
        return;
    }
    
    const newHistory = {
        champion: championName,
        totalPlayers: players.length,
        totalRounds: totalRounds,
        // Clone finalMatches agar tidak ada masalah dengan referensi state React
        finalMatch: finalMatches.length > 0 ? JSON.parse(JSON.stringify(finalMatches[0])) : null,
        players: players.filter(p => p.trim() !== ''),
        timestamp: new Date().toISOString(), // Simpan waktu dalam format ISO string
        createdBy: userId,
    };
    
    try {
        const docRef = doc(collection(db, HISTORY_COLLECTION_PATH));
        await setDoc(docRef, newHistory);
        console.log("Riwayat Juara berhasil disimpan. ID:", docRef.id);
        
    } catch (e) {
        console.error("Error menyimpan riwayat: ", e);
    }
  }, [players, userId]); // Dependencies: players dan userId

  // FUNGSI DIPERBAIKI (Dependensi ditambahkan): Membuat bagan pertandingan
  const generateMatches = useCallback((playerList, round) => {
    const filledPlayers = playerList.filter(p => p.trim() !== '');
    
    // Jika hanya 1 pemain yang tersisa (di round > 1), dia otomatis menjadi Juara
    if (filledPlayers.length === 1 && round > 1) {
        const champion = filledPlayers[0];
        alert(`Selamat, ${champion} adalah Juaranya setelah ${round - 1} ronde!`);
        
        // Panggil fungsi untuk menyimpan Juara ke database.
        saveChampionToHistory(champion, round - 1, matches); 

        return []; // Hentikan pembuatan matches
    }

    if (filledPlayers.length < 2 && round === 1) {
      alert('Minimal 2 pemain harus diisi!');
      return [];
    }
    
    const shuffled = [...filledPlayers].sort(() => Math.random() - 0.5);
    const newMatches = [];

    for (let i = 0; i < shuffled.length; i += 2) {
      const matchId = i / 2 + 1;
      let player1 = shuffled[i];
      let player2 = shuffled[i + 1];
      let isBye = false;

      if (!player2) {
        player2 = 'BYE';
        isBye = true;
      }
      
      newMatches.push({
        id: matchId,
        player1: player1,
        player2: player2,
        isBye: isBye,
        winner: isBye ? player1 : null,
        score1: 0,
        score2: 0,
      });
    }

    return newMatches;

  }, [saveChampionToHistory, matches]); // Dependensi yang Benar


  const shuffleMatches = () => {
    const newMatches = generateMatches(players, 1);
    setMatches(newMatches);
    setRoundWinners([]);
    setCurrentRound(1);
  };
  
  const startNextRound = () => {
      if (roundWinners.length < 2) {
          alert('Minimal harus ada 2 pemenang untuk melanjutkan ronde!');
          return;
      }
      
      const newMatches = generateMatches(roundWinners, currentRound + 1);
      
      if (newMatches.length > 0) {
          setMatches(newMatches);
          setCurrentRound(prev => prev + 1);
          setRoundWinners([]);
      }
      // Jika newMatches kosong, Juara sudah diumumkan dan disimpan di generateMatches
  };


  const handleScoreUpdate = useCallback((id, s1, s2, winner, loser) => {
    let updatedMatches = matches.map(match => {
      if (match.id === id) {
        return {
          ...match,
          score1: s1,
          score2: s2,
          winner: winner,
        };
      }
      return match;
    });

    setMatches(updatedMatches);
    
    const currentWinners = updatedMatches
      .filter(m => m.winner)
      .map(m => m.winner);
      
    setRoundWinners(currentWinners);
    
  }, [matches]);
  
  
  const totalMatches = matches.length;
  const completedMatches = matches.filter(m => m.winner).length;
  const isRoundFinished = totalMatches > 0 && totalMatches === completedMatches;


  const reset = () => {
    setNumPlayers('');
    setPlayers([]);
    setMatches([]);
    setShowInput(true);
    setCurrentRound(1);
    setRoundWinners([]);
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
              Badminton Draw Tournament
            </h1>
          </div>
          <p className="text-center text-gray-600 text-sm sm:text-base">
            Sistem Pengacakan, Pencatatan Skor, dan Riwayat Multi-Ronde
          </p>
          <div className="text-center mt-3 text-xs text-gray-500">
            {isAuthReady ? (
              <span className="text-green-600 font-medium">Database Connected | User ID: {userId}</span>
            ) : (
              <span className="text-red-500 font-medium">Connecting to Database...</span>
            )}
          </div>
        </div>

        {/* Main Content Card */}
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20">
          {showInput ? (
            // --- Bagian 1: Input Jumlah Pemain & History ---
            <div className="space-y-8">
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

              {/* History Section */}
              <div className="pt-6 border-t border-gray-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2 justify-center">
                  <Clock className="text-purple-600" size={24} /> Riwayat Juara Terakhir
                </h2>
                <div className="space-y-3 max-h-80 overflow-y-auto pr-2 custom-scrollbar">
                  {history.length > 0 ? (
                    history.slice(0, 5).map((item, index) => (
                      <div key={item.id} className="bg-purple-50 p-4 rounded-xl border border-purple-200 shadow-sm">
                        <p className="font-extrabold text-purple-800 text-lg flex items-center gap-2">
                          <Trophy size={20} className="text-yellow-600" /> {item.champion}
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Dari {item.totalPlayers} pemain dalam {item.totalRounds} ronde.
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(item.timestamp).toLocaleString('id-ID')}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-500 italic">Belum ada riwayat pertandingan yang tersimpan.</p>
                  )}
                </div>
              </div>

            </div>
          ) : (
            // --- Bagian 2: Input Nama & Pertandingan ---
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
                  Acak Babak Awal
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
                      Ronde {currentRound}
                    </h2>
                    <p className="text-gray-600">
                      {isRoundFinished ? (
                        <span className="text-green-600 font-semibold">Semua pertandingan selesai! Siap ke Ronde {currentRound + 1}.</span>
                      ) : (
                        `Pertandingan selesai: ${completedMatches} dari ${totalMatches}`
                      )}
                    </p>
                  </div>
                  
                  <div className="space-y-4">
                    {matches.map((match) => (
                      <MatchDisplay 
                        key={`${match.player1}-${match.player2}-${currentRound}`} 
                        match={match} 
                        currentRound={currentRound}
                        onScoreSubmit={handleScoreUpdate}
                      />
                    ))}
                  </div>
                  
                  {/* Tombol Lanjut Ronde */}
                  {isRoundFinished && (
                    <div className="pt-6 border-t border-gray-100">
                        <button
                          onClick={startNextRound}
                          className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white font-bold py-4 rounded-2xl transition-all transform hover:scale-105 shadow-xl flex items-center justify-center gap-3"
                        >
                          <Shuffle size={22} />
                          Lanjut ke Ronde {currentRound + 1} ({roundWinners.length} Pemain)
                        </button>
                    </div>
                  )}
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