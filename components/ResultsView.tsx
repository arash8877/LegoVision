
import React, { useState, useEffect, useRef } from 'react';
import { VisionAnalysis, MicroBuild } from '../types';
import BrickButton from './BrickButton';
import { generateBuildImage } from '../services/geminiService';

interface ResultsViewProps {
  result: VisionAnalysis;
  sourceImage: string;
  onReset: () => void;
  onNewScan: () => void;
  onRegenerate: () => void;
  isRegenerating?: boolean;
}

const ResultsView: React.FC<ResultsViewProps> = ({ 
  result, 
  sourceImage, 
  onReset, 
  onNewScan, 
  onRegenerate,
  isRegenerating = false
}) => {
  return (
    <div className="min-h-screen bg-legoGray flex flex-col animate-in fade-in duration-500">
      {/* Header Bar */}
      <div className="bg-legoBlue text-white p-4 shadow-lg sticky top-[68px] md:top-[72px] z-30 brick-bevel">
        <div className="max-w-7xl mx-auto flex justify-between items-center gap-4">
          <button 
            onClick={onReset}
            className="flex items-center gap-2 hover:text-legoYellow transition-colors font-bold text-sm md:text-base"
          >
            <span className="text-xl leading-none">←</span> <span className="hidden sm:inline">Back Home</span>
          </button>
          <div className="hidden lg:block font-heading text-lg">Build Your Micro-Worlds</div>
          <BrickButton variant="yellow" className="!py-1.5 !px-4 !text-xs md:!text-sm" onClick={onNewScan}>
            New Scan 📸
          </BrickButton>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-8 md:py-12 w-full flex-1">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-2xl border-4 border-legoBlue overflow-hidden shadow-xl lg:sticky lg:top-[160px]">
              <div className="aspect-square relative group">
                <img src={sourceImage} alt="Original Pile" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-legoBlue/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <span className="bg-white text-legoBlue text-[10px] font-black px-2 py-1 rounded shadow-sm">YOUR PILE</span>
                </div>
              </div>
              <div className="p-5 bg-legoBlue/5">
                <h3 className="font-heading text-legoBlue text-sm mb-3 uppercase tracking-tight">Identified Bricks</h3>
                <div className="flex flex-wrap gap-2">
                  {result.identifiedBricks.map((brick, i) => (
                    <span key={i} className="bg-white px-2 py-1 rounded-md text-[10px] font-bold border border-legoBlue/10 shadow-sm text-gray-700">
                      {brick}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Main Suggestions Grid */}
          <div className="lg:col-span-3">
            <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
              <div>
                <h2 className="font-heading text-3xl md:text-4xl text-legoBlue mb-2">3 New Possibilities</h2>
                <p className="text-gray-600 font-semibold italic">Customized to your exact pieces and colors.</p>
              </div>
              <BrickButton 
                variant="red" 
                className="!py-2 !px-6 !text-base shrink-0 sm:self-end" 
                onClick={onRegenerate}
                disabled={isRegenerating}
              >
                {isRegenerating ? 'Thinking...' : 'Regenerate Ideas ✨'}
              </BrickButton>
            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8 mb-12">
              {result.suggestions.map((build, i) => (
                <BuildCard key={`${build.title}-${i}`} build={build} sourceImage={sourceImage} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const BuildCard: React.FC<{ build: MicroBuild; sourceImage: string }> = ({ build, sourceImage }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [buildImage, setBuildImage] = useState<string | null>(null);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const hasRequestedImage = useRef(false);

  useEffect(() => {
    // Only generate once when expanded
    if (showDetails && !buildImage && !isGeneratingImage && !hasRequestedImage.current) {
      const fetchImage = async () => {
        hasRequestedImage.current = true;
        setIsGeneratingImage(true);
        try {
          const base64 = sourceImage.split(',')[1];
          // Pass the specific requiredBricks for high visual fidelity to the photo
          const imgUrl = await generateBuildImage(base64, build.title, build.requiredBricks);
          setBuildImage(imgUrl);
        } catch (error) {
          console.error("Failed to generate build image", error);
          hasRequestedImage.current = false; // Allow retry
        } finally {
          setIsGeneratingImage(false);
        }
      };
      fetchImage();
    }
  }, [showDetails, buildImage, isGeneratingImage, build.title, build.requiredBricks, sourceImage]);

  return (
    <div className={`
      bg-white rounded-[2rem] border-4 border-legoBlue shadow-lg overflow-hidden flex flex-col transition-all duration-300
      ${showDetails ? 'ring-8 ring-legoYellow/30 scale-[1.02]' : 'hover:scale-[1.03]'}
    `}>
      <div className="bg-legoBlue p-6 flex justify-between items-center text-white relative">
        <span className="text-5xl filter drop-shadow-lg leading-none">{build.icon}</span>
        <div className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full border border-white/30">
          <span className="text-[10px] font-black uppercase tracking-widest">{build.difficulty}</span>
        </div>
      </div>
      
      <div className="p-6 flex-1">
        <h4 className="font-heading text-2xl mb-3 text-legoBlue leading-tight">{build.title}</h4>
        <p className="text-sm text-gray-600 mb-6 font-semibold leading-relaxed line-clamp-3">{build.description}</p>
        
        <div className="flex items-center gap-3 px-4 py-3 bg-legoGray rounded-2xl border-2 border-legoBlue/5 shadow-inner">
          <span className="text-xl">🧩</span>
          <div className="flex flex-col">
             <span className="text-[10px] font-black text-legoBlue/40 uppercase tracking-tighter leading-none mb-0.5">Complexity</span>
             <span className="text-sm font-black text-legoBlue">~{build.estimatedPieces} bricks</span>
          </div>
        </div>
      </div>

      <button 
        onClick={() => setShowDetails(!showDetails)}
        className={`
          w-full font-heading py-4 transition-all duration-300 border-t-4 border-legoBlue flex items-center justify-center gap-2
          ${showDetails ? 'bg-legoRed text-white hover:bg-red-700' : 'bg-legoYellow text-black hover:bg-yellow-400'}
        `}
      >
        {showDetails ? (
           <><span>Close Manual</span> <span className="text-lg leading-none">✖</span></>
        ) : (
           <><span>View Instructions</span> <span className="text-lg leading-none">➔</span></>
        )}
      </button>

      {showDetails && (
        <div className="p-6 bg-white border-t-2 border-legoBlue/10 animate-in slide-in-from-top-4 duration-500">
          <h5 className="font-heading text-legoRed text-xs mb-6 uppercase tracking-[0.2em] border-b-2 border-legoRed/10 pb-2">Construction Steps</h5>
          <ol className="space-y-6 mb-8">
            {build.steps.map((step, idx) => (
              <li key={idx} className="flex gap-4 group">
                <span className="flex-none w-8 h-8 rounded-xl bg-legoBlue text-white flex items-center justify-center text-xs font-black shadow-lego-blue">
                  {idx + 1}
                </span>
                <span className="text-sm text-gray-700 font-bold leading-relaxed group-hover:text-legoBlue transition-colors">{step}</span>
              </li>
            ))}
          </ol>
          
          <div className="mt-8 pt-6 border-t-2 border-dashed border-legoGray">
            <h5 className="font-heading text-legoBlue text-xs mb-4 uppercase tracking-[0.2em] text-center">Reference Visual</h5>
            <div className="relative aspect-video rounded-2xl overflow-hidden border-4 border-legoYellow shadow-xl bg-legoGray flex items-center justify-center group">
               {buildImage ? (
                 <img src={buildImage} alt={`Finished ${build.title}`} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-700" />
               ) : (
                 <div className="flex flex-col items-center gap-4 p-8 text-center">
                   <div className="w-10 h-10 border-4 border-legoYellow border-t-legoBlue rounded-full animate-spin"></div>
                   <span className="text-[10px] font-black text-legoBlue/50 uppercase animate-pulse leading-relaxed">Designing with your<br/>specific bricks...</span>
                 </div>
               )}
            </div>
            <div className="mt-4 flex justify-center">
              <div className="px-4 py-1.5 bg-legoBlue/10 rounded-full text-[10px] font-black text-legoBlue uppercase tracking-widest text-center">
                AI Blueprint Projection 🧱
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsView;
