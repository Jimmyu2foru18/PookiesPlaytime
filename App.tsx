import React, { useState, useEffect } from 'react';
import GameCanvas from './components/GameCanvas';
import { GameState, HighScore } from './types';
import { ASSET_PATHS } from './constants';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [previousState, setPreviousState] = useState<GameState>(GameState.MENU);
  const [score, setScore] = useState(0);
  const [health, setHealth] = useState(3);
  const [level, setLevel] = useState(1);
  const [playerName, setPlayerName] = useState(['P', 'O', 'O']);
  const [leaderboard, setLeaderboard] = useState<HighScore[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('pookie_highscores');
    if (saved) setLeaderboard(JSON.parse(saved));
  }, []);

  const saveScore = () => {
    const newEntry = { name: playerName.join(''), score };
    const newLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    setLeaderboard(newLeaderboard);
    localStorage.setItem('pookie_highscores', JSON.stringify(newLeaderboard));
    setGameState(GameState.LEADERBOARD);
  };

  const startGame = () => {
    setGameState(GameState.PLAYING);
    setScore(0);
    setHealth(3);
    setLevel(1);
  };

  const nextLevel = () => {
    if (level >= 5) {
      setGameState(GameState.VICTORY);
    } else {
      setLevel(prev => prev + 1);
      setGameState(GameState.PLAYING);
    }
  };

  const openInstructions = () => {
    setPreviousState(gameState);
    setGameState(GameState.INSTRUCTIONS);
  };

  const handleNameChange = (idx: number, val: string) => {
    const newName = [...playerName];
    newName[idx] = val.toUpperCase().charAt(0);
    setPlayerName(newName);
  };

  return (
    <div className="fixed inset-0 w-screen h-screen bg-black overflow-hidden font-sans select-none flex items-center justify-center">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-repeat animate-pulse z-0"></div>

      {/* Full Page Game Interface */}
      <div className="relative w-full h-full bg-[#E0F7FA] z-10">
        <GameCanvas 
          gameState={gameState} 
          setGameState={setGameState} 
          setScore={setScore} 
          setHealth={setHealth}
          currentLevel={level}
        />

        {/* HUD Overlay */}
        {(gameState === GameState.PLAYING || gameState === GameState.PAUSED) && (
          <>
            <div className="absolute top-6 left-6 z-40 flex flex-col gap-3">
              <div className="flex items-center gap-3 bg-black/80 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="text-xl">❤️</span>
                <div className="w-24 h-2 bg-black/50 rounded-full overflow-hidden">
                  <div className="h-full bg-[#FFB7C5] transition-all" style={{ width: `${(health / 3) * 100}%` }} />
                </div>
              </div>
              <div className="flex items-center gap-3 bg-black/80 px-4 py-2 rounded-xl border border-white/10 backdrop-blur-sm">
                <span className="text-xl">⚡</span>
                <div className="w-24 h-2 bg-black/50 rounded-full overflow-hidden">
                  <div id="stamina-bar" className="h-full bg-[#90EE90] transition-all" style={{ width: '100%' }} />
                </div>
              </div>
            </div>

            <div className="absolute top-6 right-6 z-40 flex flex-col items-end gap-2">
               <div className="bg-black/80 px-4 py-1 rounded-lg text-[#90EE90] font-black text-sm tracking-widest uppercase backdrop-blur-sm">Path {level}/5</div>
               <div className="bg-white px-4 py-2 rounded-xl text-black font-black text-xl shadow-xl flex items-center gap-2">
                 <span>💩</span> {score}
               </div>
            </div>
          </>
        )}
      </div>

      {/* Screen Overlays */}
      {gameState === GameState.MENU && (
        <div 
          className="absolute inset-0 z-50 bg-cover bg-center text-white p-6"
          style={{ backgroundImage: `url('${ASSET_PATHS.BACKGROUNDS.MAIN_MENU}')` }}
        >
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-0"></div>

          {/* Centered Menu Content */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <div className="mb-4 inline-block px-4 py-1 bg-[#FFB7C5] text-black font-black text-sm uppercase tracking-widest rounded-full animate-bounce">
              Now with Power-ups!
            </div>
            <h1 className="text-6xl md:text-9xl font-black mb-2 text-[#FFB7C5] drop-shadow-[0_8px_0_rgba(255,255,255,0.1)] tracking-tighter uppercase italic">
              POOKIE'S PLAYTIME!
            </h1>
            <p className="text-xl md:text-2xl mb-12 text-[#90EE90] font-bold uppercase tracking-[0.3em]">
              ~ The Way of the Sachi ~
            </p>
            <div className="flex flex-col gap-4 w-full max-w-sm mx-auto">
              <button onClick={startGame} className="menu-btn bg-white text-black text-2xl font-black p-5 rounded-xl hover:bg-[#FFB7C5] transition-all">START GAME 🦊</button>
              <button onClick={openInstructions} className="menu-btn bg-white/10 text-white text-xl font-bold p-4 rounded-xl hover:bg-white/20 transition-all">INSTRUCTIONS</button>
              <button onClick={() => setGameState(GameState.LEADERBOARD)} className="menu-btn bg-white/10 text-white text-xl font-bold p-4 rounded-xl hover:bg-white/20 transition-all">LEADERBOARD</button>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-4 left-0 w-full flex justify-between px-6 text-white text-sm z-10">
            <div>@th3viousgameus</div>
            <div className="text-right">
              <div>@sachimizora</div>
              <a 
                href="https://sachimizora.carrd.co" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-blue-400 underline text-xs"
              >
                https://sachimizora.carrd.co
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Paused Overlay */}
      {gameState === GameState.PAUSED && (
        <div className="absolute inset-0 z-[60] flex flex-col items-center justify-center bg-black/70 backdrop-blur-lg">
           <h2 className="text-8xl font-black text-[#90EE90] mb-12 italic tracking-tighter">PAUSED</h2>
           <div className="flex flex-col gap-6 w-full max-w-xs">
             <button onClick={() => setGameState(GameState.PLAYING)} className="p-5 bg-white text-black text-2xl font-black rounded-xl hover:scale-105 transition-transform tracking-tight shadow-2xl">RETURN TO GAME</button>
             <button onClick={openInstructions} className="p-4 bg-white/20 text-white text-xl font-bold rounded-xl hover:bg-white/30 transition-colors border border-white/10">HOW TO PLAY</button>
             <button onClick={() => setGameState(GameState.MENU)} className="p-4 bg-red-600/50 text-white text-xl font-bold rounded-xl hover:bg-red-600 transition-colors">QUIT TO MENU</button>
           </div>
        </div>
      )}

      {/* Instructions Overlay */}
      {gameState === GameState.INSTRUCTIONS && (
        <div 
          className="absolute inset-0 z-[70] flex flex-col items-center justify-center bg-cover bg-center text-white p-10"
          style={{ backgroundImage: `url('${ASSET_PATHS.BACKGROUNDS.INSTRUCTIONS}')` }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
          <div className="relative z-10 flex flex-col items-center">
            <h2 className="text-6xl font-black text-[#FFB7C5] mb-12 uppercase tracking-widest text-center">Master the Path</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-4xl text-2xl">
              <div className="space-y-6 bg-black/60 p-8 rounded-2xl border border-white/10">
                <p><span className="text-[#90EE90] font-black uppercase">MOVE:</span> WASD / Arrows</p>
                <p><span className="text-[#90EE90] font-black uppercase">JUMP:</span> Space / W / Up</p>
                <p><span className="text-[#90EE90] font-black uppercase">SPRINT:</span> Hold Shift</p>
                <p><span className="text-[#90EE90] font-black uppercase">FIRE:</span> F / Enter</p>
              </div>
              <div className="space-y-6 bg-black/60 p-8 rounded-2xl border border-white/10">
                <p><span className="text-[#90EE90] font-black uppercase">STOMP:</span> Land on enemies!</p>
                <p><span className="text-[#90EE90] font-black uppercase">GOAL:</span> Reach the Torii Gate</p>
                <p><span className="text-[#90EE90] font-black uppercase">PAUSE:</span> Press P Key</p>
                <p><span className="text-[#90EE90] font-black uppercase">POWER:</span> Find ⚡ and 🔥 icons</p>
              </div>
            </div>
            <button 
              onClick={() => setGameState(previousState)} 
              className="mt-16 px-16 py-6 bg-[#FFB7C5] text-black text-3xl font-black rounded-2xl hover:scale-110 transition-transform uppercase tracking-tighter"
            >
              Back to {previousState === GameState.PAUSED ? 'Pause' : 'Menu'}
            </button>
          </div>
        </div>
      )}

      {/* Game Over Overlay */}
      {gameState === GameState.GAME_OVER && (
        <div 
          className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-cover bg-center text-white p-6"
          style={{ backgroundImage: `url('${ASSET_PATHS.BACKGROUNDS.GAME_OVER}')` }}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0"></div>
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-8xl md:text-9xl font-black mb-4 text-red-500 italic text-center drop-shadow-lg">PATH BLOCKED</h1>
            <p className="text-2xl mb-12 uppercase tracking-[0.4em] text-white/80">Enter your name for the records</p>
            <div className="flex gap-4 mb-12">
              {[0, 1, 2].map(i => (
                <input 
                  key={i} 
                  maxLength={1} 
                  value={playerName[i]}
                  onChange={(e) => handleNameChange(i, e.target.value)}
                  className="w-24 h-32 bg-black/40 text-7xl text-center font-black rounded-xl border-4 border-[#FFB7C5] focus:bg-[#FFB7C5] focus:text-black transition-all outline-none backdrop-blur-md"
                />
              ))}
            </div>
            <button onClick={saveScore} className="px-16 py-7 bg-[#90EE90] text-black text-3xl font-black rounded-2xl shadow-2xl hover:scale-105 transition-transform">SAVE SCORE</button>
          </div>
        </div>
      )}

      {/* Victory Overlay */}
      {gameState === GameState.VICTORY && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#90EE90] text-black p-12 text-center">
          <div className="text-9xl mb-8 animate-bounce">🎌</div>
          <h1 className="text-7xl md:text-9xl font-black mb-4 uppercase italic tracking-tighter">SACHI'S ASCENT COMPLETE</h1>
          <p className="text-3xl font-bold mb-12 opacity-80 uppercase tracking-widest">YOU HAVE MASTERED ALL 5 PATHS</p>
          <div className="text-6xl font-black mb-12 bg-black text-[#90EE90] px-10 py-5 rounded-3xl">FINAL SCORE: {score}</div>
          <button onClick={() => setGameState(GameState.MENU)} className="px-16 py-8 bg-black text-white text-3xl font-black rounded-3xl hover:scale-105 transition-transform">RETURN TO GARDEN</button>
        </div>
      )}

      {/* Leaderboard Overlay */}
      {gameState === GameState.LEADERBOARD && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#1A1A1A] text-white p-12">
          <h1 className="text-7xl font-black mb-12 text-[#FFB7C5] italic underline underline-offset-8">GARDEN LEGENDS</h1>
          <div className="w-full max-w-xl bg-white/5 rounded-[2rem] p-10 border border-white/10 backdrop-blur-md">
            {leaderboard.length === 0 ? <p className="text-center text-2xl text-white/50 py-10">No legends yet...</p> : (
              leaderboard.map((entry, i) => (
                <div key={i} className="flex justify-between items-center py-5 border-b border-white/5 last:border-0">
                  <span className="text-3xl font-black text-[#90EE90]">#{i + 1} {entry.name}</span>
                  <span className="text-3xl font-black">{entry.score} 💩</span>
                </div>
              ))
            )}
          </div>
          <button onClick={() => setGameState(GameState.MENU)} className="mt-16 px-14 py-5 bg-white text-black text-2xl font-black rounded-2xl hover:scale-105 transition-transform">BACK TO MENU</button>
        </div>
      )}

      {/* Level Complete Overlay */}
      {gameState === GameState.LEVEL_COMPLETE && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-[#FFB7C5] text-black p-6">
          <h1 className="text-8xl md:text-9xl font-black mb-12 italic tracking-tighter text-center">PATH {level} CLEARED!</h1>
          <button onClick={nextLevel} className="px-20 py-10 bg-black text-white text-5xl font-black rounded-3xl hover:scale-110 transition-transform shadow-2xl">LEVEL {level + 1} ➔</button>
        </div>
      )}

      <style>{`
        .menu-btn:hover {
          box-shadow: 0 0 40px rgba(255, 183, 197, 0.5);
          transform: translateY(-4px) scale(1.02);
        }
        input:focus {
          transform: scale(1.1);
        }
      `}</style>
    </div>
  );
};

export default App;
