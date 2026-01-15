
export interface MicroBuild {
  title: string;
  icon: string;
  description: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  estimatedPieces: number;
  requiredBricks: string[];
  steps: string[];
}

export interface VisionAnalysis {
  identifiedBricks: string[];
  colorPalette: string[];
  suggestions: MicroBuild[];
}

export interface DiscoverItem {
  id: string;
  title: string;
  type: 'set' | 'piece' | 'minifigure' | 'theme';
  year?: string;
  pieceCount?: number;
  description: string;
  imageUrl: string;
  funFacts: string[];
  sourceUrls: { title: string; uri: string }[];
  // New enriched fields
  theme?: string;
  subtheme?: string;
  instructionsUrl?: string;
  marketPrice?: string;
  rarity?: 'Common' | 'Rare' | 'Legendary';
  category?: string;
}
