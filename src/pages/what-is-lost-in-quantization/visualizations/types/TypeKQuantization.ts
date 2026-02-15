import * as d3 from 'd3';
import {
  QuantizationType,
  QuantizationConfig,
  QuantizationResult,
  TooltipData,
} from './QuantizationType';
import { quantizeBlockAsymmetric } from '../components/quantizationUtils';

/**
 * Type K Quantization Implementation
 * Uses hierarchical quantization with superblock parameters
 */
export class TypeKQuantization extends QuantizationType {
  readonly name = 'typeK';
  readonly displayName = 'Type K';
  readonly quantizedDataType = 'uint8';
  readonly requiresMinValues = true;
  readonly requiresSuperblock = true;

  initializeQuantization(sourceMatrix: number[][]): QuantizationConfig {
    const blockScales: number[] = [];
    const blockMins: number[] = [];

    // First pass: calculate block scales and mins
    for (let blockIdx = 0; blockIdx < sourceMatrix.length; blockIdx++) {
      const block = this.extractBlock(sourceMatrix, blockIdx);
      const { scale } = quantizeBlockAsymmetric([block], 8);
      blockScales.push(scale);
      blockMins.push(Math.min(...block));
    }

    return {
      blockScales,
      blockMins,
      superblockScale: 0.1,
      superblockMin: -15,
    };
  }

  quantize(
    sourceMatrix: number[][],
    config: QuantizationConfig,
  ): QuantizationResult {
    // Calculate block parameters
    const blockScales: number[] = [];
    const blockMins: number[] = [];

    for (let blockIdx = 0; blockIdx < sourceMatrix.length; blockIdx++) {
      const block = this.extractBlock(sourceMatrix, blockIdx);
      const { scale } = quantizeBlockAsymmetric([block], 8);
      blockScales.push(scale);
      blockMins.push(Math.min(...block));
    }

    // Quantize block scales and mins using superblock parameters
    const minOfMins = Math.min(...blockMins);
    const maxOfScales = Math.max(...blockScales);
    const minOfScales = Math.min(...blockScales);
    const scaleOfScales = (maxOfScales - minOfScales) / 255;

    const quantizedScales = blockScales.map((s) =>
      Math.round((s - minOfScales) / scaleOfScales),
    );
    const dequantizedScales = quantizedScales.map(
      (qs) => qs * scaleOfScales + minOfScales,
    );

    const quantizedMins = blockMins.map((m) =>
      Math.round((m - minOfMins) / (config.superblockScale ?? 0.1)),
    );
    const dequantizedMins = quantizedMins.map(
      (qm) => qm * (config.superblockScale ?? 0.1) + minOfMins,
    );

    // Quantize and dequantize the actual data using dequantized parameters
    const quantizedMatrix: number[][] = [];
    const dequantizedMatrix: number[][] = [];

    for (let blockIdx = 0; blockIdx < sourceMatrix.length; blockIdx++) {
      const block = this.extractBlock(sourceMatrix, blockIdx);
      const { quantized } = quantizeBlockAsymmetric([block], 8);
      const quantizedBlock = quantized[0];

      // Dequantize using the quantized/dequantized block parameters
      const dequantizedBlock = quantizedBlock.map(
        (q) => q * dequantizedScales[blockIdx] + dequantizedMins[blockIdx],
      );

      quantizedMatrix.push(quantizedBlock);
      dequantizedMatrix.push(dequantizedBlock);
    }

    return {
      quantizedMatrix,
      dequantizedMatrix,
      scales: dequantizedScales,
      mins: dequantizedMins,
    };
  }

  renderQuantizationTooltip(data: TooltipData): string {
    const quantMin = 0;
    const quantMax = 255;
    const quantBeforeClamp = Math.round(
      (data.originalValue - (data.minValue ?? 0)) / data.scale,
    );

    return `
      <div class="formula">Asymmetric Quantization (Type K):</div>
      <div>quant = clamp(round((original - min) / scale), ${quantMin}, ${quantMax})</div>
      <div class="values">
        Block ${data.blockIndex}: min = ${(data.minValue ?? 0).toFixed(2)}, scale = ${data.scale.toFixed(4)}<br>
        original = ${data.originalValue.toFixed(2)}<br>
        round((${data.originalValue.toFixed(2)} - ${(data.minValue ?? 0).toFixed(2)}) / ${data.scale.toFixed(4)}) = ${quantBeforeClamp}<br>
        clamped = ${data.quantizedValue}
      </div>
    `;
  }

