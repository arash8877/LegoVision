
import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import BrickButton from './components/BrickButton';
import VisionModal from './components/VisionModal';
import ResultsView from './components/ResultsView';
import JourneyAnimation from './components/JourneyAnimation';
import DiscoverView from './components/DiscoverView';
import { analyzeBrickPile } from './services/geminiService';
import { VisionAnalysis } from './types';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

type ViewState = 'landing' | 'results' | 'discover';

const AppContent: React.FC = () => {
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

  const navigateToDiscover = () => {
    setView('discover');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col font-body bg-white">
      <nav className="bg-white border-b-8 border-legoRed px-8 py-6 sticky top-0 z-40 shadow-xl flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-4 cursor-pointer group" onClick={handleReset}>
            <div className="w-12 h-12 bg-legoRed rounded-xl shadow-lego flex items-center justify-center group-hover:rotate-6 transition-transform">
              <div className="grid grid-cols-2 gap-1.5">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-2.5 h-2.5 bg-white/40 rounded-full"></div>)}
              </div>
            </div>
            <h1 className="font-heading text-3xl text-legoBlue">LegoVision</h1>
          </div>
          
          <div className="hidden md:flex items-center gap-6">
            <button 
              onClick={handleReset}
              className={`font-heading text-lg transition-colors ${view === 'landing' ? 'text-legoRed' : 'text-legoBlue hover:text-legoRed'}`}
            >
              Scanner
            </button>
            <button 
              onClick={navigateToDiscover}
              className={`font-heading text-lg transition-colors ${view === 'discover' ? 'text-legoRed' : 'text-legoBlue hover:text-legoRed'}`}
            >
              Discover
            </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <BrickButton variant="blue" className="!text-sm !px-6 hidden sm:flex" onClick={() => setIsModalOpen(true)}>
            {view === 'results' ? 'Rescan' : 'Snap Photo'}
          </BrickButton>
        </div>
      </nav>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12 bg-white animate-in fade-in duration-500">
          <div className="max-w-2xl w-full">
            <JourneyAnimation imageUrl={sourceImage} isProcessing={true} className="mb-12" />
            <div className="text-center">
              <h2 className="font-heading text-4xl md:text-6xl text-legoBlue animate-pulse mb-4 uppercase tracking-tighter">Inventorying Pieces</h2>
              <p className="text-xl text-gray-400 font-bold uppercase tracking-widest">Identifying every stud and brick...</p>
              {error && <p className="mt-8 text-legoRed font-black bg-red-50 p-4 rounded-2xl border-2 border-legoRed">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
        <>
          {view === 'landing' && (
            <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 items-center">
              <div className="space-y-10 text-center lg:text-left">
                <div className="inline-block bg-legoRed text-white px-6 py-2 rounded-xl font-heading text-sm tracking-widest uppercase">AI-Powered Builder</div>
                <h2 className="font-heading text-7xl md:text-9xl text-legoBlue leading-none">
                  More than <br /> a pile of <br />
                  <span className="text-legoRed">bricks.</span>
                </h2>
                <p className="text-2xl text-gray-500 font-bold max-w-xl mx-auto lg:mx-0">Turn your loose pieces into creative micro-builds using advanced computer vision.</p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                  <BrickButton onClick={() => setIsModalOpen(true)} className="!px-12 !py-6 !text-3xl !rounded-3xl shadow-lego">Snap a Photo ✨</BrickButton>
                  <BrickButton onClick={navigateToDiscover} variant="blue" className="!px-12 !py-6 !text-3xl !rounded-3xl shadow-lego-blue">Explore Sets 🚀</BrickButton>
                </div>
              </div>
              <JourneyAnimation />
            </section>
          )}

          {view === 'results' && analysisResult && (
            <ResultsView 
              result={analysisResult} 
              sourceImage={sourceImage!} 
              onReset={handleReset} 
              onNewScan={() => setIsModalOpen(true)} 
              onRegenerate={() => handleScanRequest(sourceImage!.split(',')[1], sourceImage!)}
              isRegenerating={isLoading}
            />
          )}

          {view === 'discover' && <DiscoverView />}

          {view === 'landing' && (
            <section className="bg-legoGray py-24 px-6 border-y-[12px] border-legoYellow">
              <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                  <h3 className="font-heading text-5xl text-legoBlue uppercase tracking-tighter">Your Journey</h3>
                  <div className="w-24 h-2 bg-legoRed mx-auto mt-4 rounded-full"></div>
                </div>

                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-12">
                  <div className="bg-white p-8 rounded-[2.5rem] border-4 border-legoBlue shadow-lego-blue flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-legoRed rounded-2xl shadow-lego flex items-center justify-center text-4xl mb-6 group-hover:rotate-12 transition-transform">🧱</div>
                    <h4 className="font-heading text-2xl text-legoBlue mb-2">1. Gather</h4>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Find your loose bricks</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border-4 border-legoBlue shadow-lego-blue flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-legoYellow rounded-2xl shadow-lego-yellow flex items-center justify-center text-4xl mb-6 group-hover:-rotate-12 transition-transform">📸</div>
                    <h4 className="font-heading text-2xl text-legoBlue mb-2">2. Snap</h4>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Take a clear photo</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border-4 border-legoBlue shadow-lego-blue flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-legoBlue rounded-2xl shadow-lego-blue flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">🔍</div>
                    <h4 className="font-heading text-2xl text-legoBlue mb-2">3. Analyze</h4>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">AI scans every piece</p>
                  </div>
                  <div className="bg-white p-8 rounded-[2.5rem] border-4 border-legoBlue shadow-lego-blue flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-legoRed rounded-2xl shadow-lego flex items-center justify-center text-4xl mb-6 group-hover:rotate-6 transition-transform">🚀</div>
                    <h4 className="font-heading text-2xl text-legoBlue mb-2">4. Build</h4>
                    <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Construct your world</p>
                  </div>
                </div>
              </div>
            </section>
          )}
        </>
      )}

      <VisionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onScan={handleScanRequest} />
      
      {!isLoading && (
        <footer className="bg-legoBlue text-white py-16 text-center mt-auto">
          <div className="flex justify-center gap-8 mb-8 font-heading text-sm uppercase tracking-widest">
            <button onClick={handleReset} className="hover:text-legoYellow transition-colors">Scanner</button>
            <button onClick={navigateToDiscover} className="hover:text-legoYellow transition-colors">Discover</button>
            <a href="https://rebrickable.com/api/" target="_blank" rel="noreferrer" className="hover:text-legoYellow transition-colors">Data Partners</a>
          </div>
          <p className="font-black opacity-30 uppercase tracking-[0.4em] text-xs">LegoVision Lab // Powered by Gemini Intelligence</p>
        </footer>
      )}
    </div>
  );
};

const App: React.FC = () => (
  <QueryClientProvider client={queryClient}>
    <AppContent />
  </QueryClientProvider>
);

export default App;
