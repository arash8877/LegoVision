
import React, { useState, useEffect, useRef } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DiscoverItem } from '../types';
import { getDiscoveryData } from '../services/geminiService';
import BrickButton from './BrickButton';

const DiscoverView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'sets' | 'pieces' | 'minifigures' | 'themes'>('sets');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState<DiscoverItem | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 600);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
    refetch
  } = useInfiniteQuery({
    queryKey: ['discovery', activeTab, debouncedSearch],
    queryFn: ({ pageParam = 1 }) => getDiscoveryData(activeTab, debouncedSearch, pageParam),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      return lastPage.length > 0 ? allPages.length + 1 : undefined;
    },
  });

  const allItems = data?.pages.flat() || [];

  return (
    <div className="min-h-screen bg-legoGray animate-in fade-in duration-500 pb-32">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="text-center mb-12">
          <h2 className="font-heading text-5xl md:text-7xl text-legoBlue mb-4 uppercase tracking-tighter">LEGO Archive</h2>
          <p className="text-xl text-gray-500 font-bold max-w-3xl mx-auto">
            Deep dive into the world's largest brick collection. Powered by Rebrickable, Brickset, and BrickLink data patterns.
          </p>
        </div>

        {/* Pro Navigation Interface */}
        <div className="flex flex-col items-center gap-8 mb-16 sticky top-24 z-30 bg-legoGray/90 backdrop-blur-2xl p-8 rounded-[3.5rem] border-4 border-white shadow-2xl">
          <div className="w-full max-w-4xl relative group">
            <input 
              type="text"
              placeholder={`Search ${activeTab}... (e.g. UCS Millennium Falcon, 2x4 Brick, Classic Space)`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-12 py-7 rounded-[2.5rem] border-4 border-legoBlue shadow-lego-blue outline-none font-bold text-2xl placeholder:text-gray-300 focus:ring-8 ring-legoYellow/20 transition-all pr-20"
            />
            <div className="absolute right-10 top-1/2 -translate-y-1/2 flex items-center gap-4">
              {isLoading || isFetchingNextPage ? (
                <div className="w-10 h-10 border-4 border-legoYellow border-t-legoRed rounded-full animate-spin"></div>
              ) : searchQuery ? (
                <button onClick={() => setSearchQuery('')} className="text-3xl text-gray-300 hover:text-legoRed transition-colors">✕</button>
              ) : (
                <span className="text-4xl grayscale group-focus-within:grayscale-0 transition-all">🔎</span>
              )}
            </div>
          </div>

          <div className="flex flex-wrap justify-center gap-4 md:gap-8">
            {[
              { id: 'sets', icon: '🏰', label: 'Sets' },
              { id: 'pieces', icon: '🧩', label: 'Parts' },
              { id: 'minifigures', icon: '👤', label: 'Minifigs' },
              { id: 'themes', icon: '🎨', label: 'Themes' }
            ].map((tab) => (
              <BrickButton 
                key={tab.id}
                variant={activeTab === tab.id ? 'red' : 'blue'} 
                onClick={() => { setActiveTab(tab.id as any); setSearchQuery(''); }}
                className={`!px-12 !py-5 !text-2xl transition-all ${activeTab === tab.id ? 'scale-110 shadow-lego ring-8 ring-legoYellow/10' : 'opacity-60 hover:opacity-100 shadow-none'}`}
              >
                {tab.icon} {tab.label}
              </BrickButton>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-40">
            <div className="relative mb-12">
              <div className="w-40 h-40 border-[16px] border-legoYellow border-t-legoRed rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-6xl">📦</div>
            </div>
            <h3 className="font-heading text-4xl text-legoBlue animate-pulse uppercase tracking-widest">Indexing Bricks</h3>
            <p className="text-gray-400 font-bold mt-4">Simulating API handshake with global catalogs...</p>
          </div>
        ) : isError ? (
          <div className="bg-white p-16 rounded-[4rem] text-center border-8 border-legoRed shadow-2xl max-w-2xl mx-auto">
            <h3 className="font-heading text-4xl text-legoRed mb-6">Database Offline</h3>
            <p className="text-xl text-gray-500 font-bold mb-10">Check your API connection or key permissions.</p>
            <BrickButton variant="red" onClick={() => refetch()}>Retry Handshake</BrickButton>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
            {allItems.map((item, idx) => (
              <ItemCard key={`${item.id}-${idx}`} item={item} />
            ))}
          </div>
        )}

        {hasNextPage && !isLoading && (
          <div className="mt-24 flex justify-center">
            <BrickButton 
              variant="yellow" 
              onClick={() => fetchNextPage()} 
              disabled={isFetchingNextPage}
              className="!px-24 !py-8 !text-3xl !rounded-[3rem] shadow-lego-yellow group"
            >
              {isFetchingNextPage ? 'Loading More...' : 'Browse More Treasures ➔'}
            </BrickButton>
          </div>
        )}
      </div>
    </div>
  );
};

const ItemCard: React.FC<{ item: DiscoverItem }> = ({ item }) => {
  const rarityColors = {
    'Legendary': 'bg-purple-600 text-white shadow-[0_0_15px_purple]',
    'Rare': 'bg-legoRed text-white',
    'Common': 'bg-legoBlue text-white',
  };

  return (
    <div className="bg-white rounded-[3rem] border-4 border-legoBlue shadow-xl overflow-hidden flex flex-col group hover:-translate-y-4 hover:shadow-2xl transition-all duration-500">
      <div className="aspect-square bg-white relative overflow-hidden flex items-center justify-center p-8">
        <div className="absolute inset-0 stud-pattern-light opacity-5"></div>
        <img 
          src={item.imageUrl} 
          alt={item.title} 
          className="relative z-10 w-full h-full object-contain group-hover:scale-110 transition-transform duration-700"
          onError={(e) => { (e.target as HTMLImageElement).src = `https://placehold.co/600x400/FFD500/0055BF?text=${encodeURIComponent(item.title)}`; }}
        />
        
        {/* Rarity Badge */}
        <div className={`absolute top-6 left-6 px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] z-20 shadow-lg ${rarityColors[item.rarity as keyof typeof rarityColors] || rarityColors.Common}`}>
          {item.rarity}
        </div>
        
        {/* ID Tag */}
        <div className="absolute top-6 right-6 bg-legoYellow text-legoBlue font-black px-4 py-1.5 rounded-xl border-2 border-legoBlue shadow-lego-yellow text-[10px] uppercase tracking-widest z-20">
          #{item.id}
        </div>
      </div>

      <div className="p-10 flex-1 flex flex-col bg-white border-t-4 border-legoGray">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
             <span className="text-[10px] font-black text-legoRed uppercase tracking-widest">{item.theme || 'LEGO ORIGINAL'}</span>
             {item.subtheme && <span className="text-[10px] font-black text-gray-300 uppercase">/ {item.subtheme}</span>}
          </div>
          <h3 className="font-heading text-2xl text-legoBlue leading-tight mb-2 group-hover:text-legoRed transition-colors">{item.title}</h3>
          {item.year && <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Released {item.year}</p>}
        </div>

        <p className="text-sm text-gray-600 font-bold leading-relaxed mb-8 flex-1 line-clamp-3 italic">
          {item.description}
        </p>
        
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-legoGray/50 p-4 rounded-2xl border border-legoBlue/5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Market Value</p>
            <p className="text-lg font-heading text-legoBlue">{item.marketPrice || 'N/A'}</p>
          </div>
          <div className="bg-legoGray/50 p-4 rounded-2xl border border-legoBlue/5">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-tighter mb-1">Complexity</p>
            <p className="text-lg font-heading text-legoRed">{item.pieceCount || '0'}P</p>
          </div>
        </div>

        <div className="space-y-4 pt-6 border-t-2 border-legoGray">
          <div className="flex flex-wrap gap-2">
            {item.sourceUrls?.map((source, i) => (
              <a 
                key={i} 
                href={source.uri} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[9px] bg-white hover:bg-legoBlue hover:text-white text-legoBlue font-black px-4 py-2 rounded-full border-2 border-legoBlue transition-all flex items-center gap-2 shadow-sm"
              >
                <span>🔗</span> {source.title.split(' ')[0]}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiscoverView;
