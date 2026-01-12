
import React from 'react';
import RealisticBrick from './RealisticBrick';

const JourneyAnimation: React.FC = () => {
  return (
    <div className="relative w-full aspect-square bg-slate-50 rounded-[3rem] md:rounded-[5rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.3)] overflow-hidden border-[16px] md:border-[24px] border-legoBlue flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-br from-white via-gray-100 to-gray-200"></div>
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
      <div className="absolute inset-y-0 w-[4px] bg-white z-50 animate-[scanner-beam_6s_infinite] shadow-[0_0_20px_white,0_0_10px_rgba(0,85,191,0.6)]"></div>

      <div className="relative w-full h-full p-8 md:p-12">
        {/* PILE OF 30 BRICKS (Scaled down for density) */}
        <div className="absolute inset-0 z-10 animate-[hide-pile_6s_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Red Inventory (8 pieces) */}
            <RealisticBrick x={40} y={320} w={60} h={30} color="#C91A09" studs={8} rotate={15} />
            <RealisticBrick x={280} y={340} w={60} h={30} color="#C91A09" studs={8} rotate={-10} />
            <RealisticBrick x={110} y={220} w={30} h={30} color="#C91A09" studs={4} rotate={35} />
            <RealisticBrick x={210} y={190} w={30} h={30} color="#C91A09" studs={4} rotate={-20} />
            <RealisticBrick x={50} y={200} w={60} h={30} color="#C91A09" studs={8} rotate={10} />
            <RealisticBrick x={340} y={250} w={30} h={30} color="#C91A09" studs={4} rotate={45} />
            <RealisticBrick x={180} y={240} w={60} h={15} color="#C91A09" studs={4} rotate={-5} />
            <RealisticBrick x={20} y={350} w={30} h={30} color="#C91A09" studs={4} rotate={-15} />

            {/* Blue Inventory (8 pieces) */}
            <RealisticBrick x={90} y={350} w={60} h={30} color="#0055BF" studs={8} rotate={-5} />
            <RealisticBrick x={250} y={310} w={60} h={30} color="#0055BF" studs={8} rotate={20} />
            <RealisticBrick x={70} y={240} w={30} h={30} color="#0055BF" studs={4} rotate={15} />
            <RealisticBrick x={190} y={360} w={30} h={30} color="#0055BF" studs={4} rotate={-45} />
            <RealisticBrick x={300} y={200} w={60} h={30} color="#0055BF" studs={8} rotate={30} />
            <RealisticBrick x={220} y={150} w={30} h={30} color="#0055BF" studs={4} rotate={5} />
            <RealisticBrick x={350} y={320} w={60} h={15} color="#0055BF" studs={4} rotate={90} />
            <RealisticBrick x={10} y={220} w={30} h={30} color="#0055BF" studs={4} rotate={-30} />

            {/* Yellow Inventory (8 pieces) */}
            <RealisticBrick x={150} y={320} w={60} h={30} color="#FFD500" studs={8} rotate={10} />
            <RealisticBrick x={30} y={280} w={60} h={30} color="#FFD500" studs={8} rotate={-15} />
            <RealisticBrick x={260} y={240} w={30} h={30} color="#FFD500" studs={4} rotate={60} />
            <RealisticBrick x={320} y={280} w={30} h={30} color="#FFD500" studs={4} rotate={-10} />
            <RealisticBrick x={140} y={180} w={60} h={30} color="#FFD500" studs={8} rotate={25} />
            <RealisticBrick x={220} y={290} w={30} h={30} color="#FFD500" studs={4} rotate={-40} />
            <RealisticBrick x={80} y={140} w={60} h={15} color="#FFD500" studs={4} rotate={0} />
            <RealisticBrick x={340} y={150} w={30} h={30} color="#FFD500" studs={4} rotate={15} />

            {/* White Inventory (6 pieces) */}
            <RealisticBrick x={130} y={260} w={60} h={15} color="#FFFFFF" studs={4} rotate={80} />
            <RealisticBrick x={250} y={360} w={60} h={15} color="#FFFFFF" studs={4} rotate={5} />
            <RealisticBrick x={50} y={160} w={30} h={30} color="#FFFFFF" studs={4} rotate={-30} />
            <RealisticBrick x={300} y={360} w={30} h={30} color="#FFFFFF" studs={4} rotate={40} />
            <RealisticBrick x={100} y={190} w={60} h={30} color="#FFFFFF" studs={8} rotate={-20} />
            <RealisticBrick x={180} y={130} w={30} h={30} color="#FFFFFF" studs={4} rotate={15} />
          </svg>
        </div>

        {/* BUILDS REVEALED AFTER SCAN */}
        <div className="absolute inset-0 z-20 animate-[reveal-build_6s_infinite]">
          <svg viewBox="0 0 400 400" className="w-full h-full">
            {/* Build 1: Duck (Improved detail with subset) */}
            <g className="animate-[figure-duck_18s_infinite]">
              {/* Legs: 2x Red 2x2 */}
              <RealisticBrick x={175} y={260} w={25} h={25} color="#C91A09" studs={4} />
              <RealisticBrick x={200} y={260} w={25} h={25} color="#C91A09" studs={4} />
              {/* Body: 2x Yellow 2x4 stacked */}
              <RealisticBrick x={160} y={215} w={80} h={40} color="#FFD500" studs={8} />
              <RealisticBrick x={170} y={190} w={60} h={30} color="#FFD500" studs={8} />
              {/* Head: 1x Yellow 2x2 */}
              <RealisticBrick x={170} y={160} w={30} h={30} color="#FFD500" studs={4} />
              {/* Beak: 1x Red 1x4 (subset inventory has red 1x4) */}
              <RealisticBrick x={200} y={170} w={30} h={10} color="#C91A09" studs={2} />
              {/* Tail: 1x White 2x2 */}
              <RealisticBrick x={235} y={195} w={20} h={20} color="#FFFFFF" studs={4} />
            </g>

            {/* Build 2: Robot (Stronger structure) */}
            <g className="animate-[figure-robot_18s_infinite] opacity-0">
              {/* Feet: 2x Blue 2x2 */}
              <RealisticBrick x={175} y={280} w={25} h={25} color="#0055BF" studs={4} />
              <RealisticBrick x={205} y={280} w={25} h={25} color="#0055BF" studs={4} />
              {/* Legs: 2x Blue 2x4 (standing up) */}
              <RealisticBrick x={175} y={245} w={25} h={40} color="#0055BF" studs={4} />
              <RealisticBrick x={205} y={245} w={25} h={40} color="#0055BF" studs={4} />
              {/* Body: 1x Blue 2x4 */}
              <RealisticBrick x={165} y={205} w={75} h={40} color="#0055BF" studs={8} />
              {/* Head: 1x White 2x2 */}
              <RealisticBrick x={188} y={175} w={30} h={30} color="#FFFFFF" studs={4} />
              {/* Arms: 2x White 1x4 */}
              <RealisticBrick x={135} y={210} w={30} h={10} color="#FFFFFF" studs={4} rotate={45} />
              <RealisticBrick x={240} y={210} w={30} h={10} color="#FFFFFF" studs={4} rotate={-45} />
            </g>

            {/* Build 3: Rocket (Multi-stage) */}
            <g className="animate-[figure-car_18s_infinite] opacity-0">
              {/* Base Fins: 2x Yellow 2x2 */}
              <RealisticBrick x={145} y={280} w={30} h={30} color="#FFD500" studs={4} rotate={-30} />
              <RealisticBrick x={225} y={280} w={30} h={30} color="#FFD500" studs={4} rotate={30} />
              {/* Stage 1: Yellow 2x4 */}
              <RealisticBrick x={160} y={270} w={80} h={40} color="#FFD500" studs={8} />
              {/* Stage 2: Red 2x4 */}
              <RealisticBrick x={160} y={230} w={80} h={40} color="#C91A09" studs={8} />
              {/* Stage 3: Blue 2x4 */}
              <RealisticBrick x={160} y={190} w={80} h={40} color="#0055BF" studs={8} />
              {/* Capsule: White 2x2 */}
              <RealisticBrick x={185} y={160} w={30} h={30} color="#FFFFFF" studs={4} />
              {/* Tip: Red 2x2 (subset has red 2x2) */}
              <RealisticBrick x={185} y={140} w={30} h={20} color="#C91A09" studs={4} />
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
