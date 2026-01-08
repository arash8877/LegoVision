
import React, { useState } from 'react';
import BrickButton from './components/BrickButton';
import VisionModal from './components/VisionModal';
import ResultsView from './components/ResultsView';
import { analyzeBrickPile } from './services/geminiService';
import { VisionAnalysis } from './types';

type ViewState = 'landing' | 'results';

/**
 * Cartoon-Style LEGO Brick Component (SVG Implementation)
 * Enforces uniform color rules:
 * - Sides use the same base color with a simple opacity overlay for shading.
 * - Studs match the body color perfectly.
 */
const RealisticBrick: React.FC<{ 
  x: number, y: number, w: number, h: number, color: string, studs?: number, rotate?: number, className?: string, opacity?: string 
}> = ({ x, y, w, h, color, studs = 0, rotate = 0, className = "", opacity = "1" }) => {
  const cornerRadius = 10;
  const faceDepth = 12; 
  const studTopHeight = 6; 
  const outlineColor = "rgba(0,0,0,0.2)";
  const outlineWidth = 1.5;
  
  const studRows = studs > 4 ? 2 : 1;
  const studsPerRow = Math.ceil(studs / studRows);
  const studSpacingX = w / (studsPerRow + 1);
  const studSpacingY = h / (studRows + 1);
  const studRadius = (w / (studsPerRow + 1)) * 0.42;

  return (
    <g transform={`rotate(${rotate} ${x + w/2} ${y + h/2})`} className={`${className} select-none`} opacity={opacity}>
      {/* 1. Ground Shadow */}
      <rect x={x + 4} y={y + faceDepth + 4} width={w} height={h} rx={cornerRadius} fill="black" opacity="0.05" />

      {/* 2. Side Face (Ensuring uniform color with subtle darkening) */}
      <rect 
        x={x} 
        y={y + (faceDepth / 2)} 
        width={w} 
        height={h + (faceDepth / 2)} 
        rx={cornerRadius} 
        fill={color} 
      />
      <rect 
        x={x} 
        y={y + (faceDepth / 2)} 
        width={w} 
        height={h + (faceDepth / 2)} 
        rx={cornerRadius} 
        fill="black" 
        opacity="0.15" 
      />
      <rect 
        x={x} 
        y={y + (faceDepth / 2)} 
        width={w} 
        height={h + (faceDepth / 2)} 
        rx={cornerRadius} 
        fill="none" 
        stroke={outlineColor} 
        strokeWidth={outlineWidth} 
      />

      {/* 3. Top Face (Main color) */}
      <rect 
        x={x} 
        y={y} 
        width={w} 
        height={h} 
        rx={cornerRadius} 
        fill={color} 
      />
      <rect 
        x={x} 
        y={y} 
        width={w} 
        height={h} 
        rx={cornerRadius} 
        fill="none" 
        stroke={outlineColor} 
        strokeWidth={outlineWidth} 
      />

      {/* 4. Studs (Matching Body Color) */}
      {Array.from({ length: studs }).map((_, i) => {
        const row = Math.floor(i / studsPerRow);
        const col = i % studsPerRow;
        const cx = x + (col + 1) * studSpacingX;
        const cy = y + (row + 1) * studSpacingY;

        return (
          <g key={i}>
            {/* Stud Side */}
            <circle cx={cx} cy={cy} r={studRadius} fill={color} />
            <circle cx={cx} cy={cy} r={studRadius} fill="black" opacity="0.1" />
            <circle cx={cx} cy={cy} r={studRadius} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />
            
            {/* Stud Top - Same Color */}
            <circle cx={cx} cy={cy - studTopHeight} r={studRadius} fill={color} />
            
            {/* Stud Highlight (Stylized) */}
            <circle cx={cx - (studRadius * 0.3)} cy={cy - studTopHeight - (studRadius * 0.3)} r={studRadius * 0.25} fill="white" opacity="0.3" />
            
            {/* Stud Outline */}
            <circle cx={cx} cy={cy - studTopHeight} r={studRadius} fill="none" stroke={outlineColor} strokeWidth={outlineWidth} />
          </g>
        );
      })}
    </g>
  );
};

