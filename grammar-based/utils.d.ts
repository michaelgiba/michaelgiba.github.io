import { Vocabulary } from "./data";
export declare const softmax: (logits: number[]) => number[];
export declare const getLuminance: (color: string) => number;
export declare const getTextColorForBackground: (backgroundColor: string) => string;
export declare const transformDataForSortedView: (logits: number[][], tokenIndices: number[][], vocab: Vocabulary) => {
    token: string;
    logit: number;
    probability: number;
    originalIndex: number;
}[][];
export declare function calculateSoftmax(logits: number[]): number[];
export declare function calculateEntropy(probabilities: number[]): number;
