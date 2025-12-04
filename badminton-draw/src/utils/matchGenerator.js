/**
 * Shuffle array menggunakan Fisher-Yates algorithm
 */
export function shuffleArray(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate matches dari daftar pemain
 */
export function generateMatches(players) {
  const filledPlayers = players.filter(p => p.trim() !== '');
  
  if (filledPlayers.length < 2) {
    throw new Error('Minimal 2 pemain harus diisi!');
  }

  const shuffled = shuffleArray(filledPlayers);
  const matches = [];

  // Buat pasangan pertandingan
  for (let i = 0; i < shuffled.length - 1; i += 2) {
    if (i + 1 < shuffled.length) {
      matches.push({
        id: Math.floor(i / 2) + 1,
        player1: shuffled[i],
        player2: shuffled[i + 1],
      });
    }
  }

  // Jika ganjil, pemain terakhir dapat BYE
  if (shuffled.length % 2 !== 0) {
    matches.push({
      id: matches.length + 1,
      player1: shuffled[shuffled.length - 1],
      player2: 'BYE',
      isBye: true,
    });
  }

  return matches;
}

/**
 * Validasi jumlah pemain
 */
export function validatePlayerCount(count) {
  const num = parseInt(count);
  return !isNaN(num) && num >= 2 && num <= 20;
}