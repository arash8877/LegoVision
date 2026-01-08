
import React, { useState, useRef } from 'react';
import BrickButton from './BrickButton';

interface VisionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScan: (base64: string, fullPreview: string) => void;
}

const VisionModal: React.FC<VisionModalProps> = ({ isOpen, onClose, onScan }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = () => {
    if (!preview) return;
    const base64 = preview.split(',')[1];
    onScan(base64, preview);
    onClose();
    // Reset local preview so it's clean next time modal opens
    setPreview(null);
  };

  const resetAll = () => {
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-white rounded-[2rem] w-full max-w-lg overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300 border-4 border-legoBlue">
        {/* Header */}
        <div className="bg-legoBlue text-white p-6 flex justify-between items-center brick-bevel relative z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-legoYellow rounded-lg flex items-center justify-center text-2xl shadow-lego-yellow">📸</div>
            <h2 className="font-heading text-2xl">Capture Bricks</h2>
          </div>
          <button onClick={onClose} className="text-white hover:text-legoYellow text-4xl transition-colors leading-none">&times;</button>
        </div>

        {/* Content */}
        <div className="p-8 stud-pattern-light flex flex-col items-center">
          <div className="w-full relative group mb-8">
            <div 
              onClick={() => fileInputRef.current?.click()}
              className={`
                w-full aspect-square border-4 border-dashed rounded-3xl flex flex-col items-center justify-center cursor-pointer transition-all duration-500 overflow-hidden
                ${preview ? 'border-legoBlue ring-8 ring-legoBlue/10' : 'border-legoBlue/30 hover:bg-legoBlue/5 hover:border-legoBlue/60'}
              `}
            >
              {preview ? (
                <div className="relative w-full h-full animate-in zoom-in duration-500">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white">
                    <span className="text-4xl mb-2">🔄</span>
                    <span className="font-black text-sm uppercase tracking-widest">Change Photo</span>
                  </div>
                </div>
              ) : (
                <div className="text-center p-6">
                  <div className="text-8xl mb-6 transform group-hover:scale-110 transition-transform duration-300">📦</div>
                  <p className="font-heading text-2xl text-legoBlue mb-2">Drop your pile here</p>
                  <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Click to browse your gallery</p>
                </div>
              )}
            </div>
            
            {preview && (
               <button 
                onClick={(e) => { e.stopPropagation(); resetAll(); }}
                className="absolute -top-4 -right-4 w-10 h-10 bg-legoRed text-white rounded-full flex items-center justify-center shadow-xl border-4 border-white hover:scale-110 active:scale-90 transition-all z-20 text-2xl"
               >
                 &times;
               </button>
            )}
          </div>

          <input 
            type="file" 
            accept="image/*" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            className="hidden" 
          />
          
          <div className="w-full flex flex-col gap-4">
            {preview ? (
              <BrickButton onClick={handleAnalyze} variant="red" className="w-full text-2xl animate-in slide-in-from-top-4">
                Identify & Suggest ✨
              </BrickButton>
            ) : (
              <p className="text-gray-400 font-bold italic text-center text-sm animate-pulse">Waiting for your messy pile...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default VisionModal;
