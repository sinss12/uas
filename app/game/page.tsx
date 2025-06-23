'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

type Pipe = {
  x: number;
  gapY: number;
  passed: boolean;
};

// Suara
const flapSound = typeof Audio !== 'undefined' ? new Audio('/sounds/flap.wav') : null;
const pointSound = typeof Audio !== 'undefined' ? new Audio('/sounds/point.wav') : null;
const gameOverSound = typeof Audio !== 'undefined' ? new Audio('/sounds/gameover.wav') : null;

export default function GamePage() {
  const [countdown, setCountdown] = useState(3);
  const [gameStarted, setGameStarted] = useState(false);
  const [birdY, setBirdY] = useState(150);
  const [pipes, setPipes] = useState<Pipe[]>([]);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [scoreSaved, setScoreSaved] = useState(false);
  const gameAreaRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const gravity = 3;
  const jumpHeight = 40;
  const pipeWidth = 60;
  const pipeGap = 150;

  useEffect(() => {
    const storedName = localStorage.getItem('playerName');
    if (storedName) {
      setPlayerName(storedName);
    } else {
      router.push('/');
    }
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setGameStarted(true);
      setIsGameOver(false);
      setPipes([
        { x: 400, gapY: 120 + Math.random() * 120, passed: false },
        { x: 700, gapY: 120 + Math.random() * 120, passed: false },
        { x: 1000, gapY: 120 + Math.random() * 120, passed: false },
      ]);
    }
  }, [countdown]);

  useEffect(() => {
    if (!gameStarted || isGameOver) return;

    const interval = setInterval(() => {
      setBirdY((prev) => {
        const newY = prev + gravity;
        const maxY = (gameAreaRef.current?.clientHeight || 300) - 30;
        return newY < 0 ? 0 : newY > maxY ? maxY : newY;
      });

      setPipes((prevPipes) => {
        let newPipes = prevPipes.map((pipe) => {
          const newX = pipe.x - 5;
          const hasPassed = !pipe.passed && newX + pipeWidth < 80;

          if (hasPassed) {
            setScore((s) => s + 1);
            if (pointSound) {
              pointSound.currentTime = 0;
              pointSound.play();
            }
          }

          return {
            ...pipe,
            x: newX,
            passed: pipe.passed || hasPassed,
          };
        }).filter((pipe) => pipe.x + pipeWidth > 0);

        if (newPipes.length === 0 || newPipes[newPipes.length - 1].x < 500) {
          newPipes.push({
            x: 700,
            gapY: 120 + Math.random() * 120,
            passed: false,
          });
        }

        newPipes.forEach((pipe) => {
          if (
            pipe.x < 110 &&
            pipe.x + pipeWidth > 80 &&
            (birdY < pipe.gapY || birdY + 30 > pipe.gapY + pipeGap)
          ) {
            setIsGameOver(true);
            setGameStarted(false);
            if (gameOverSound) {
              gameOverSound.currentTime = 0;
              gameOverSound.play();
            }
          }
        });

        return newPipes;
      });
    }, 30);

    const handleJump = (e: KeyboardEvent | MouseEvent) => {
      if (e instanceof KeyboardEvent && e.code !== 'Space') return;
      setBirdY((y) => Math.max(y - jumpHeight, 0));
      if (flapSound) {
        flapSound.currentTime = 0;
        flapSound.play();
      }
    };

    window.addEventListener('keydown', handleJump);
    window.addEventListener('click', handleJump);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleJump);
      window.removeEventListener('click', handleJump);
    };
  }, [gameStarted, birdY, isGameOver]);

  useEffect(() => {
    if (isGameOver && !scoreSaved) {
      setScoreSaved(true);
      fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: playerName, score }),
      });
    }
  }, [isGameOver, scoreSaved, playerName, score]);

  const restartGame = () => {
    setBirdY(150);
    setPipes([]);
    setScore(0);
    setCountdown(3);
    setIsGameOver(false);
    setGameStarted(false);
    setScoreSaved(false);
  };

  return (
    <>
      <button
        onClick={() => router.push('/leaderboard')}
        style={{
          position: 'fixed',
          top: '20px',
          left: '20px',
          padding: '10px 20px',
          fontSize: '16px',
          backgroundColor: 'white',
          border: '2px solid #ffcc00',
          borderRadius: '10px',
          cursor: 'pointer',
          boxShadow: '2px 2px 5px rgba(0,0,0,0.3)',
          fontWeight: 'bold',
          zIndex: 1000,
        }}
      >
        🏆 Leaderboard
      </button>

      <main
        ref={gameAreaRef}
        style={{
          position: 'relative',
          width: '400px',
          height: '500px',
          margin: 'auto',
          marginTop: '40px',
          border: '3px solid #00c800',
          borderRadius: '15px',
          backgroundColor: '#87ceeb',
          overflow: 'hidden',
          fontFamily: `'Comic Sans MS', cursive, sans-serif`,
        }}
      >
        {!gameStarted && !isGameOver && (
          <div
            style={{
              fontSize: '80px',
              color: '#fff700',
              textAlign: 'center',
              lineHeight: '500px',
              userSelect: 'none',
              textShadow: '2px 2px 8px black',
            }}
          >
            {countdown > 0 ? countdown : '🚀'}
          </div>
        )}

        {isGameOver && (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              color: 'white',
              fontSize: '28px',
              zIndex: 10,
            }}
          >
            <div style={{ fontSize: '48px', marginBottom: '20px' }}>Game Over</div>
            <div style={{ fontSize: '24px', marginBottom: '20px' }}>Skor: {score}</div>
            <button onClick={restartGame} style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}>Ulang</button>
            <button onClick={() => router.push('/')} style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}>Kembali</button>
            <button onClick={() => router.push('/leaderboard')} style={{ margin: '10px', padding: '10px 20px', fontSize: '18px' }}>🏆 Lihat Leaderboard</button>
          </div>
        )}

        {gameStarted && !isGameOver && (
          <>
            <div
              style={{
                position: 'absolute',
                left: '80px',
                top: birdY,
                width: '30px',
                height: '30px',
                backgroundColor: '#ffcc00',
                borderRadius: '50%',
                boxShadow: '0 0 10px 2px #ff0',
                transition: 'top 0.05s linear',
              }}
            >
              <div style={{
                position: 'absolute',
                top: '7px',
                left: '8px',
                width: '6px',
                height: '6px',
                backgroundColor: 'black',
                borderRadius: '50%',
              }} />
              <div style={{
                position: 'absolute',
                top: '12px',
                right: '-6px',
                width: '10px',
                height: '6px',
                backgroundColor: 'orange',
                clipPath: 'polygon(0 0, 100% 50%, 0 100%)',
              }} />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '-10px',
                width: '10px',
                height: '10px',
                backgroundColor: '#ffcc00',
                borderRadius: '50%',
                transform: 'rotate(-30deg)',
              }} />
            </div>

            {pipes.map((pipe, i) => (
              <div key={i}>
                <div style={{
                  position: 'absolute',
                  left: pipe.x,
                  top: 0,
                  width: pipeWidth,
                  height: pipe.gapY,
                  backgroundColor: '#228B22',
                  borderRadius: '10px 10px 0 0',
                  boxShadow: 'inset 0 0 10px #006400',
                }} />
                <div style={{
                  position: 'absolute',
                  left: pipe.x,
                  top: pipe.gapY + pipeGap,
                  width: pipeWidth,
                  height: 500 - (pipe.gapY + pipeGap),
                  backgroundColor: '#228B22',
                  borderRadius: '0 0 10px 10px',
                  boxShadow: 'inset 0 0 10px #006400',
                }} />
              </div>
            ))}

            <div style={{
              position: 'absolute',
              top: '10px',
              right: '20px',
              fontSize: '24px',
              fontWeight: 'bold',
              color: '#fff700',
              textShadow: '2px 2px 4px black',
              userSelect: 'none',
            }}>
              🏆 {score}
            </div>

            <div style={{
              position: 'absolute',
              bottom: '10px',
              left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '14px',
              color: 'white',
              textShadow: '1px 1px 2px black',
              userSelect: 'none',
            }}>
              Klik / Spacebar untuk lompat
            </div>
          </>
        )}
      </main>
    </>
  );
}
