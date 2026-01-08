
import React, { useState } from 'react';
import BrickButton from './components/BrickButton';
import VisionModal from './components/VisionModal';
import ResultsView from './components/ResultsView';
import { analyzeBrickPile } from './services/geminiService';
import { VisionAnalysis } from './types';

type ViewState = 'landing' | 'results';

/**
 * Ultra-Realistic 3D LEGO Brick Component
 * Uses an overlay system for shading without SVG filters to ensure cross-browser stability.
 */
const RealisticBrick: React.FC<{ 
  x: number, y: number, w: number, h: number, color: string, studs?: number, rotate?: number, className?: string, opacity?: string 
}> = ({ x, y, w, h, color, studs = 0, rotate = 0, className = "", opacity = "1" }) => {
  const depth = 10; 
  const studH = 4.5;
  const studRows = studs > 4 ? 2 : 1;
  const studsPerRow = Math.ceil(studs / studRows);
  const studSpacingX = w / (studsPerRow + 1);
  const studSpacingY = h / (studRows + 1);
  const studRadius = (w / (studsPerRow + 1)) * 0.42;

  return (
    <g transform={`rotate(${rotate} ${x + w/2} ${y + h/2})`} className={`${className} select-none`} opacity={opacity}>
      {/* Ground Shadow */}
      <rect x={x + 3} y={y + h + 3} width={w} height={depth + 2} fill="black" opacity="0.1" rx="2" />
      
      {/* 3D Side Face (Right) */}
      <path 
        d={`M ${x + w} ${y} L ${x + w + depth} ${y + depth} L ${x + w + depth} ${y + h + depth} L ${x + w} ${y + h} Z`} 
        fill={color}
      />
      <path 
        d={`M ${x + w} ${y} L ${x + w + depth} ${y + depth} L ${x + w + depth} ${y + h + depth} L ${x + w} ${y + h} Z`} 
        fill="black" opacity="0.25"
      />

      {/* 3D Front Face (Bottom) */}
      <path 
        d={`M ${x} ${y + h} L ${x + w} ${y + h} L ${x + w + depth} ${y + h + depth} L ${x + depth} ${y + h + depth} Z`} 
        fill={color}
      />
      <path 
        d={`M ${x} ${y + h} L ${x + w} ${y + h} L ${x + w + depth} ${y + h + depth} L ${x + depth} ${y + h + depth} Z`} 
        fill="black" opacity="0.15"
      />

      {/* Top Main Face */}
      <rect x={x} y={y} width={w} height={h} fill={color} rx="1.5" />
      
      {/* Gloss / Rim Highlights */}
      <path d={`M ${x} ${y + h} L ${x} ${y} L ${x + w} ${y}`} fill="none" stroke="white" strokeWidth="1" opacity="0.3" strokeLinecap="round" />
      <rect x={x + 2} y={y + 2} width={w - 4} height={h - 4} fill="white" opacity="0.05" rx="1" />

      {/* Studs */}
      {Array.from({ length: studs }).map((_, i) => {
        const row = Math.floor(i / studsPerRow);
        const col = i % studsPerRow;
        const cx = x + (col + 1) * studSpacingX;
        const cy = y + (row + 1) * studSpacingY;
        const capY = cy - studRadius - (studH / 2);

        return (
          <g key={i}>
            <ellipse cx={cx} cy={cy} rx={studRadius} ry={studRadius * 0.8} fill="black" opacity="0.05" />
            <rect x={cx - studRadius} y={cy - studRadius - studH} width={studRadius * 2} height={studH + 2} fill={color} />
            <rect x={cx - studRadius} y={cy - studRadius - studH} width={studRadius * 2} height={studH + 2} fill="black" opacity="0.1" />
            <ellipse cx={cx} cy={capY} rx={studRadius} ry={studRadius * 0.9} fill={color} />
            <ellipse cx={cx} cy={capY} rx={studRadius} ry={studRadius * 0.9} fill="white" opacity="0.1" />
            <ellipse cx={cx} cy={capY} rx={studRadius * 0.8} ry={studRadius * 0.7} fill="none" stroke="white" strokeWidth="0.5" opacity="0.2" />
            <g transform={`translate(${cx}, ${capY + 0.5}) scale(${studRadius / 12})`}>
              <text x="0" y="0" fontSize="6" fontFamily="Arial Black, sans-serif" fontWeight="900" fill="black" opacity="0.2" textAnchor="middle">L</text>
            </g>
          </g>
        );
      })}
    </g>
  );
};

