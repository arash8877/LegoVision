
import React from 'react';
import { VisionAnalysis } from '../types';
import BrickButton from './BrickButton';
import BuildCard from './BuildCard';

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
  const noBricksFound = result.identifiedBricks.length === 0;

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
                   <span className="bg-white text-legoBlue text-[10px] font-black px-2 py-1 rounded shadow-sm">YOUR PHOTO</span>
                </div>
              </div>
              <div className="p-5 bg-legoBlue/5">
                <h3 className="font-heading text-legoBlue text-sm mb-3 uppercase tracking-tight">Identified Bricks</h3>
                <div className="flex flex-wrap gap-2">
                  {!noBricksFound ? (
                    result.identifiedBricks.map((brick, i) => (
                      <span key={i} className="bg-white px-2 py-1 rounded-md text-[10px] font-bold border border-legoBlue/10 shadow-sm text-gray-700">
                        {brick}
                      </span>
                    ))
                  ) : (
                    <div className="w-full py-2">
                      <p className="text-legoRed text-[10px] font-black uppercase tracking-tight leading-tight">
                        No LEGO pieces were found in this image.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Main Suggestions Grid / Empty State */}
          <div className="lg:col-span-3">
            {noBricksFound ? (
              <div className="bg-white rounded-[3rem] p-12 md:p-20 text-center border-4 border-dashed border-legoBlue/20 shadow-inner animate-in zoom-in duration-500">
                 <div className="text-8xl mb-8 transform hover:rotate-12 transition-transform cursor-default">🏜️</div>
                 <h2 className="font-heading text-4xl md:text-5xl text-legoBlue mb-6">Zero Bricks Detected</h2>
                 <p className="text-xl text-gray-500 font-bold max-w-xl mx-auto italic mb-10 leading-relaxed">
                   We scanned your image but couldn't find any identifiable LEGO® pieces. Try taking a photo with better lighting on a solid background!
                 </p>
                 <BrickButton variant="red" className="!px-12 !py-5 !text-2xl" onClick={onNewScan}>
                   Try Another Photo 📸
                 </BrickButton>
              </div>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ResultsView;
