
import React from 'react';
import RealisticBrick from './RealisticBrick';

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

export default JourneyAnimation;
