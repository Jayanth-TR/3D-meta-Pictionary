import React, { useState, useEffect, useRef } from 'react';
import type { GameState, RoundConfig, TimelineEvent, SessionRecord, ActiveRoundState } from './types/game';
import { Header } from './components/Header';
import { GameSetup } from './components/GameSetup';
import { ReadyCountdown } from './components/ReadyCountdown';
import { GameRound } from './components/GameRound';
import { RoundResult } from './components/RoundResult';
import { TimeoutResult } from './components/TimeoutResult';
import { SessionSummaryModal } from './components/SessionSummaryModal';
import { HowToPlay } from './components/HowToPlay';
import { InstructionsModal } from './components/InstructionsModal';
import { soundFx } from './utils/audio';
import {
  saveActiveRound,
  loadActiveRound,
  getSessionHistory,
  saveSessionRecord,
  clearSessionHistory,
  syncSessionHistory,
  isSupabaseConfigured,
} from './utils/storage';

export const App: React.FC = () => {
  // Game Flow State: Start directly on HOW_TO_PLAY instruction page
  const [gameState, setGameState] = useState<GameState>('SETUP');
  const [activeSetupTab, setActiveSetupTab] = useState<'SETUP' | 'HOW_TO_PLAY'>('HOW_TO_PLAY');
  // Increment this key each time we navigate to SETUP to force a fresh remount of GameSetup
  const [setupKey, setSetupKey] = useState(0);

  // Round Setup Configuration
  const [roundConfig, setRoundConfig] = useState<RoundConfig>({
    teamName: '',
    playerName: '',
    players: [],
    durationSeconds: 60,
  });

  // Active Round Timer & Events
  const [remainingSeconds, setRemainingSeconds] = useState<number>(60);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Audio, Drawer & Modal Controls
  const [isMuted, setIsMuted] = useState<boolean>(soundFx.isMuted);
  const [isSessionDrawerOpen, setIsSessionDrawerOpen] = useState<boolean>(false);
  const [isInstructionsModalOpen, setIsInstructionsModalOpen] = useState<boolean>(false);
  const [sessionHistory, setSessionHistory] = useState<SessionRecord[]>(() => getSessionHistory());

  // Ref for timer interval
  const timerIntervalRef = useRef<number | null>(null);

  // Initial Load from LocalStorage and Supabase
  useEffect(() => {

    // 2. Sync with Supabase cloud database
    if (isSupabaseConfigured) {
      syncSessionHistory().then((synced) => {
        if (synced) {
          setSessionHistory(synced);
        }
      }).catch((e) => {
        console.warn('Initial Supabase sync caught error:', e);
      });
    }

    const savedRound = loadActiveRound();
    if (savedRound && savedRound.config && savedRound.isTimerRunning) {
      setRoundConfig(savedRound.config);
      setRemainingSeconds(savedRound.remainingSeconds ?? 0);
      setElapsedSeconds(savedRound.elapsedSeconds ?? 0);
      setEvents(savedRound.events);
      setGameState('PLAYING');
      setIsTimerRunning(true);
    }
  }, []);

  // Save active round state to LocalStorage
  useEffect(() => {
    if (gameState === 'PLAYING' || gameState === 'CORRECT' || gameState === 'TIMEOUT') {
      const stateToSave: ActiveRoundState = {
        config: roundConfig,
        remainingSeconds,
        elapsedSeconds,
        events,
        isTimerRunning,
        score: Math.max(100, 1000 - elapsedSeconds * 10),
      };
      saveActiveRound(stateToSave);
    } else {
      saveActiveRound(null);
    }
  }, [gameState, roundConfig, remainingSeconds, elapsedSeconds, events, isTimerRunning]);

  // Main Stopwatch Timer Loop (indefinite, increments elapsedSeconds)
  useEffect(() => {
    if (gameState === 'PLAYING' && isTimerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setElapsedSeconds((prevElapsed) => prevElapsed + 1);
      }, 1000);
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
    };
  }, [gameState, isTimerRunning]);

  // Start Round Action (from Setup)
  const handleStartRound = (teamName: string, playerName: string, players?: string[]) => {
    const playerList = players && players.length > 0 ? players : [playerName];
    setRoundConfig({
      teamName,
      playerName,
      players: playerList,
      durationSeconds: 0,
    });
    setRemainingSeconds(0);
    setElapsedSeconds(0);
    setEvents([]);
    setGameState('READY');
  };

  // Transition from READY countdown to PLAYING
  const handleReadyComplete = () => {
    setGameState('PLAYING');
    setIsTimerRunning(true);
  };

  // Handle GAVE UP Button Click
  const handleGaveUp = () => {
    if (gameState !== 'PLAYING') return;

    // Stop timer immediately
    setIsTimerRunning(false);
    soundFx.playTimeout();

    const finalEvents: TimelineEvent[] = [
      ...events,
      {
        id: `${Date.now()}_${Math.random()}`,
        type: 'GAVE_UP',
        remainingSeconds: 0,
        elapsedSeconds,
        timestamp: Date.now(),
      },
    ];

    setEvents(finalEvents);
    setGameState('TIMEOUT');

    // Save record to Session History with GAVE_UP result
    const record: SessionRecord = {
      id: Date.now().toString(),
      teamName: roundConfig.teamName,
      playerName: roundConfig.playerName,
      players: roundConfig.players,
      result: 'GAVE_UP',
      elapsedSeconds,
      attempts: finalEvents.length,
      score: 0,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = saveSessionRecord(record);
    setSessionHistory(updatedHistory);
  };

  // Handle CORRECT Answer Click
  const handleCorrectAnswer = () => {
    if (gameState !== 'PLAYING') return;

    // Stop timer immediately
    setIsTimerRunning(false);

    const finalEvents: TimelineEvent[] = [
      ...events,
      {
        id: `${Date.now()}_${Math.random()}`,
        type: 'CORRECT',
        remainingSeconds: 0,
        elapsedSeconds,
        timestamp: Date.now(),
      },
    ];

    setEvents(finalEvents);
    setGameState('CORRECT');

    // Save record to Session History (points removed, score: 0)
    const record: SessionRecord = {
      id: Date.now().toString(),
      teamName: roundConfig.teamName,
      playerName: roundConfig.playerName,
      players: roundConfig.players,
      result: 'CORRECT',
      elapsedSeconds,
      attempts: finalEvents.length,
      score: 0,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = saveSessionRecord(record);
    setSessionHistory(updatedHistory);
  };

  // Action: NEXT ROUND (Resets timer & events, goes back to SETUP for next user/team)
  const handleNextRound = () => {
    setRemainingSeconds(0);
    setElapsedSeconds(0);
    setEvents([]);
    setRoundConfig({
      teamName: '',
      playerName: '',
      players: [],
      durationSeconds: 0,
    });
    setSetupKey((k) => k + 1);
    setGameState('SETUP');
    setActiveSetupTab('SETUP');
  };

  // Action: TRY AGAIN (Retries same round with same team and player)
  const handleTryAgain = () => {
    setRemainingSeconds(0);
    setElapsedSeconds(0);
    setEvents([]);
    setGameState('READY');
  };

  // Action: BACK TO SETUP / RESET
  const handleBackToSetup = () => {
    setRemainingSeconds(0);
    setElapsedSeconds(0);
    setEvents([]);
    setIsTimerRunning(false);
    setRoundConfig({
      teamName: '',
      playerName: '',
      players: [],
      durationSeconds: 0,
    });
    setSetupKey((k) => k + 1);
    setGameState('SETUP');
    setActiveSetupTab('SETUP');
  };

  // Toggle Mute
  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  // Clear Leaderboard
  const handleClearHistory = async () => {
    await clearSessionHistory();
    setSessionHistory([]);
  };

  return (
    <div className="h-screen max-h-screen overflow-hidden bg-[#151821] text-[#F7F7F7] flex flex-col font-sans selection:bg-[#01A982] selection:text-white">
      
      {/* Fixed Navigation Header */}
      <Header
        gameState={gameState}
        teamName={roundConfig.teamName}
        playerName={roundConfig.playerName}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
        onResetToSetup={() => {
          handleBackToSetup();
          setActiveSetupTab('HOW_TO_PLAY');
        }}
        onOpenHowToPlay={() => setIsInstructionsModalOpen(true)}
        isHowToPlayActive={isInstructionsModalOpen}
      />

      {/* Main View Router based on GameState */}
      <main className="flex-1 min-h-0 overflow-y-auto flex flex-col justify-center">
        {gameState === 'SETUP' && activeSetupTab === 'HOW_TO_PLAY' && (
          <HowToPlay
            onStartSetup={() => setActiveSetupTab('SETUP')}
            onOpenLeaderboard={() => setIsSessionDrawerOpen(true)}
            onOpenInstructionsModal={() => setIsInstructionsModalOpen(true)}
          />
        )}

        {gameState === 'SETUP' && activeSetupTab === 'SETUP' && (
          <GameSetup
            key={setupKey}
            onStartRound={handleStartRound}
            onOpenLeaderboard={() => setIsSessionDrawerOpen(true)}
            onOpenInstructions={() => setIsInstructionsModalOpen(true)}
            sessionHistory={sessionHistory}
            onClearHistory={handleClearHistory}
            initialTeamName=""
            initialPlayerName=""
            initialPlayers={[]}
          />
        )}


        {gameState === 'READY' && (
          <ReadyCountdown
            onComplete={handleReadyComplete}
            teamName={roundConfig.teamName}
            playerName={roundConfig.playerName}
          />
        )}

        {gameState === 'PLAYING' && (
          <GameRound
            config={roundConfig}
            elapsedSeconds={elapsedSeconds}
            onCorrect={handleCorrectAnswer}
            onGaveUp={handleGaveUp}
          />
        )}

        {gameState === 'CORRECT' && (
          <RoundResult
            config={roundConfig}
            elapsedSeconds={elapsedSeconds}
            events={events}
            onNextRound={handleNextRound}
            onBackToSetup={handleBackToSetup}
          />
        )}

        {gameState === 'TIMEOUT' && (
          <TimeoutResult
            config={roundConfig}
            events={events}
            elapsedSeconds={elapsedSeconds}
            onTryAgain={handleTryAgain}
            onNextRound={handleNextRound}
            onBackToSetup={handleBackToSetup}
          />
        )}
      </main>

      {/* Instructions Pop-Up Modal */}
      <InstructionsModal
        isOpen={isInstructionsModalOpen}
        onClose={() => setIsInstructionsModalOpen(false)}
      />

      {/* Leaderboard / History Drawer Modal */}
      <SessionSummaryModal
        isOpen={isSessionDrawerOpen}
        onClose={() => setIsSessionDrawerOpen(false)}
        sessionHistory={sessionHistory}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
};

export default App;

