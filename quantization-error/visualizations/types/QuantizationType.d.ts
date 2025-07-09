export interface QuantizationResult {
    quantizedMatrix: number[][];
    dequantizedMatrix: number[][];
    scales: number[];
    mins: number[];
}
export interface QuantizationConfig {
    blockScales: number[];
    blockMins: number[];
    superblockScale?: number;
    superblockMin?: number;
}
export interface TooltipData {
    originalValue: number;
    quantizedValue: number;
    dequantizedValue: number;
    scale: number;
    blockIndex: number;
    minValue?: number;
}
export declare abstract class QuantizationType {
    abstract readonly name: string;
    abstract readonly displayName: string;
    abstract readonly quantizedDataType: string;
    abstract readonly requiresMinValues: boolean;
    abstract readonly requiresSuperblock: boolean;
    abstract initializeQuantization(sourceMatrix: number[][]): QuantizationConfig;
    abstract quantize(sourceMatrix: number[][], config: QuantizationConfig): QuantizationResult;
    abstract renderQuantizationTooltip(data: TooltipData): string;
    abstract renderDequantizationTooltip(data: TooltipData): string;
    abstract getFormulaDescription(): string;
    abstract createParameterSliders(container: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>, config: QuantizationConfig, blockColors: string[], onUpdate: (newConfig: QuantizationConfig) => void): void;
    calculateBlockError(originalBlock: number[], dequantizedBlock: number[]): number;
    protected extractBlock(matrix: number[][], blockIndex: number): number[];
}
