import React, { useState, useEffect } from 'react';
import { FileUpload } from './components/FileUpload';
import { ScriptDisplay } from './components/ScriptDisplay';
import { AudioPlayer } from './components/AudioPlayer';
import { readDocxFile, createScriptDocx } from './services/fileService';
import { geminiService } from './services/geminiService';
import { audioBufferToWav, decodeBase64Audio } from './services/audioUtils';
import { AppState, GeneratedScript, AudioState } from './types';
import { Sparkles, FileText, Mic, AlertCircle, Loader2 } from 'lucide-react';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.IDLE);
  const [error, setError] = useState<string | null>(null);
  const [script, setScript] = useState<GeneratedScript | null>(null);
  const [audioState, setAudioState] = useState<AudioState>({ buffer: null, blob: null, url: null });

  // Cleanup audio URL on unmount
  useEffect(() => {
    return () => {
      if (audioState.url) {
        URL.revokeObjectURL(audioState.url);
      }
    };
  }, [audioState.url]);

  const handleFileSelect = async (file: File) => {
    setError(null);
    setAppState(AppState.PROCESSING_TEXT);
    try {
      const text = await readDocxFile(file);
      const generatedScript = await geminiService.generateScriptFromText(text);
      setScript(generatedScript);
      setAppState(AppState.REVIEW_SCRIPT);
    } catch (err: any) {
      setError(err.message || "An error occurred during file processing or script generation.");
      setAppState(AppState.ERROR);
    }
  };

  const handleGenerateAudio = async () => {
    if (!script) return;
    setAppState(AppState.PROCESSING_AUDIO);
    try {
      const base64Audio = await geminiService.generateAudio(script);
      
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const audioBuffer = await decodeBase64Audio(base64Audio, audioContext);
      const wavBlob = audioBufferToWav(audioBuffer);
      const audioUrl = URL.createObjectURL(wavBlob);

      setAudioState({
        buffer: audioBuffer,
        blob: wavBlob,
        url: audioUrl
      });
      setAppState(AppState.PLAYBACK);
    } catch (err: any) {
      setError(err.message || "Failed to generate audio.");
      setAppState(AppState.ERROR);
    }
  };

  const handleDownloadScript = async () => {
    if (!script) return;
    const blob = await createScriptDocx(script);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `linguadrama_${script.topic.replace(/\s+/g, '_').toLowerCase()}.docx`;
    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const handleReset = () => {
    setAppState(AppState.IDLE);
    setScript(null);
    setAudioState({ buffer: null, blob: null, url: null });
    setError(null);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50 backdrop-blur-md bg-opacity-80">
        <div className="max-w-5xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg text-slate-900">
              <Sparkles size={24} strokeWidth={2.5} />
            </div>
            <div>
               <h1 className="text-xl font-serif font-bold tracking-tight text-slate-100">LinguaDrama</h1>
               <p className="text-xs text-slate-400 uppercase tracking-widest">German Audio Workshop</p>
            </div>
          </div>
          {appState !== AppState.IDLE && (
            <button 
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-300 transition-colors underline"
            >
              Start Over
            </button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-6 pt-10">
        
        {/* Error Display */}
        {appState === AppState.ERROR && (
          <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-4 text-red-200">
            <AlertCircle className="flex-shrink-0" />
            <p>{error}</p>
            <button onClick={handleReset} className="ml-auto text-sm underline hover:text-red-100">Try Again</button>
          </div>
        )}

        {/* State: IDLE */}
        {appState === AppState.IDLE && (
          <div className="flex flex-col items-center justify-center py-20 animate-fade-in">
             <div className="text-center mb-10 max-w-2xl">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-slate-100 mb-6 leading-tight">
                  Turn your study notes into <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-amber-600">immersive conversations.</span>
                </h2>
                <p className="text-lg text-slate-400">
                  Upload your vocabulary lists or grammar notes. We'll write a professional drama script and perform it with realistic AI voices.
                </p>
             </div>
             <FileUpload onFileSelect={handleFileSelect} />
          </div>
        )}

        {/* State: LOADING TEXT */}
        {appState === AppState.PROCESSING_TEXT && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <Loader2 size={48} className="text-amber-500 animate-spin mb-6" />
            <h3 className="text-xl font-semibold text-slate-200">Analyzing your notes...</h3>
            <p className="text-slate-500 mt-2">Lukas and Felix are reviewing the material.</p>
          </div>
        )}

        {/* State: REVIEW & AUDIO */}
        {(appState === AppState.REVIEW_SCRIPT || appState === AppState.PROCESSING_AUDIO || appState === AppState.PLAYBACK) && script && (
          <div className="space-y-8 animate-fade-in">
            
            {/* Audio Control Section */}
            <div className="sticky top-24 z-40 bg-slate-900/90 backdrop-blur-sm p-4 rounded-2xl border border-slate-800 shadow-2xl">
               {appState === AppState.REVIEW_SCRIPT && (
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-slate-200">Script Ready</h3>
                      <p className="text-sm text-slate-400">Review the dialogue below before generating audio.</p>
                    </div>
                    <button 
                      onClick={handleGenerateAudio}
                      className="px-6 py-3 bg-amber-600 hover:bg-amber-500 text-slate-900 font-bold rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20"
                    >
                      <Mic size={20} />
                      Generate Audio Drama
                    </button>
                  </div>
               )}

               {appState === AppState.PROCESSING_AUDIO && (
                 <div className="flex items-center justify-center py-4 gap-4">
                    <Loader2 size={24} className="text-amber-500 animate-spin" />
                    <span className="text-slate-300 font-medium">Recording audio in the studio...</span>
                 </div>
               )}

               {appState === AppState.PLAYBACK && audioState.url && audioState.blob && (
                 <AudioPlayer 
                    audioUrl={audioState.url} 
                    blob={audioState.blob} 
                    onDownloadScript={handleDownloadScript}
                    topic={script.topic}
                 />
               )}
            </div>

            {/* Script Display */}
            <div className="pb-20">
              <ScriptDisplay script={script} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
