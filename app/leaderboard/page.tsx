'use client';

import { useEffect, useState } from 'react';

export default function Leaderboard() {
  const [scores, setScores] = useState<{ name: string; score: number }[]>([]);

  useEffect(() => {
    fetch('/api/score')
      .then((res) => res.json())
      .then((data) => setScores(data));
  }, []);

  return (
    <main style={{
      padding: '40px',
      fontFamily: 'Arial, sans-serif',
      maxWidth: '500px',
      margin: 'auto'
    }}>
      <button
  onClick={() => window.history.back()}
  style={{
    marginBottom: '20px',
    padding: '12px 24px',
    fontSize: '16px',
    backgroundColor: '#ffcc00',
    border: 'none',
    borderRadius: '12px',
    cursor: 'pointer',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
    fontWeight: 'bold',
    color: '#333',
    transition: 'all 0.2s ease-in-out',
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'scale(1.05)';
    e.currentTarget.style.backgroundColor = '#ffd633';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'scale(1)';
    e.currentTarget.style.backgroundColor = '#ffcc00';
  }}
>
  ⬅️ Kembali
</button>


      <h1 style={{ textAlign: 'center', fontSize: '32px', marginBottom: '20px' }}>🏆 Leaderboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Nama</th>
            <th style={{ padding: '10px', border: '1px solid #ccc' }}>Skor</th>
          </tr>
        </thead>
        <tbody>
          {scores.map((player, index) => (
            <tr key={index}>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{player.name}</td>
              <td style={{ padding: '10px', border: '1px solid #ccc' }}>{player.score}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
