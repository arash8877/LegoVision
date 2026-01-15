
import React from 'react';
import RealisticBrick from './RealisticBrick';

interface JourneyAnimationProps {
  imageUrl?: string | null;
  className?: string;
  isProcessing?: boolean;
}

const JourneyAnimation: React.FC<JourneyAnimationProps> = ({ imageUrl, className = "", isProcessing = false }) => {
  // Inventory Colors for SVG fallbacks
  const RED = "#C91A09";
  const BLUE = "#0055BF";
  const YELLOW = "#FFD500";
  const WHITE = "#FFFFFF";

  if (isProcessing) {
    return (
      <div className={`relative w-full aspect-square bg-slate-50 rounded-[3rem] md:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[16px] md:border-[24px] border-legoBlue flex items-center justify-center ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200"></div>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
        
        <div className="relative w-full h-full flex items-center justify-center p-8 md:p-12 animate-bob">
          {imageUrl ? (
            <div className="w-full h-full rounded-[2rem] overflow-hidden border-8 border-white shadow-2xl">
              <img src={imageUrl} alt="Processing Pile" className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="w-full h-full bg-white/50 backdrop-blur-sm rounded-[2rem] border-8 border-white flex items-center justify-center shadow-2xl">
              <span className="text-8xl">📦</span>
            </div>
          )}
        </div>

        {/* Centered Analyzing Badge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-3 font-mono text-[13px] md:text-[16px] text-legoBlue font-black tracking-[0.15em] uppercase z-50 bg-white/95 backdrop-blur-md px-6 py-4 rounded-[1.5rem] border-4 border-legoBlue shadow-[0_20px_40px_rgba(0,0,0,0.2)] scale-110 md:scale-125">
          <div className="w-4 h-4 bg-legoRed rounded-full animate-pulse shadow-[0_0_15px_rgba(201,26,9,0.8)]"></div>
          <span className="flex items-center whitespace-nowrap">
            Analyzing<span className="animate-dots w-6 text-left"></span>
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative w-full aspect-square bg-slate-50 rounded-[3rem] md:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[16px] md:border-[24px] border-legoBlue flex items-center justify-center ${className}`}>
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200"></div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      
      {/* Precision Scanning Beam */}
      <div className="absolute inset-y-0 w-[4px] bg-white z-50 animate-[scanner-beam_6s_infinite] shadow-[0_0_20px_white,0_0_10px_rgba(0,85,191,0.6)]"></div>

      <div className="relative w-full h-full p-8 md:p-12">
        {/* PILE: Either the uploaded image or the deterministic SVG pile */}
        <div className="absolute inset-0 z-10 animate-[hide-pile_6s_infinite] flex items-center justify-center">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt="Uploaded Pile" 
              className="w-full h-full object-cover"
            />
          ) : (
            <svg viewBox="0 0 400 400" className="w-full h-full">
              {/* Fallback deterministic pile if no image provided */}
              <RealisticBrick x={40} y={320} w={60} h={30} color={RED} studs={8} rotate={15} />
              <RealisticBrick x={280} y={340} w={60} h={30} color={BLUE} studs={8} rotate={-10} />
              <RealisticBrick x={150} y={320} w={60} h={30} color={YELLOW} studs={8} rotate={10} />
              <RealisticBrick x={110} y={220} w={30} h={30} color={RED} studs={4} rotate={35} />
              <RealisticBrick x={250} y={310} w={60} h={30} color={BLUE} studs={8} rotate={20} />
              <RealisticBrick x={30} y={280} w={60} h={30} color={YELLOW} studs={8} rotate={-15} />
              <RealisticBrick x={130} y={260} w={60} h={15} color={WHITE} studs={4} rotate={80} />
              <RealisticBrick x={50} y={160} w={30} h={30} color={WHITE} studs={4} rotate={-30} />
              <RealisticBrick x={210} y={190} w={30} h={30} color={RED} studs={4} rotate={-20} />
              <RealisticBrick x={70} y={240} w={30} h={30} color={BLUE} studs={4} rotate={15} />
              <RealisticBrick x={300} y={200} w={60} h={30} color={BLUE} studs={8} rotate={30} />
            </svg>
          )}
        </div>

        {/* BUILDS REVEALED AFTER SCAN */}
        <div className="absolute inset-0 z-20 animate-[reveal-build_6s_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Build 1: Duck */}
            <g className="animate-[figure-duck_18s_infinite]">
              <RealisticBrick x={180} y={260} w={20} h={20} color="#FFD500" studs={4} />
              <RealisticBrick x={200} y={260} w={20} h={20} color="#FFD500" studs={4} />
              <RealisticBrick x={160} y={215} w={80} h={40} color="#FFD500" studs={8} />
              <RealisticBrick x={170} y={190} w={60} h={30} color="#FFD500" studs={8} />
              <RealisticBrick x={170} y={160} w={30} h={30} color="#FFD500" studs={4} />
              <RealisticBrick x={200} y={170} w={30} h={10} color="#C91A09" studs={4} />
              <RealisticBrick x={235} y={195} w={20} h={20} color="#FFFFFF" studs={4} />
            </g>

            {/* Build 2: Robot */}
            <g className="animate-[figure-robot_18s_infinite] opacity-0">
              <RealisticBrick x={180} y={285} w={20} h={20} color="#0055BF" studs={4} />
              <RealisticBrick x={200} y={285} w={20} h={20} color="#0055BF" studs={4} />
              <RealisticBrick x={180} y={245} w={20} h={40} color="#0055BF" studs={4} />
              <RealisticBrick x={200} y={245} w={20} h={40} color="#0055BF" studs={4} />
              <RealisticBrick x={165} y={215} w={70} h={30} color="#0055BF" studs={8} />
              <RealisticBrick x={145} y={220} w={20} h={20} color="#0055BF" studs={4} />
              <RealisticBrick x={235} y={220} w={20} h={20} color="#0055BF" studs={4} />
              <RealisticBrick x={190} y={185} w={20} h={25} color="#FFFFFF" studs={4} />
              <RealisticBrick x={185} y={210} w={30} h={10} color="#C91A09" studs={4} />
            </g>

            {/* Build 3: Race Car */}
            <g className="animate-[figure-car_18s_infinite] opacity-0">
              <RealisticBrick x={145} y={275} w={25} h={25} color="#C91A09" studs={4} />
              <RealisticBrick x={235} y={275} w={25} h={25} color="#C91A09" studs={4} />
              <RealisticBrick x={140} y={250} w={120} h={35} color="#0055BF" studs={8} />
              <RealisticBrick x={165} y={220} w={70} h={35} color="#FFD500" studs={8} />
              <RealisticBrick x={185} y={195} w={30} h={30} color="#FFFFFF" studs={4} />
              <RealisticBrick x={215} y={225} w={30} h={20} color="#C91A09" studs={4} />
              <RealisticBrick x={135} y={225} w={15} h={25} color="#FFD500" studs={2} />
              <RealisticBrick x={130} y={205} w={50} h={20} color="#C91A09" studs={4} rotate={-5} />
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default JourneyAnimation;
