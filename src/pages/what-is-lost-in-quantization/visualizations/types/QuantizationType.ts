/**
 * Base interface for all quantization types
 */
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

/**
 * Abstract base class for quantization types
 */
export abstract class QuantizationType {
  abstract readonly name: string;
  abstract readonly displayName: string;
  abstract readonly quantizedDataType: string;
  abstract readonly requiresMinValues: boolean;
  abstract readonly requiresSuperblock: boolean;

  /**
   * Initialize quantization parameters for a source matrix
   */
  abstract initializeQuantization(sourceMatrix: number[][]): QuantizationConfig;

  /**
   * Perform quantization on the source matrix
   */
  abstract quantize(
    sourceMatrix: number[][],
    config: QuantizationConfig,
  ): QuantizationResult;

  /**
   * Render tooltip content for quantization step
   */
  abstract renderQuantizationTooltip(data: TooltipData): string;

  /**
   * Render tooltip content for dequantization step
   */
  abstract renderDequantizationTooltip(data: TooltipData): string;

  /**
   * Get formula description for this quantization type
   */
  abstract getFormulaDescription(): string;

  /**
   * Create parameter sliders for this quantization type
   */
  abstract createParameterSliders(
    container: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>,
    config: QuantizationConfig,
    blockColors: string[],
    onUpdate: (newConfig: QuantizationConfig) => void,
  ): void;

  /**
   * Calculate quantization error for a block
   */
  calculateBlockError(
    originalBlock: number[],
    dequantizedBlock: number[],
  ): number {
    if (originalBlock.length !== dequantizedBlock.length) {
      throw new Error('Block lengths must match');
    }

    let sumAbsError = 0;
    for (let i = 0; i < originalBlock.length; i++) {
      sumAbsError += Math.abs(originalBlock[i] - dequantizedBlock[i]);
    }

    return sumAbsError / originalBlock.length;
  }

  /**
   * Extract a block from the matrix (row-wise for 4x8 layout)
   */
  protected extractBlock(matrix: number[][], blockIndex: number): number[] {
    if (blockIndex < 0 || blockIndex >= matrix.length) {
      throw new Error(`Block index ${blockIndex} out of range`);
    }
    return matrix[blockIndex];
  }
}