const JourneyAnimation: React.FC = () => {
  return (
    <div className="relative w-full aspect-square bg-slate-50 rounded-[3rem] md:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[16px] md:border-[24px] border-legoBlue flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200"></div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute inset-y-0 w-[4px] bg-white z-50 animate-[scanner-beam_6s_infinite] shadow-[0_0_20px_white,0_0_10px_rgba(0,85,191,0.6)]"></div>

      <div className="relative w-full h-full p-8 md:p-12">
        <div className="absolute inset-0 z-10 animate-[hide-pile_6s_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <RealisticBrick x={100} y={280} w={65} h={40} color="#0055BF" studs={8} rotate={15} />
            <RealisticBrick x={170} y={300} w={85} h={35} color="#FFD500" studs={4} rotate={-5} />
            <RealisticBrick x={250} y={270} w={75} h={45} color="#C91A09" studs={6} rotate={10} />
            <RealisticBrick x={120} y={220} w={60} h={35} color="#FFFFFF" studs={4} rotate={35} />
            <RealisticBrick x={220} y={240} w={70} h={40} color="#FFD500" studs={6} rotate={-10} />
            <RealisticBrick x={160} y={190} w={50} h={50} color="#0055BF" studs={4} rotate={-20} />
          </svg>
        </div>

        <div className="absolute inset-0 z-20 animate-[reveal-build_6s_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            <g className="animate-[figure-duck_18s_infinite]">
              <RealisticBrick x={150} y={280} w={45} h={25} color="#C91A09" studs={2} />
              <RealisticBrick x={215} y={280} w={45} h={25} color="#C91A09" studs={2} />
              <RealisticBrick x={140} y={220} w={130} h={65} color="#FFD500" studs={8} />
              <RealisticBrick x={165} y={160} w={85} h={65} color="#FFD500" studs={6} />
              <RealisticBrick x={220} y={100} w={50} h={65} color="#FFD500" studs={4} />
              <RealisticBrick x={215} y={65} w={75} h={45} color="#FFD500" studs={4} />
              <circle cx={255} cy={85} r="6" fill="black" opacity="0.6" />
            </g>
            <g className="animate-[figure-robot_18s_infinite] opacity-0">
               <RealisticBrick x={175} y={280} w={50} h={75} color="#C91A09" studs={4} />
               <RealisticBrick x={235} y={280} w={50} h={75} color="#C91A09" studs={4} />
               <RealisticBrick x={165} y={185} w={130} h={100} color="#0055BF" studs={8} />
               <RealisticBrick x={210} y={120} w={50} h={75} color="#FFFFFF" studs={4} />
               <circle cx={225} cy={145} r="4" fill="black" opacity="0.5" />
               <circle cx={245} cy={145} r="4" fill="black" opacity="0.5" />
            </g>
            <g className="animate-[figure-car_18s_infinite] opacity-0">
               <RealisticBrick x={130} y={260} w={200} h={40} color="#C91A09" studs={12} />
               <circle cx={170} cy={305} r="22" fill="#222" />
               <circle cx={290} cy={305} r="22" fill="#222" />
               <circle cx={170} cy={305} r="8" fill="#555" />
               <circle cx={290} cy={305} r="8" fill="#555" />
               <RealisticBrick x={180} y={220} w={110} h={45} color="#0055BF" opacity="0.6" studs={4} />
            </g>
          </svg>
        </div>
      </div>

      <div className="absolute top-8 left-8 flex items-center gap-2 font-mono text-[11px] text-legoBlue font-black tracking-widest uppercase z-50">
        <div className="w-2.5 h-2.5 bg-legoRed rounded-full animate-pulse shadow-[0_0_10px_rgba(201,26,9,1)]"></div>
        <span>SYSTEM_SCANNING</span>
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
              {[1,2,3,4].map(i => <div key={i} className="w-2.5 h-2.5 bg-white/40 rounded-full"></div>)}
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
          <div className="w-32 h-32 bg-legoYellow rounded-[2rem] border-8 border-legoBlue shadow-lego animate-bounce flex items-center justify-center text-6xl">🧩</div>
          <h2 className="mt-12 font-heading text-5xl text-legoBlue animate-pulse text-center">Precise Piece Inventory...</h2>
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
          <p className="font-black opacity-30 uppercase tracking-[0.4em] text-xs">BrickVision Lab // Powered by Gemini</p>
        </footer>
      )}
    </div>
  );
};

export default App;
