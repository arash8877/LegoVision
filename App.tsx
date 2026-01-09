import React, { useState } from 'react';
import BrickButton from './components/BrickButton';
import VisionModal from './components/VisionModal';
import ResultsView from './components/ResultsView';
import JourneyAnimation from './components/JourneyAnimation';
import { analyzeBrickPile } from './services/geminiService';
import { VisionAnalysis } from './types';

type ViewState = 'landing' | 'results';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('landing');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisionAnalysis | null>(null);
  const [sourceImage, setSourceImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleScanRequest = async (base64: string, preview: string) => {
    setIsLoading(true);
    setSourceImage(preview);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const result = await analyzeBrickPile(base64);
      setAnalysisResult(result);
      setView('results');
    } catch (err: any) {
      setError(err.message || 'Failed to analyze bricks.');
      setView('landing');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setView('landing');
    setAnalysisResult(null);
    setSourceImage(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-white">
      <nav className="bg-white border-b-8 border-legoRed px-8 py-6 sticky top-0 z-40 shadow-xl flex justify-between items-center">
        <div className="flex items-center gap-4 cursor-pointer" onClick={handleReset}>
          <div className="w-12 h-12 bg-legoRed rounded-xl shadow-lego flex items-center justify-center">
            <div className="grid grid-cols-2 gap-1.5">
              {[1,2,3,4].map(i => <div key={i} className="w-2.5 h-2.5 bg-white/40 rounded-full"></div>)}
            </div>
          </div>
          <h1 className="font-heading text-3xl text-legoBlue">LegoVision</h1>
        </div>
        <BrickButton variant="blue" className="!text-sm !px-6" onClick={() => setIsModalOpen(true)}>
          {view === 'results' ? 'Rescan' : 'Analyze Now'}
        </BrickButton>
      </nav>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
          <div className="w-32 h-32 bg-legoYellow rounded-[2rem] border-8 border-legoBlue shadow-lego animate-bounce flex items-center justify-center text-6xl">🧩</div>
          <h2 className="mt-12 font-heading text-5xl text-legoBlue animate-pulse text-center">Precise Piece Inventory...</h2>
          {error && <p className="mt-4 text-legoRed font-bold">{error}</p>}
        </div>
      ) : (
        view === 'landing' ? (
          <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 text-center lg:text-left">
              <div className="inline-block bg-legoRed text-white px-6 py-2 rounded-xl font-heading text-sm tracking-widest uppercase">Official AI Builder</div>
              <h2 className="font-heading text-7xl md:text-9xl text-legoBlue leading-none">
                More than <br/> a pile of <br/>
                <span className="text-legoRed">bricks.</span>
              </h2>
              <p className="text-2xl text-gray-500 font-bold max-w-xl mx-auto lg:mx-0">Turn your loose pieces into creative micro-builds using advanced computer vision.</p>
              <BrickButton onClick={() => setIsModalOpen(true)} className="!px-12 !py-6 !text-3xl !rounded-3xl shadow-lego">Snap a Photo ✨</BrickButton>
            </div>
            <JourneyAnimation />
          </section>
        ) : (
          <ResultsView 
            result={analysisResult!} 
            sourceImage={sourceImage!} 
            onReset={handleReset} 
            onNewScan={() => setIsModalOpen(true)} 
            onRegenerate={() => handleScanRequest(sourceImage!.split(',')[1], sourceImage!)}
            isRegenerating={isLoading}
          />
        )
      )}

      <VisionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onScan={handleScanRequest} />
      
      {view === 'landing' && !isLoading && (
        <footer className="bg-legoBlue text-white py-16 text-center border-t-[10px] border-legoYellow">
          <p className="font-black opacity-30 uppercase tracking-[0.4em] text-xs">LegoVision Lab // Powered by Gemini</p>
        </footer>
      )}
    </div>
  );
};

export default App;