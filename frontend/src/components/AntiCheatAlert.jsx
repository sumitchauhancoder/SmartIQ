import React, { useEffect, useState } from 'react';
import { AlertTriangle, ShieldAlert, X } from 'lucide-react';

export default function AntiCheatAlert({ switchCount, onDismiss }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (switchCount > 0) {
      setVisible(true);
    }
  }, [switchCount]);

  if (!visible || switchCount === 0) return null;

  const isSevere = switchCount >= 2;

  return (
    <div className="fixed top-20 right-4 sm:right-8 z-50 max-w-md w-full animate-in fade-in slide-in-from-top-4 duration-300">
      <div className={`p-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${
        isSevere 
          ? 'bg-rose-950/90 border-rose-500/60 text-rose-100 shadow-rose-950/50'
          : 'bg-amber-950/90 border-amber-500/60 text-amber-100 shadow-amber-950/50'
      }`}>
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-xl ${isSevere ? 'bg-rose-900/60 text-rose-400' : 'bg-amber-900/60 text-amber-400'}`}>
            {isSevere ? <ShieldAlert className="w-6 h-6 animate-pulse" /> : <AlertTriangle className="w-6 h-6" />}
          </div>

          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm tracking-wide">
                {isSevere ? 'Integrity Violation Alert' : 'Focus Disruption Detected'}
              </h4>
              <button 
                onClick={() => { setVisible(false); if (onDismiss) onDismiss(); }}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs mt-1 text-slate-300 leading-relaxed">
              {isSevere
                ? `You have switched away from this assessment ${switchCount} times. A formal psychometric integrity flag has been appended to your diagnostic profile.`
                : `Tab switch #${switchCount} detected. Psychometric validity requires uninterrupted concentration. Further tab switches will flag your submission.`
              }
            </p>

            <div className="mt-2.5 flex items-center justify-between">
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-black/40 border border-white/10">
                Count: {switchCount} {switchCount === 1 ? '(1 allowance left)' : '(Audit Flagged)'}
              </span>
              <button
                onClick={() => { setVisible(false); if (onDismiss) onDismiss(); }}
                className={`text-xs font-semibold px-3 py-1 rounded-lg transition-colors ${
                  isSevere 
                    ? 'bg-rose-600 hover:bg-rose-500 text-white' 
                    : 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                }`}
              >
                Acknowledge
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
