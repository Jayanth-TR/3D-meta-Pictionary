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
        if (synced && synced.length > 0) {
          setSessionHistory(synced);
        }
      }).catch((e) => {
        console.warn('Initial Supabase sync caught error:', e);
      });
    }

    const savedRound = loadActiveRound();
    if (savedRound && savedRound.config && savedRound.isTimerRunning && savedRound.remainingSeconds > 0) {
      setRoundConfig(savedRound.config);
      setRemainingSeconds(savedRound.remainingSeconds);
      setElapsedSeconds(savedRound.elapsedSeconds);
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

  // Main 60-second Timer Loop
  useEffect(() => {
    if (gameState === 'PLAYING' && isTimerRunning) {
      timerIntervalRef.current = window.setInterval(() => {
        setRemainingSeconds((prevRemaining) => {
          if (prevRemaining <= 1) {
            // Timer Reached 0! Trigger Timeout
            clearInterval(timerIntervalRef.current!);
            setIsTimerRunning(false);
            setGameState('TIMEOUT');
            soundFx.playTimeout();
            
            // Log to Session History
            const timeoutRecord: SessionRecord = {
              id: Date.now().toString(),
              teamName: roundConfig.teamName,
              playerName: roundConfig.playerName,
              players: roundConfig.players,
              result: 'TIMEOUT',
              elapsedSeconds: roundConfig.durationSeconds,
              attempts: events.length,
              score: 0,
              timestamp: new Date().toISOString(),
            };
            const updatedHistory = saveSessionRecord(timeoutRecord);
            setSessionHistory(updatedHistory);

            return 0;
          }

          // Subtle alert sound during final 5 seconds
          if (prevRemaining <= 6) {
            soundFx.playTick(900);
          }

          return prevRemaining - 1;
        });

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
  }, [gameState, isTimerRunning, roundConfig, events.length]);

  // Start Round Action (from Setup)
  const handleStartRound = (teamName: string, playerName: string, players?: string[]) => {
    const playerList = players && players.length > 0 ? players : [playerName];
    setRoundConfig({
      teamName,
      playerName,
      players: playerList,
      durationSeconds: 60,
    });
    setRemainingSeconds(60);
    setElapsedSeconds(0);
    setEvents([]);
    setGameState('READY');
  };

  // Transition from READY countdown to PLAYING
  const handleReadyComplete = () => {
    setGameState('PLAYING');
    setIsTimerRunning(true);
  };

  // Handle WRONG Answer Click
  const handleWrongAnswer = () => {
    if (gameState !== 'PLAYING') return;

    const newEvent: TimelineEvent = {
      id: `${Date.now()}_${Math.random()}`,
      type: 'WRONG',
      remainingSeconds,
      elapsedSeconds,
      timestamp: Date.now(),
    };

    setEvents((prev) => [...prev, newEvent]);
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
        remainingSeconds,
        elapsedSeconds,
        timestamp: Date.now(),
      },
    ];

    setEvents(finalEvents);
    setGameState('CORRECT');

    const score = Math.max(100, 1000 - elapsedSeconds * 10);

    // Save record to Session History
    const record: SessionRecord = {
      id: Date.now().toString(),
      teamName: roundConfig.teamName,
      playerName: roundConfig.playerName,
      players: roundConfig.players,
      result: 'CORRECT',
      elapsedSeconds,
      attempts: finalEvents.length,
      score,
      timestamp: new Date().toISOString(),
    };

    const updatedHistory = saveSessionRecord(record);
    setSessionHistory(updatedHistory);
  };

  // Action: NEXT ROUND (Resets timer & events, goes back to SETUP for next user/team)
  const handleNextRound = () => {
    setRemainingSeconds(60);
    setElapsedSeconds(0);
    setEvents([]);
    setRoundConfig({
      teamName: '',
      playerName: '',
      players: [],
      durationSeconds: 60,
    });
    setSetupKey((k) => k + 1);
    setGameState('SETUP');
    setActiveSetupTab('SETUP');
  };

  // Action: TRY AGAIN (Retries same round with same team and player)
  const handleTryAgain = () => {
    setRemainingSeconds(60);
    setElapsedSeconds(0);
    setEvents([]);
    setGameState('READY');
  };

  // Action: BACK TO SETUP / RESET
  const handleBackToSetup = () => {
    setRemainingSeconds(60);
    setElapsedSeconds(0);
    setEvents([]);
    setIsTimerRunning(false);
    setRoundConfig({
      teamName: '',
      playerName: '',
      players: [],
      durationSeconds: 60,
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
  const handleClearHistory = () => {
    clearSessionHistory();
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
            remainingSeconds={remainingSeconds}
            elapsedSeconds={elapsedSeconds}
            events={events}
            onCorrect={handleCorrectAnswer}
            onWrong={handleWrongAnswer}
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

