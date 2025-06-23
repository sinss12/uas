import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

export async function POST(req: Request) {
  const db = await open({
    filename: './leaderboard.db',
    driver: sqlite3.Database
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS scores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      score INTEGER NOT NULL
    );
  `);

  const { name, score } = await req.json();
  if (!name || typeof score !== 'number') {
    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });
  }

  await db.run('INSERT INTO scores (name, score) VALUES (?, ?)', [name, score]);
  return NextResponse.json({ message: 'Score saved' });
}

export async function GET() {
  const db = await open({
    filename: './leaderboard.db',
    driver: sqlite3.Database
  });

  const scores = await db.all('SELECT name, score FROM scores ORDER BY score DESC LIMIT 10');
  return NextResponse.json(scores);
}
