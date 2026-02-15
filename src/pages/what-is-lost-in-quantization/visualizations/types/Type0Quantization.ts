import * as d3 from 'd3';
import {
  QuantizationType,
  QuantizationConfig,
  QuantizationResult,
  TooltipData,
} from './QuantizationType';
import { quantizeBlockSymmetric } from '../components/quantizationUtils';

/**
 * Type 0 (Symmetric) Quantization Implementation
 * Uses only scale factors, symmetric around zero
 */
export class Type0Quantization extends QuantizationType {
  readonly name = 'type0';
  readonly displayName = 'Type 0 (Symmetric)';
  readonly quantizedDataType = 'int8';
  readonly requiresMinValues = false;
  readonly requiresSuperblock = false;

  initializeQuantization(sourceMatrix: number[][]): QuantizationConfig {
    const blockScales: number[] = [];
    const blockMins: number[] = [];

    for (let blockIdx = 0; blockIdx < sourceMatrix.length; blockIdx++) {
      const block = this.extractBlock(sourceMatrix, blockIdx);
      const { scale } = quantizeBlockSymmetric([block], 8);
      blockScales.push(scale);
      blockMins.push(0); // Symmetric quantization doesn't use min values
    }

    return { blockScales, blockMins };
  }

  quantize(
    sourceMatrix: number[][],
    config: QuantizationConfig,
  ): QuantizationResult {
    const quantizedMatrix: number[][] = [];
    const dequantizedMatrix: number[][] = [];

    for (let blockIdx = 0; blockIdx < sourceMatrix.length; blockIdx++) {
      const block = this.extractBlock(sourceMatrix, blockIdx);
      const scale = config.blockScales[blockIdx];

      const { quantized } = quantizeBlockSymmetric([block], 8);
      const quantizedBlock = quantized[0];

      // Dequantize: dequantized = quantized * scale
      const dequantizedBlock = quantizedBlock.map((q) => q * scale);

      quantizedMatrix.push(quantizedBlock);
      dequantizedMatrix.push(dequantizedBlock);
    }

    return {
      quantizedMatrix,
      dequantizedMatrix,
      scales: config.blockScales,
      mins: config.blockMins,
    };
  }

  renderQuantizationTooltip(data: TooltipData): string {
    const quantBeforeClamp = Math.round(data.originalValue / data.scale);
    const maxQuantValue = 127;
    const minQuantValue = -128;

    return `
      <div class="formula">Symmetric Quantization (Type 0):</div>
      <div>quant = clamp(round(original / scale), ${minQuantValue}, ${maxQuantValue})</div>
      <div class="values">
        Block ${data.blockIndex}: scale = ${data.scale.toFixed(4)}<br>
        original = ${data.originalValue.toFixed(2)}<br>
        round(${data.originalValue.toFixed(2)} / ${data.scale.toFixed(4)}) = ${quantBeforeClamp}<br>
        clamped = ${data.quantizedValue}
      </div>
    `;
  }

  renderDequantizationTooltip(data: TooltipData): string {
    return `
      <div style="font-weight: bold; margin-bottom: 5px;">Symmetric Dequantization (Block ${data.blockIndex + 1})</div>
      <div>dequantized = quantized × scale</div>
      <div style="margin-top: 5px;">
        <span style="color: #666;">${data.dequantizedValue.toFixed(4)}</span> = 
        <span style="color: #0066cc;">${data.quantizedValue}</span> × 
        <span style="color: #cc6600;">${data.scale.toFixed(4)}</span>
      </div>
    `;
  }

  getFormulaDescription(): string {
    return 'quantized × scale';
  }

  createParameterSliders(
    container: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>,
    config: QuantizationConfig,
    blockColors: string[],
    onUpdate: (newConfig: QuantizationConfig) => void,
  ): void {
    const slidersGrid = container
      .append<HTMLDivElement>('div')
      .style('display', 'grid')
      .style('grid-template-columns', 'repeat(4, 1fr)')
      .style('gap', '6px');

    for (let blockIdx = 0; blockIdx < config.blockScales.length; blockIdx++) {
      const blockContainer = slidersGrid
        .append<HTMLDivElement>('div')
        .style('border', `1px solid ${blockColors[blockIdx]}`)
        .style('border-radius', '3px')
        .style('padding', '4px')
        .style('background-color', 'white')
        .style('text-align', 'center');

      blockContainer
        .append<HTMLDivElement>('div')
        .style('font-weight', 'bold')
        .style('color', blockColors[blockIdx])
        .style('margin-bottom', '3px')
        .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
        .style('font-size', '9px')
        .text(`Block ${blockIdx}`);

      // Scale slider
      const scaleRow = blockContainer.append<HTMLDivElement>('div');

      scaleRow
        .append<HTMLLabelElement>('label')
        .style('display', 'block')
        .style('font-size', '8px')
        .style('margin-bottom', '1px')
        .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
        .text('Scale:');

      const scaleSlider = scaleRow
        .append<HTMLInputElement>('input')
        .attr('type', 'range')
        .attr('min', '0.001')
        .attr('max', '30.0')
        .attr('step', '0.001')
        .attr('value', config.blockScales[blockIdx].toString())
        .style('width', '100%')
        .style('cursor', 'pointer')
        .style('height', '3px')
        .style('margin-bottom', '2px')
        .node()!;

      const scaleValue = scaleRow
        .append<HTMLDivElement>('div')
        .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
        .style('font-size', '8px')
        .style('background-color', '#f0f0f0')
        .style('padding', '1px 2px')
        .style('border-radius', '2px')
        .text(config.blockScales[blockIdx].toFixed(3));

      scaleSlider.addEventListener('input', () => {
        const newScale = parseFloat(scaleSlider.value);
        const newConfig = { ...config };
        newConfig.blockScales[blockIdx] = newScale;
        scaleValue.text(newScale.toFixed(3));
        onUpdate(newConfig);
      });
    }
  }
}
