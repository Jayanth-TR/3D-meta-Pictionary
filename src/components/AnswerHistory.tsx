import React from 'react';
import type { TimelineEvent } from '../types/game';
import { ListOrdered, CheckCircle2, XCircle } from 'lucide-react';

interface AnswerHistoryProps {
  events: TimelineEvent[];
}

export const AnswerHistory: React.FC<AnswerHistoryProps> = ({ events }) => {
  return (
    <div className="w-full bg-[#292D3A]/90 backdrop-blur-xl border border-[#3E4550] rounded-2xl p-2.5 sm:p-3 shadow-xl space-y-1.5 flex flex-col justify-between">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-[#3E4550] pb-1.5">
        <div className="flex items-center gap-1.5">
          <ListOrdered className="w-3.5 h-3.5 text-[#01A982]" />
          <h3 className="text-xs font-bold text-white uppercase tracking-wider">
            History
          </h3>
        </div>
        <span className="text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#151821] text-[#D4D8DB] border border-[#3E4550]">
          {events.length} {events.length === 1 ? 'Attempt' : 'Attempts'}
        </span>
      </div>

      {/* History Log */}
      {events.length === 0 ? (
        <div className="py-2.5 text-center text-[#7D8A92] text-[10px] font-medium italic flex-1 flex items-center justify-center">
          No attempts yet. Click WRONG or CORRECT!
        </div>
      ) : (
        <div className="space-y-1 max-h-16 sm:max-h-20 overflow-y-auto pr-1 flex-1">
          {events.map((evt, idx) => {
            const isCorrect = evt.type === 'CORRECT';
            return (
              <div
                key={evt.id}
                className={`flex items-center justify-between p-1.5 rounded-lg border transition-all text-xs ${
                  isCorrect
                    ? 'bg-[#01A982]/15 border-[#01A982]/40 text-[#00E0AF]'
                    : 'bg-red-950/30 border-red-500/40 text-red-200'
                }`}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-[9px] font-black px-1 py-0.1 rounded bg-[#151821] text-[#D4D8DB] border border-[#3E4550]">
                    #{idx + 1}
                  </span>
                  {isCorrect ? (
                    <CheckCircle2 className="w-3 h-3 text-[#00E0AF]" />
                  ) : (
                    <XCircle className="w-3 h-3 text-red-400" />
                  )}
                  <span className="text-[10px] font-black uppercase tracking-wider">
                    {isCorrect ? 'CORRECT' : 'WRONG'}
                  </span>
                </div>

                <div className="text-[10px] font-bold">
                  <span className="text-[#7D8A92] text-[8px] uppercase font-normal mr-1">Time:</span>
                  <span>{evt.elapsedSeconds}s</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
