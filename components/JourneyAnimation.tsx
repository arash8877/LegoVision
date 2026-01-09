
import React from 'react';
import RealisticBrick from './RealisticBrick';

const JourneyAnimation: React.FC = () => {
  return (
    <div className="relative w-full aspect-square bg-slate-50 rounded-[3rem] md:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[16px] md:border-[24px] border-legoBlue flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200"></div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute inset-y-0 w-[4px] bg-white z-50 animate-[scanner-beam_6s_infinite] shadow-[0_0_20px_white,0_0_10px_rgba(0,85,191,0.6)]"></div>

      <div className="relative w-full h-full p-8 md:p-12">
        {/* PILE OF 16 BRICKS */}
        <div className="absolute inset-0 z-10 animate-[hide-pile_6s_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Red Inventory (2x 2x4, 2x 2x2) */}
            <RealisticBrick x={50} y={280} w={90} h={45} color="#C91A09" studs={8} rotate={15} />
            <RealisticBrick x={300} y={240} w={90} h={45} color="#C91A09" studs={8} rotate={-10} />
            <RealisticBrick x={120} y={210} w={45} h={45} color="#C91A09" studs={4} rotate={35} />
            <RealisticBrick x={210} y={180} w={45} h={45} color="#C91A09" studs={4} rotate={-20} />

            {/* Blue Inventory (2x 2x4, 2x 2x2) */}
            <RealisticBrick x={100} y={320} w={90} h={45} color="#0055BF" studs={8} rotate={-5} />
            <RealisticBrick x={240} y={290} w={90} h={45} color="#0055BF" studs={8} rotate={20} />
            <RealisticBrick x={60} y={220} w={45} h={45} color="#0055BF" studs={4} rotate={15} />
            <RealisticBrick x={180} y={340} w={45} h={45} color="#0055BF" studs={4} rotate={-45} />

            {/* Yellow Inventory (2x 2x4, 2x 2x2) */}
            <RealisticBrick x={160} y={300} w={90} h={45} color="#FFD500" studs={8} rotate={10} />
            <RealisticBrick x={40} y={340} w={90} h={45} color="#FFD500" studs={8} rotate={-15} />
            <RealisticBrick x={260} y={200} w={45} h={45} color="#FFD500" studs={4} rotate={60} />
            <RealisticBrick x={320} y={310} w={45} h={45} color="#FFD500" studs={4} rotate={-10} />

            {/* White Inventory (2x 1x4, 2x 2x2) */}
            <RealisticBrick x={140} y={250} w={90} h={25} color="#FFFFFF" studs={4} rotate={80} />
            <RealisticBrick x={240} y={340} w={90} h={25} color="#FFFFFF" studs={4} rotate={5} />
            <RealisticBrick x={10} y={300} w={45} h={45} color="#FFFFFF" studs={4} rotate={-30} />
            <RealisticBrick x={330} y={180} w={45} h={45} color="#FFFFFF" studs={4} rotate={40} />
          </svg>
        </div>

        {/* BUILDS REVEALED AFTER SCAN */}
        <div className="absolute inset-0 z-20 animate-[reveal-build_6s_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Build 1: Duck (Strict Subset) */}
            <g className="animate-[figure-duck_18s_infinite]">
              {/* Legs: 2x Red 2x2 */}
              <RealisticBrick x={165} y={280} w={35} h={35} color="#C91A09" studs={4} />
              <RealisticBrick x={200} y={280} w={35} h={35} color="#C91A09" studs={4} />
              {/* Body: 1x Yellow 2x4 */}
              <RealisticBrick x={155} y={215} w={90} h={45} color="#FFD500" studs={8} />
              {/* Head: 1x Yellow 2x2 */}
              <RealisticBrick x={155} y={170} w={45} h={45} color="#FFD500" studs={4} />
              {/* Tail/Feather: 1x White 2x2 */}
              <RealisticBrick x={235} y={200} w={25} h={25} color="#FFFFFF" studs={4} />
            </g>

            {/* Build 2: Robot (Strict Subset) */}
            <g className="animate-[figure-robot_18s_infinite] opacity-0">
              {/* Feet: 2x Blue 2x2 */}
              <RealisticBrick x={170} y={280} w={30} h={30} color="#0055BF" studs={4} />
              <RealisticBrick x={210} y={280} w={30} h={30} color="#0055BF" studs={4} />
              {/* Body: 1x Blue 2x4 */}
              <RealisticBrick x={165} y={200} w={80} h={80} color="#0055BF" studs={8} />
              {/* Head: 1x White 2x2 */}
              <RealisticBrick x={190} y={155} w={30} h={30} color="#FFFFFF" studs={4} />
              {/* Arms: 2x White 1x4 */}
              <RealisticBrick x={135} y={210} w={30} h={60} color="#FFFFFF" studs={4} rotate={15} />
              <RealisticBrick x={245} y={210} w={30} h={60} color="#FFFFFF" studs={4} rotate={-15} />
            </g>

            {/* Build 3: Rocket (Strict Subset) */}
            <g className="animate-[figure-car_18s_infinite] opacity-0">
              {/* Base Fins: 2x Yellow 2x2 */}
              <RealisticBrick x={140} y={260} w={40} h={40} color="#FFD500" studs={4} rotate={-20} />
              <RealisticBrick x={220} y={260} w={40} h={40} color="#FFD500" studs={4} rotate={20} />
              {/* Bottom Stage: 1x Yellow 2x4 */}
              <RealisticBrick x={155} y={250} w={90} h={45} color="#FFD500" studs={8} />
              {/* Mid Stage: 1x Red 2x4 */}
              <RealisticBrick x={155} y={205} w={90} h={45} color="#C91A09" studs={8} />
              {/* Top Section: 1x Blue 2x4 */}
              <RealisticBrick x={155} y={160} w={90} h={45} color="#0055BF" studs={8} />
            </g>
          </svg>
        </div>
      </div>

      <div className="absolute top-8 left-8 flex items-center gap-2 font-mono text-[11px] text-legoBlue font-black tracking-widest uppercase z-50">
        <div className="w-2.5 h-2.5 bg-legoRed rounded-full animate-pulse shadow-[0_0_10px_rgba(201,26,9,1)]"></div>
        <span className="flex items-center">
          Analyzing<span className="animate-dots w-4 text-left"></span>
        </span>
      </div>
    </div>
  );
};

export default JourneyAnimation;
