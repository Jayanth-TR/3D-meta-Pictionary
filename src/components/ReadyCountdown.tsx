import React, { useState, useEffect } from 'react';
import { soundFx } from '../utils/audio';

interface ReadyCountdownProps {
  onComplete: () => void;
  teamName: string;
  playerName: string;
}

export const ReadyCountdown: React.FC<ReadyCountdownProps> = ({
  onComplete,
  teamName,
  playerName,
}) => {
  const [count, setCount] = useState<number | 'GO!'>(3);

  useEffect(() => {
    // Play sound for initial '3'
    soundFx.playTick(650);

    const timer = setInterval(() => {
      setCount((prev) => {
        if (prev === 3) {
          soundFx.playTick(750);
          return 2;
        }
        if (prev === 2) {
          soundFx.playTick(850);
          return 1;
        }
        if (prev === 1) {
          soundFx.playCountdownGo();
          return 'GO!';
        }
        clearInterval(timer);
        setTimeout(() => {
          onComplete();
        }, 400);
        return prev;
      });
    }, 900);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-[#151821]/95 backdrop-blur-2xl flex flex-col items-center justify-center p-6 animate-fade-in select-none">
      
      <div className="text-center space-y-3 mb-8">
        <span className="px-4 py-1.5 rounded-full bg-[#01A982]/20 border border-[#01A982]/40 text-[#00E0AF] text-sm font-black uppercase tracking-widest shadow-lg">
          {playerName.includes(',') ? 'GET READY TEAM & PLAYERS!' : 'GET READY VR PLAYER!'}
        </span>
        <h3 className="text-2xl md:text-3xl font-extrabold text-[#F7F7F7]">
          {playerName} <span className="text-[#7D8A92] font-normal">({teamName})</span>
        </h3>
        <p className="text-[#B1B9BE] text-sm font-medium">Together, We Move Forward • Put on headset & prepare canvas</p>
      </div>

      {/* Big Animated Count Digit */}
      <div className="relative flex items-center justify-center w-64 h-64 md:w-80 md:h-80">
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-[#01A982] via-[#05CC93] to-[#00E0AF] blur-3xl opacity-35 animate-pulse"></div>
        <div className="relative z-10 w-full h-full rounded-full border-4 border-[#01A982]/50 bg-[#292D3A]/90 flex items-center justify-center shadow-2xl shadow-[#01A982]/40">
          <span 
            key={String(count)}
            className={`font-black tracking-tighter animate-timer-pulse ${
              count === 'GO!' ? 'text-6xl md:text-8xl text-[#00E0AF] drop-shadow-[0_0_20px_#00E0AF]' : 'text-8xl md:text-9xl text-white drop-shadow-[0_0_20px_#01A982]'
            }`}
          >
            {count}
          </span>
        </div>
      </div>

    </div>
  );
};
