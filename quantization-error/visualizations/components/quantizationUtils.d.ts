export declare function quantizeBlockSymmetric(block: number[][], bits?: number): {
    quantized: number[][];
    scale: number;
};
export declare function quantizeBlockAsymmetric(block: number[][], bits?: number): {
    quantized: number[][];
    scale: number;
    zeroPoint: number;
};
export declare function extractBlock(matrix: number[][], blockIndex: number): number[];
export declare function generateMatrix(): number[][];