  renderDequantizationTooltip(data: TooltipData): string {
    return `
      <div style="font-weight: bold; margin-bottom: 5px;">Asymmetric Dequantization (Block ${data.blockIndex + 1})</div>
      <div>dequantized = quantized × scale + min</div>
      <div style="margin-top: 5px;">
        <span style="color: #666;">${data.dequantizedValue.toFixed(4)}</span> = 
        <span style="color: #0066cc;">${data.quantizedValue}</span> × 
        <span style="color: #cc6600;">${data.scale.toFixed(4)}</span> + 
        <span style="color: #b36b00;">${data.minValue ?? 0}</span>
      </div>
    `;
  }

  getFormulaDescription(): string {
    return 'quantized × scale + min';
  }

  createParameterSliders(
    container: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>,
    config: QuantizationConfig,
    blockColors: string[],
    onUpdate: (newConfig: QuantizationConfig) => void,
  ): void {
    // Function to calculate quantized values
    const calculateQuantizedValues = (
      superblockScale: number,
      superblockMin: number,
    ) => {
      const quantizedScales: number[] = [];
      const quantizedMins: number[] = [];

      config.blockScales.forEach((scale) => {
        const quantizedScale = Math.round(scale / superblockScale);
        quantizedScales.push(Math.max(0, Math.min(255, quantizedScale)));
      });

      config.blockMins.forEach((min) => {
        const quantizedMin = Math.round(
          (min - superblockMin) / superblockScale,
        );
        quantizedMins.push(Math.max(0, Math.min(255, quantizedMin)));
      });

      return { quantizedScales, quantizedMins };
    };

    // Initial values
    const superblockScale = config.superblockScale ?? 0.1;
    const superblockMin = config.superblockMin ?? -15;
    let { quantizedScales, quantizedMins } = calculateQuantizedValues(
      superblockScale,
      superblockMin,
    );

    // Superblock parameters section
    const superblockContainer = container
      .append<HTMLDivElement>('div')
      .style('margin-bottom', '10px')
      .style('padding', '6px')
      .style('border', '1px solid #dc3545')
      .style('border-radius', '3px')
      .style('background-color', '#fff8f8');

    superblockContainer
      .append<HTMLDivElement>('div')
      .style('font-weight', 'bold')
      .style('color', '#dc3545')
      .style('margin-bottom', '5px')
      .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
      .style('font-size', '10px')
      .style('text-align', 'center')
      .text('🌟 Superblock Parameters 🌟');

    const superblockGrid = superblockContainer
      .append<HTMLDivElement>('div')
      .style('display', 'grid')
      .style('grid-template-columns', '1fr 1fr')
      .style('gap', '10px');

    // Superblock Scale
    const scaleControl = superblockGrid.append<HTMLDivElement>('div');
    scaleControl
      .append<HTMLLabelElement>('label')
      .style('display', 'block')
      .style('font-size', '9px')
      .style('margin-bottom', '2px')
      .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
      .text('Superblock Scale:');

    const scaleSlider = scaleControl
      .append<HTMLInputElement>('input')
      .attr('type', 'range')
      .attr('min', '0.01')
      .attr('max', '10.0')
      .attr('step', '0.01')
      .attr('value', superblockScale.toString())
      .style('width', '100%')
      .node()!;

    const scaleValue = scaleControl
      .append<HTMLDivElement>('div')
      .style('font-size', '9px')
      .text(superblockScale.toFixed(2));

    // Superblock Min
    const minControl = superblockGrid.append<HTMLDivElement>('div');
    minControl
      .append<HTMLLabelElement>('label')
      .style('display', 'block')
      .style('font-size', '9px')
      .style('margin-bottom', '2px')
      .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
      .text('Superblock Min:');

    const minSlider = minControl
      .append<HTMLInputElement>('input')
      .attr('type', 'range')
      .attr('min', '-300')
      .attr('max', '300')
      .attr('step', '0.1')
      .attr('value', superblockMin.toString())
      .style('width', '100%')
      .node()!;

    const minValue = minControl
      .append<HTMLDivElement>('div')
      .style('font-size', '9px')
      .text(superblockMin.toFixed(2));

    // Regular block sliders (read-only for Type K) with quantized values
    const slidersGrid = container
      .append<HTMLDivElement>('div')
      .style('display', 'grid')
      .style('grid-template-columns', 'repeat(4, 1fr)')
      .style('gap', '6px');

    // Store references to quantized value display elements
    const quantizedScaleElements: d3.Selection<
      HTMLDivElement,
      unknown,
      HTMLElement,
      unknown
    >[] = [];
    const quantizedMinElements: d3.Selection<
      HTMLDivElement,
      unknown,
      HTMLElement,
      unknown
    >[] = [];

    for (let blockIdx = 0; blockIdx < config.blockScales.length; blockIdx++) {
      const blockContainer = slidersGrid
        .append<HTMLDivElement>('div')
        .style('border', `1px solid ${blockColors[blockIdx]}`)
        .style('border-radius', '3px')
        .style('padding', '4px')
        .style('background-color', '#f9f9f9')
        .style('text-align', 'center');

      blockContainer
        .append<HTMLDivElement>('div')
        .style('font-weight', 'bold')
        .style('color', blockColors[blockIdx])
        .style('margin-bottom', '3px')
        .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
        .style('font-size', '9px')
        .text(`Block ${blockIdx}`);

      blockContainer
        .append<HTMLDivElement>('div')
        .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
        .style('font-size', '8px')
        .style('color', '#666')
        .text('(Auto-computed)');

      // Scale value
      blockContainer
        .append<HTMLDivElement>('div')
        .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
        .style('font-size', '8px')
        .style('background-color', '#f0f0f0')
        .style('padding', '1px 2px')
        .style('border-radius', '2px')
        .style('margin', '2px 0')
        .text(`Scale: ${config.blockScales[blockIdx].toFixed(3)}`);

      // Min value
      blockContainer
        .append<HTMLDivElement>('div')
        .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
        .style('font-size', '8px')
        .style('background-color', '#f0f0f0')
        .style('padding', '1px 2px')
        .style('border-radius', '2px')
        .style('margin', '2px 0')
        .text(`Min: ${config.blockMins[blockIdx].toFixed(2)}`);

      // Quantized scale value (dynamic)
      const quantizedScaleElement = blockContainer
        .append<HTMLDivElement>('div')
        .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
        .style('font-size', '7px')
        .style('background-color', '#e8f4fd')
        .style('color', '#0066cc')
        .style('padding', '1px 2px')
        .style('border-radius', '2px')
        .style('margin', '1px 0')
        .text(`Quant. Scale: ${quantizedScales[blockIdx]}`);

      quantizedScaleElements.push(quantizedScaleElement);
      // Quantized min value (dynamic)
      const quantizedMinElement = blockContainer
        .append<HTMLDivElement>('div')
        .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
        .style('font-size', '7px')
        .style('background-color', '#fff3e0')
        .style('color', '#cc6600')
        .style('padding', '1px 2px')
        .style('border-radius', '2px')
        .style('margin', '1px 0')
        .text(`Quant. Min: ${quantizedMins[blockIdx]}`);

      quantizedMinElements.push(quantizedMinElement);
    }

    // Function to update quantized value displays
    const updateQuantizedDisplays = (
      newSuperblockScale: number,
      newSuperblockMin: number,
    ) => {
      const newValues = calculateQuantizedValues(
        newSuperblockScale,
        newSuperblockMin,
      );
      quantizedScales = newValues.quantizedScales;
      quantizedMins = newValues.quantizedMins;

      for (let i = 0; i < quantizedScales.length; i++) {
        quantizedScaleElements[i].text(`Q_Scale: ${quantizedScales[i]}`);
        quantizedMinElements[i].text(`Q_Min: ${quantizedMins[i]}`);
      }
    };

    // Event listeners for superblock parameters
    scaleSlider.addEventListener('input', () => {
      const newSuperblockScale = parseFloat(scaleSlider.value);
      const newConfig = { ...config, superblockScale: newSuperblockScale };
      scaleValue.text(newSuperblockScale.toFixed(2));
      updateQuantizedDisplays(newSuperblockScale, parseFloat(minSlider.value));
      onUpdate(newConfig);
    });

    minSlider.addEventListener('input', () => {
      const newSuperblockMin = parseFloat(minSlider.value);
      const newConfig = { ...config, superblockMin: newSuperblockMin };
      minValue.text(newSuperblockMin.toFixed(2));
      updateQuantizedDisplays(parseFloat(scaleSlider.value), newSuperblockMin);
      onUpdate(newConfig);
    });
  }
}
