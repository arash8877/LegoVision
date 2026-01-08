
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
