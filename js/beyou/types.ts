export interface IbeYouStateObject {
  state: number;
  message: string;
  delay?: number;
  isEndState?: boolean;
  prevstate: number;
  functions?: () => void[];
  children?: {
    positive: {
      positiveState: number;
      positiveTerm: string[];
    };
    negative: {
      negativeState: number;
      negativeTerm: string[];
    };
  }[];
}

export interface tfSimilarity {
  similarity: number;
  state: number;
  term?: string;
}

export interface IWindow extends Window {
  webkitSpeechRecognition: any;
}
