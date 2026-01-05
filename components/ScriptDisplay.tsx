import React from 'react';
import { GeneratedScript } from '../types';
import { Mic2, User } from 'lucide-react';

interface ScriptDisplayProps {
  script: GeneratedScript;
}

export const ScriptDisplay: React.FC<ScriptDisplayProps> = ({ script }) => {
  return (
    <div className="w-full max-w-3xl mx-auto bg-slate-800 rounded-xl shadow-2xl overflow-hidden border border-slate-700">
      <div className="bg-slate-900 p-6 border-b border-slate-700 flex justify-between items-center">
        <div>
           <h2 className="text-2xl font-serif text-amber-500 mb-1">Script Preview</h2>
           <p className="text-slate-400 text-sm">Topic: <span className="text-slate-200">{script.topic}</span></p>
        </div>
      </div>
      
      <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto custom-scrollbar">
        {script.lines.map((line, index) => (
          <div key={index} className={`flex gap-4 ${line.speaker === 'Felix' ? 'flex-row-reverse' : ''}`}>
            {/* Avatar */}
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center shadow-lg
              ${line.speaker === 'Lukas' ? 'bg-emerald-900/50 text-emerald-400' : 'bg-indigo-900/50 text-indigo-400'}`}>
              <User size={20} />
            </div>

            {/* Bubble */}
            <div className={`flex-1 max-w-[80%] rounded-2xl p-4 relative
              ${line.speaker === 'Lukas' ? 'bg-slate-700 rounded-tl-none' : 'bg-slate-700/80 rounded-tr-none'}`}>
              
              <div className="flex justify-between items-baseline mb-1">
                 <span className={`text-xs font-bold uppercase tracking-wider
                   ${line.speaker === 'Lukas' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                   {line.speaker}
                 </span>
                 {line.stageDirection && (
                   <span className="text-xs text-slate-400 italic">[{line.stageDirection}]</span>
                 )}
              </div>

              <p className="text-lg text-slate-100 font-medium mb-2 leading-relaxed">
                {line.german}
              </p>
              
              <div className="border-t border-slate-600/50 pt-2 mt-2">
                <p className="text-sm text-slate-400 font-light italic">
                  {line.english}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