const JourneyAnimation: React.FC = () => {
  return (
    <div className="relative w-full aspect-square bg-slate-50 rounded-[3rem] md:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[16px] md:border-[24px] border-legoBlue flex items-center justify-center">
      {/* Studio lighting base */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200"></div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>

      {/* Single Clean Scanning Line */}
      <div className="absolute inset-y-0 w-[2px] bg-white z-50 animate-[scanner-beam_6s_infinite] shadow-[0_0_15px_rgba(0,85,191,0.8),0_0_5px_white]"></div>

      <div className="relative w-full h-full p-8 md:p-12">
        {/* PILE LAYER: Hidden on the left of the beam as it moves right */}
        <div className="absolute inset-0 z-10 animate-[hide-pile_6s_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <RealisticBrick x={100} y={280} w={60} h={30} color="#0055BF" studs={8} rotate={15} />
            <RealisticBrick x={160} y={300} w={80} h={25} color="#FFD500" studs={4} rotate={-5} />
            <RealisticBrick x={240} y={270} w={70} h={35} color="#C91A09" studs={6} rotate={10} />
            <RealisticBrick x={120} y={220} w={50} h={25} color="#FFFFFF" studs={4} rotate={35} />
            <RealisticBrick x={210} y={240} w={60} h={30} color="#FFD500" studs={6} rotate={-10} />
            <RealisticBrick x={160} y={200} w={40} h={40} color="#0055BF" studs={4} rotate={-20} />
          </svg>
        </div>

        {/* BUILD LAYER: Revealed on the left of the beam as it moves right */}
        <div className="absolute inset-0 z-20 animate-[reveal-build_6s_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
            {/* Figure 1: Duck (0s - 6s) */}
            <g className="animate-[figure-duck_18s_infinite]">
              <RealisticBrick x={150} y={280} w={40} h={15} color="#C91A09" studs={2} />
              <RealisticBrick x={210} y={280} w={40} h={15} color="#C91A09" studs={2} />
              <RealisticBrick x={140} y={230} w={120} h={50} color="#FFD500" studs={8} />
              <RealisticBrick x={160} y={180} w={80} h={50} color="#FFD500" studs={6} />
              <RealisticBrick x={210} y={130} w={40} h={50} color="#FFD500" studs={4} />
              <RealisticBrick x={205} y={100} w={60} h={35} color="#FFD500" studs={4} />
              <circle cx={235} cy={115} r="4" fill="black" />
            </g>

            {/* Figure 2: Robot (6s - 12s) */}
            <g className="animate-[figure-robot_18s_infinite] opacity-0">
               <RealisticBrick x={180} y={280} w={40} h={60} color="#C91A09" studs={4} />
               <RealisticBrick x={230} y={280} w={40} h={60} color="#C91A09" studs={4} />
               <RealisticBrick x={170} y={210} w={110} h={70} color="#0055BF" studs={8} />
               <RealisticBrick x={205} y={150} w={40} h={60} color="#FFFFFF" studs={4} />
            </g>

            {/* Figure 3: Car (12s - 18s) */}
            <g className="animate-[figure-car_18s_infinite] opacity-0">
               <RealisticBrick x={140} y={260} w={160} h={30} color="#C91A09" studs={12} />
               <circle cx={170} cy={290} r="15" fill="#111" />
               <circle cx={270} cy={290} r="15" fill="#111" />
               <RealisticBrick x={180} y={230} w={80} h={30} color="#0055BF" opacity="0.7" studs={4} />
            </g>
          </svg>
        </div>
      </div>

      <div className="absolute top-8 left-8 flex items-center gap-2 font-mono text-[10px] text-legoBlue font-bold tracking-widest uppercase z-50">
        <div className="w-2 h-2 bg-legoRed rounded-full animate-pulse shadow-[0_0_8px_rgba(201,26,9,1)]"></div>
        <span>AI_ENGINE_ON</span>
      </div>
    </div>
  );
};

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
              {[1,2,3,4].map(i => <div key={i} className="w-2.5 h-2.5 bg-red-400 rounded-full"></div>)}
            </div>
          </div>
          <h1 className="font-heading text-3xl text-legoBlue">BrickVision</h1>
        </div>
        <BrickButton variant="blue" className="!text-sm !px-6" onClick={() => setIsModalOpen(true)}>
          {view === 'results' ? 'Rescan' : 'Analyze Now'}
        </BrickButton>
      </nav>

      {isLoading ? (
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-white">
          <div className="w-32 h-32 bg-legoYellow rounded-3xl border-8 border-legoBlue shadow-lego animate-bounce flex items-center justify-center text-6xl">🧱</div>
          <h2 className="mt-12 font-heading text-5xl text-legoBlue animate-pulse text-center">Identifying Geometry...</h2>
        </div>
      ) : (
        view === 'landing' ? (
          <section className="max-w-7xl mx-auto px-6 py-16 grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-10 text-center lg:text-left">
              <div className="inline-block bg-legoRed text-white px-6 py-2 rounded-xl font-heading text-sm tracking-widest uppercase">Official AI Builder</div>
              <h2 className="font-heading text-7xl md:text-9xl text-legoBlue leading-none">
                A Pile of <br/> Bricks. <br/>
                <span className="text-legoRed">Infinite Fun.</span>
              </h2>
              <p className="text-2xl text-gray-500 font-bold max-w-xl mx-auto lg:mx-0">Our Vision AI identifies your bricks and suggests masterpiece micro-builds instantly.</p>
              <BrickButton onClick={() => setIsModalOpen(true)} className="!px-12 !py-6 !text-3xl !rounded-3xl shadow-lego">Get Started ✨</BrickButton>
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
        <footer className="bg-legoBlue text-white py-20 text-center border-t-[10px] border-legoYellow">
          <p className="font-black opacity-40 uppercase tracking-[0.4em] text-xs">BrickVision Lab // Powered by Gemini</p>
        </footer>
      )}
    </div>
  );
};

export default App;
