'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [name, setName] = useState('');
  const router = useRouter();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() !== '' && isClient) {
      localStorage.setItem('playerName', name);
      router.push('/game'); // Navigasi ke halaman /game
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to top, #87ceeb, #b2e0f7)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: `'Comic Sans MS', cursive, sans-serif`,
        position: 'relative',
      }}
    >
      {/* ✅ Tombol Leaderboard yang bisa diklik */}
      <button
        onClick={() => router.push('/leaderboard')}
        style={{
          position: 'absolute',
          top: '20px',
          left: '20px',
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '10px 15px',
          borderRadius: '10px',
          boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
          fontWeight: 'bold',
          color: '#333',
          fontSize: '18px',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        🏆 Leaderboard
      </button>

      <h1
        style={{
          fontSize: '48px',
          marginBottom: '30px',
          color: '#fff700',
          textShadow: '2px 2px #000',
        }}
      >
        🐤 Flappy Bird
      </h1>

      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '30px',
          borderRadius: '20px',
          boxShadow: '0px 8px 20px rgba(0,0,0,0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          width: '300px',
        }}
      >
        <input
          type="text"
          placeholder="Masukkan nama kamu"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={{
            padding: '12px',
            fontSize: '18px',
            borderRadius: '10px',
            border: '2px solid #00bfff',
            marginBottom: '20px',
            width: '100%',
            textAlign: 'center',
          }}
        />
        <button
          type="submit"
          style={{
            backgroundColor: '#00c800',
            color: '#fff',
            fontSize: '18px',
            padding: '12px 24px',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            transition: 'transform 0.2s ease',
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.1)')}
          onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
        >
          🚀 Mainkan
        </button>
      </form>

      {/* Hiasan Burung */}
      <div style={{ position: 'absolute', bottom: '20px', right: '20px' }}>
        <img
          src="https://upload.wikimedia.org/wikipedia/en/0/0a/Flappy_Bird_icon.png"
          alt="Flappy"
          style={{ width: '60px', animation: 'fly 2s infinite alternate ease-in-out' }}
        />
      </div>

      <style>{`
        @keyframes fly {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-15px); }
        }
      `}</style>
    </main>
  );
}
