import * as d3 from 'd3';
import {
  QuantizationType,
  QuantizationConfig,
  QuantizationResult,
  TooltipData,
} from './types/QuantizationType';
import { QuantizationTypeRegistry } from './types/QuantizationTypeRegistry';
import { generateMatrix } from './components/quantizationUtils';
import { applyVisualizationStyles } from './components/quantType0Styles';

/**
 * Main visualization controller for quantization type interactive demo
 */
export class QuantizationVisualization {
  private svgMainContainer!: d3.Selection<
    SVGSVGElement,
    unknown,
    HTMLElement,
    unknown
  >;
  private errorBarsSvg!: d3.Selection<
    SVGSVGElement,
    unknown,
    HTMLElement,
    unknown
  >;
  private slidersContainer!: d3.Selection<
    HTMLDivElement,
    unknown,
    HTMLElement,
    unknown
  >;
  private svgWrapper!: d3.Selection<
    HTMLDivElement,
    unknown,
    HTMLElement,
    unknown
  >;

  private currentSourceMatrix: number[][] = generateMatrix();
  private currentQuantType: QuantizationType;
  private currentConfig: QuantizationConfig;
  private tooltip: HTMLDivElement | null = null;
  private activeInputElement: HTMLInputElement | null = null;

  private readonly blockBaseColors = [
    '#4E79A7',
    '#59A14F',
    '#F28E2B',
    '#AF7AA1',
  ];
  private readonly cellSize = 35;
  private readonly margin = 20;

  constructor() {
    const registry = QuantizationTypeRegistry.getInstance();
    this.currentQuantType = registry.get('type0')!;
    this.currentConfig = this.currentQuantType.initializeQuantization(
      this.currentSourceMatrix,
    );
  }

  public initialize(): void {
    applyVisualizationStyles();
    this.setupDOM();
    this.createControls();
    this.createSVGWrapper();
    this.setupSVG();
    this.redrawVisualization();
    this.createCallout();
    console.log(
      'Quantization Type Interactive Visualization Initialized with modular architecture.',
    );
  }

  private setupDOM(): void {
    const mainD3Selection = d3.select<HTMLElement, unknown>('main');
    if (mainD3Selection.empty()) {
      console.error(
        'Main element not found for quantization type visualization.',
      );
      return;
    }

    const vizSectionId = 'quant-type-section';
    const svgWrapperId = 'quant-type-svg-wrapper';

    // Clean up existing visualization
    let existingVizSection = d3.select<HTMLElement, unknown>(
      `#${vizSectionId}`,
    );
    if (!existingVizSection.empty()) {
      const existingWrapper = existingVizSection
        .select(`#${svgWrapperId}`)
        .node() as HTMLElement;
      if (existingWrapper) {
        const existingTooltip = existingWrapper.querySelector('.quant-tooltip');
        if (existingTooltip) {
          existingTooltip.remove();
        }
      }
      existingVizSection.remove();
    }

    const vizSection = mainD3Selection
      .append<HTMLElement>('section')
      .attr('id', vizSectionId);

    vizSection.append('h2').text('LLM Quantization');
    vizSection
      .append('p')
      .html(
        'Before we get into characterizing quantization error in LLMs, let’s first review how quantization is typically performed on the weights of these models. Quantization for LLM weights still follows the same principle of mapping values in a high-resolution representation (typically floating point) to a lower-resolution equivalent (typically some integer type) with some error.',
      );

    const textContent = `
    <div class="quant-explanation">
      <p>For the sake of this article we will follow some of the most common techniques used by covering the implementation used within 
      <a href="https://github.com/ggml-org/llama.cpp">llama.cpp</a>, a common open-source library for local inference. </p>
      <p>The quantization method used by a given model is typically represented as a combination of the weight type and method:</p>
      <ul>
          <li><b>Weight type:</b> the number of bits used to store the new weight: i.e. <code>Q8</code>=8-bit, <code>Q4</code>=4-bit etc.</li>
          <li><b>Method:</b> the technique used to create those quants from the original values</li>
      </ul>
      <p>
        The two simplest forms of weight quantization are symmetric and asymmetric quantization (type 0 and type 1 in <code>llama.cpp</code> terminology). 
        However there are more complicated forms such as K-quants, which we cover below, and others including IQ quants which we don't cover.
      </p>
      
      <div class="quant-type-cards">
        <div class="quant-card">
          <h4>Type 0 (e.g. <code>Q4_0</code>)</h4>
          <ul>
            <li>Weights are divided into “blocks”</li>
            <li>Takes the block “scale” to highlight the range of the block</li>
            <li>Inference time weight = <code>scale * quant</code></li>
          </ul>
        </div>
        <div class="quant-card">
          <h4>Type 1 (e.g. <code>Q4_1</code>)</h4>
          <ul>
            <li>Weights are divided into “blocks”</li>
            <li>Takes the block “scale” and minimum value in the block such that</li>
            <li>Inference time weight = <code>scale * quant + block_min</code></li>
          </ul>
        </div>
        <div class="quant-card">
          <h4>Type K (e.g. <code>Q4_K_{0|1}</code>)</h4>
          <ul>
            <li>Divide into super blocks, with these further divided into blocks</li>
            <li>Individual blocks get their own type 0 or type 1 parameters i.e (offset, block min)</li>
            <li>Superblocks store their own type-0 or type-1 parameters to quantize the <b>individual block params</b> as lower datatypes. 
            </li>
          </ul>
        </div>
      </div>
    </div>
    `;

    vizSection.append('div').html(textContent);

    this.slidersContainer = vizSection
      .append('div')
      .attr('id', 'quant-type-sliders-container');
  }

  private createCallout(): void {
    const mainD3Selection = d3.select<HTMLElement, unknown>('main');
    if (mainD3Selection.empty()) {
      console.error('Main element not found for callout.');
      return;
    }

    // Clean up old one
    mainD3Selection.select('.quant-callout-container').remove();

    const calloutContainer = mainD3Selection
      .append('div')
      .attr('class', 'quant-callout-container');

    const calloutContent = `
    <div class="quant-callout">
      <p>As an interesting aside, K-quants are relatively broadly used and yet it's surprisingly hard to find info on how they work. I came across 
      <a href="https://github.com/ggml-org/llama.cpp/pull/1684#issuecomment-2474462323">
        this comment 
      </a> from the author in <code>llama.cpp</code> which just goes to show the organic ways these things are developing:</p>
      <blockquote>
        <p><strong>ikawrakow commented on Nov 13, 2024</strong></p>
        <p>There are no papers on k- or i-quants because I don't like writing papers. Combined with me enjoying the luxury of not needing another paper on my CV, and me not looking for a job or for investment, I see no reason to go and advertise on arXiv.</p>
        <p>On the other hand, not having published a paper (or papers) allows other quantization researchers to ignore k- and i-quants, despite HF being littered with GGUFs containing k- and i-quantized models. Which makes their new shiny quantization methods look better than they actually are. Which is good for keeping the hype wave going.</p>
        <p>So, in short, a win-win 😃</p>
      </blockquote>
    </div>
    `;
    calloutContainer.html(calloutContent);
  }

  private createControls(): void {
    // Description paragraph
    d3.select('#quant-type-section')
      .append<HTMLParagraphElement>('p')
      .html(
        '<p style="font-family: \'Georgia\', serif;"> The following is an interactive visualization of these three different quantization strategies for some example weights.  ' +
          'You can see how these are quants are represented in code in <code>llama.cpp</code><a href="https://github.com/ggml-org/llama.cpp/blob/master/ggml/src/ggml-common.h#L167">here if you are curious.</a> ',
      );

    const controlsDiv = d3
      .select('#quant-type-section')
      .append<HTMLDivElement>('div')
      .style('margin-bottom', '15px')
      .style('display', 'flex')
      .style('align-items', 'center')
      .style('gap', '10px');

    controlsDiv
      .append<HTMLLabelElement>('label')
      .attr('for', 'quantization-type-select')
      .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .text('Quantization Type:');

    const dropdown = controlsDiv
      .append<HTMLSelectElement>('select')
      .attr('id', 'quantization-type-select')
      .style('padding', '5px 10px')
      .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
      .style('font-size', '14px')
      .style('border', '1px solid #ccc')
      .style('border-radius', '4px')
      .style('background-color', 'white');

    const registry = QuantizationTypeRegistry.getInstance();
    registry.getDropdownOptions().forEach((option) => {
      dropdown
        .append<HTMLOptionElement>('option')
        .attr('value', option.value)
        .text(option.text);
    });

    dropdown.on('change', () => {
      const selectedValue = (dropdown.node() as HTMLSelectElement).value;
      const newQuantType = registry.get(selectedValue);
      if (newQuantType) {
        this.currentQuantType = newQuantType;
        this.currentConfig = this.currentQuantType.initializeQuantization(
          this.currentSourceMatrix,
        );
        this.createParameterSliders();
        this.redrawVisualization();
      }
    });

    // Description paragraph
    d3.select('#quant-type-section')
      .append<HTMLParagraphElement>('p')
      .html(
        '<strong style="color: #007bff;">Click on source weight cells or use the sliders below to edit values.</strong>',
      );

    this.createControlsContainer();
    this.createParameterSliders();
  }

  private createControlsContainer(): void {
    const controlsContainer = d3
      .select('#quant-type-section')
      .append<HTMLDivElement>('div')
      .style('display', 'flex')
      .style('gap', '20px')
      .style('align-items', 'flex-start')
      .style('margin-bottom', '30px')
      .style('justify-content', 'center');

    // Parameters container
    this.slidersContainer = controlsContainer
      .append<HTMLDivElement>('div')
      .style('flex', '1')
      .style('max-width', '400px')
      .style('padding', '6px')
      .style('background-color', '#f8f9fa')
      .style('border', '1px solid #007bff')
      .style('border-radius', '4px')
      .style('font-size', '11px');

    this.slidersContainer
      .append<HTMLDivElement>('div')
      .style('margin', '0 0 6px 0')
      .style('color', '#007bff')
      .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
      .style('font-weight', 'bold')
      .style('font-size', '10px')
      .style('text-align', 'center')
      .text('🎛️ Editable Parameters');

    // Error bars container
    const errorBarsContainer = controlsContainer
      .append<HTMLDivElement>('div')
      .style('flex', '0 0 200px')
      .style('padding', '6px')
      .style('background-color', '#f8f9fa')
      .style('border', '1px solid #6c757d')
      .style('border-radius', '4px');

    errorBarsContainer
      .append<HTMLDivElement>('div')
      .style('margin', '0 0 6px 0')
      .style('color', '#6c757d')
      .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
      .style('font-weight', 'bold')
      .style('font-size', '10px')
      .style('text-align', 'center')
      .text('📊 Quantization Error');

    this.errorBarsSvg = errorBarsContainer
      .append<SVGSVGElement>('svg')
      .attr('width', '188')
      .attr('height', '120')
      .style('display', 'block')
      .style('background-color', 'white')
      .style('border-radius', '3px');
  }

  private createParameterSliders(): void {
    this.slidersContainer.selectAll('*').remove();

    // Recreate header
    this.slidersContainer
      .append<HTMLDivElement>('div')
      .style('margin', '0 0 6px 0')
      .style('color', '#007bff')
      .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
      .style('font-weight', 'bold')
      .style('font-size', '10px')
      .style('text-align', 'center')
      .text('🎛️ Editable Parameters');

    this.currentQuantType.createParameterSliders(
      this.slidersContainer,
      this.currentConfig,
      this.blockBaseColors,
      (newConfig: QuantizationConfig) => {
        this.currentConfig = newConfig;
        this.redrawVisualization();
      },
    );
  }

  private createSVGWrapper(): void {
    const svgWrapperId = 'quant-type-svg-wrapper';

    this.svgWrapper = d3
      .select('#quant-type-section')
      .append<HTMLDivElement>('div')
      .attr('id', svgWrapperId)
      .style('position', 'relative');
  }

  private setupSVG(): void {
    const matrixWidth = 8 * this.cellSize;
    const matrixHeight = 4 * this.cellSize;
    const titleAreaHeight = 30;
    const sectionGap = 60;
    const numberLinesHeight = 4 * 20 + 40; // 4 blocks * 20px + extra space

    const col1X = this.margin;
    const col2X = col1X + matrixWidth + sectionGap;
    const col3X = col2X + matrixWidth + sectionGap;

    const designWidth = col3X + matrixWidth + this.margin;
    const designHeight =
      this.margin +
      titleAreaHeight +
      matrixHeight +
      numberLinesHeight +
      this.margin;

    this.svgMainContainer = this.svgWrapper
      .append<SVGSVGElement>('svg')
      .attr('viewBox', `0 0 ${designWidth} ${designHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block')
      .style('width', '100%')
      .style('height', '100%');
  }

  private redrawVisualization(): void {
    this.removeActiveInputElement();
    this.hideTooltip();
    this.svgMainContainer.selectAll('*').remove();

    const result = this.currentQuantType.quantize(
      this.currentSourceMatrix,
      this.currentConfig,
    );
    this.drawMatrices(result);
    this.drawNumberLines(result);
    this.drawErrorBars(result);
  }

  private drawMatrices(result: QuantizationResult): void {
    const matrixWidth = 8 * this.cellSize;
    const titleAreaHeight = 30;
    const sectionGap = 60;

    const col1X = this.margin;
    const col2X = col1X + matrixWidth + sectionGap;
    const col3X = col2X + matrixWidth + sectionGap;
    const matrixCellsTop = this.margin + titleAreaHeight;

    this.drawMatrixTitles(col1X, col2X, col3X, matrixWidth, matrixCellsTop);
    this.drawSourceMatrix(col1X, matrixCellsTop, result);
    this.drawQuantizedMatrix(col2X, matrixCellsTop, result);
    this.drawDequantizedMatrix(col3X, matrixCellsTop, result);
  }

  private drawMatrixTitles(
    col1X: number,
    col2X: number,
    col3X: number,
    matrixWidth: number,
    matrixCellsTop: number,
  ): void {
    // Source matrix title
    this.svgMainContainer
      .append('text')
      .attr('x', col1X + matrixWidth / 2)
      .attr('y', matrixCellsTop - 20)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text('Source Weights (f32)');

    this.svgMainContainer
      .append('text')
      .attr('x', col1X + matrixWidth / 2)
      .attr('y', matrixCellsTop - 8)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '9px')
      .attr('fill', '#007bff')
      .attr('font-weight', 'bold')
      .text('✏️ Click cells to edit');

    // Quantized matrix title
    this.svgMainContainer
      .append('text')
      .attr('x', col2X + matrixWidth / 2)
      .attr('y', matrixCellsTop - 20)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text(`Quantized Weights (${this.currentQuantType.quantizedDataType})`);

    this.svgMainContainer
      .append('text')
      .attr('x', col2X + matrixWidth / 2)
      .attr('y', matrixCellsTop - 8)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '8px')
      .text(`(${this.currentQuantType.getFormulaDescription()})`);

    // Dequantized matrix title
    this.svgMainContainer
      .append('text')
      .attr('x', col3X + matrixWidth / 2)
      .attr('y', matrixCellsTop - 20)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '11px')
      .attr('font-weight', 'bold')
      .text('Dequantized Weights (f32)');

    this.svgMainContainer
      .append('text')
      .attr('x', col3X + matrixWidth / 2)
      .attr('y', matrixCellsTop - 8)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '9px')
      .text('(approximates source)');
  }

  private drawSourceMatrix(
    startX: number,
    startY: number,
    result: QuantizationResult,
  ): void {
    const colorScales = this.createColorScales();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        const value = this.currentSourceMatrix[i][j];
        const x = startX + j * this.cellSize;
        const y = startY + i * this.cellSize;

        this.svgMainContainer
          .append('rect')
          .attr('class', 'matrix-cell source-cell')
          .attr('x', x)
          .attr('y', y)
          .attr('width', this.cellSize)
          .attr('height', this.cellSize)
          .attr('fill', colorScales[i](value))
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .style('cursor', 'pointer')
          .on('mouseover', function () {
            d3.select(this)
              .attr('stroke', '#007bff')
              .attr('stroke-width', 3)
              .attr('stroke-dasharray', '5,5');
          })
          .on('mouseout', function () {
            d3.select(this)
              .attr('stroke', '#333')
              .attr('stroke-width', 1)
              .attr('stroke-dasharray', 'none');
          })
          .on('click', () => {
            this.handleSourceCellClick(i, j, x, y);
          });

        this.svgMainContainer
          .append('text')
          .attr('class', 'matrix-text')
          .attr('x', x + this.cellSize / 2)
          .attr('y', y + this.cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-family', 'monospace')
          .attr('font-size', '9px')
          .text(Math.abs(value) < 0.1 ? value.toFixed(2) : value.toFixed(1))
          .attr('fill', 'black')
          .style('pointer-events', 'none');
      }
    }
  }

  private drawQuantizedMatrix(
    startX: number,
    startY: number,
    result: QuantizationResult,
  ): void {
    const colorScales = this.createColorScales();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        const quantizedValue = result.quantizedMatrix[i][j];
        const originalValue = this.currentSourceMatrix[i][j];
        const scale = result.scales[i];
        const minVal = result.mins[i];
        const x = startX + j * this.cellSize;
        const y = startY + i * this.cellSize;

        const originalValueForColor = quantizedValue * scale;

        this.svgMainContainer
          .append('rect')
          .attr('class', 'matrix-cell')
          .attr('x', x)
          .attr('y', y)
          .attr('width', this.cellSize)
          .attr('height', this.cellSize)
          .attr('fill', colorScales[i](originalValueForColor))
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .on('mouseover', (event) => {
            this.showQuantizationTooltip(event, {
              originalValue,
              quantizedValue,
              dequantizedValue: result.dequantizedMatrix[i][j],
              scale,
              blockIndex: i,
              minValue: minVal,
            });
          })
          .on('mousemove', (event) => {
            this.showQuantizationTooltip(event, {
              originalValue,
              quantizedValue,
              dequantizedValue: result.dequantizedMatrix[i][j],
              scale,
              blockIndex: i,
              minValue: minVal,
            });
          })
          .on('mouseout', () => {
            this.hideTooltip();
          });

        this.svgMainContainer
          .append('text')
          .attr('class', 'matrix-text')
          .attr('x', x + this.cellSize / 2)
          .attr('y', y + this.cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-family', 'monospace')
          .attr('font-size', '9px')
          .text(quantizedValue.toString())
          .attr('fill', 'black')
          .style('pointer-events', 'none');
      }
    }
  }

  private drawDequantizedMatrix(
    startX: number,
    startY: number,
    result: QuantizationResult,
  ): void {
    const colorScales = this.createColorScales();

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 8; j++) {
        const dequantizedValue = result.dequantizedMatrix[i][j];
        const quantizedValue = result.quantizedMatrix[i][j];
        const scale = result.scales[i];
        const minVal = result.mins[i];
        const x = startX + j * this.cellSize;
        const y = startY + i * this.cellSize;

        this.svgMainContainer
          .append('rect')
          .attr('class', 'matrix-cell')
          .attr('x', x)
          .attr('y', y)
          .attr('width', this.cellSize)
          .attr('height', this.cellSize)
          .attr('fill', colorScales[i](dequantizedValue))
          .attr('stroke', '#333')
          .attr('stroke-width', 1)
          .on('mouseover', (event) => {
            this.showDequantizationTooltip(event, {
              originalValue: this.currentSourceMatrix[i][j],
              quantizedValue,
              dequantizedValue,
              scale,
              blockIndex: i,
              minValue: minVal,
            });
          })
          .on('mousemove', (event) => {
            this.showDequantizationTooltip(event, {
              originalValue: this.currentSourceMatrix[i][j],
              quantizedValue,
              dequantizedValue,
              scale,
              blockIndex: i,
              minValue: minVal,
            });
          })
          .on('mouseout', () => {
            this.hideTooltip();
          });

        this.svgMainContainer
          .append('text')
          .attr('class', 'matrix-text')
          .attr('x', x + this.cellSize / 2)
          .attr('y', y + this.cellSize / 2)
          .attr('text-anchor', 'middle')
          .attr('dominant-baseline', 'middle')
          .attr('font-family', 'monospace')
          .attr('font-size', '9px')
          .text(
            Math.abs(dequantizedValue) < 0.1
              ? dequantizedValue.toFixed(2)
              : dequantizedValue.toFixed(1),
          )
          .attr('fill', 'black')
          .style('pointer-events', 'none');
      }
    }
  }

  private drawNumberLines(result: QuantizationResult): void {
    const matrixWidth = 8 * this.cellSize;
    const matrixHeight = 4 * this.cellSize;
    const titleAreaHeight = 30;
    const sectionGap = 60;
    const numberLineHeight = 80;

    const col1X = this.margin;
    const col2X = col1X + matrixWidth + sectionGap;
    const col3X = col2X + matrixWidth + sectionGap;
    const matrixCellsTop = this.margin + titleAreaHeight;
    const numberLineTop = matrixCellsTop + matrixHeight + 20;

    // Draw number lines for each block
    for (let blockIdx = 0; blockIdx < 4; blockIdx++) {
      const blockY = numberLineTop + blockIdx * 20;

      // Get block data
      const originalBlock = this.currentSourceMatrix[blockIdx];
      const quantizedBlock = result.quantizedMatrix[blockIdx];
      const dequantizedBlock = result.dequantizedMatrix[blockIdx];
      const scale = result.scales[blockIdx];
      const minVal = result.mins[blockIdx];

      // Calculate value ranges
      const allValues = [...originalBlock, ...dequantizedBlock];
      const minValue = Math.min(...allValues);
      const maxValue = Math.max(...allValues);
      const range = maxValue - minValue;
      const padding = range * 0.1;
      const xScale = d3
        .scaleLinear()
        .domain([minValue - padding, maxValue + padding])
        .range([0, matrixWidth]);

      // Draw number line for original values (col1)
      this.drawBlockNumberLine(
        col1X,
        blockY,
        matrixWidth,
        xScale,
        originalBlock,
        this.blockBaseColors[blockIdx],
        `Block ${blockIdx} Original`,
        'circle',
      );

      // Draw number line for quantized values (col2) - showing quantized integers
      const quantXScale = d3
        .scaleLinear()
        .domain([0, 255])
        .range([0, matrixWidth]);

      this.drawBlockNumberLine(
        col2X,
        blockY,
        matrixWidth,
        quantXScale,
        quantizedBlock,
        this.blockBaseColors[blockIdx],
        `Block ${blockIdx} Quantized (0-255)`,
        'square',
      );

      // Draw number line for dequantized values (col3)
      this.drawBlockNumberLine(
        col3X,
        blockY,
        matrixWidth,
        xScale,
        dequantizedBlock,
        this.blockBaseColors[blockIdx],
        `Block ${blockIdx} Dequantized`,
        'triangle',
      );
    }
  }

  private drawBlockNumberLine(
    startX: number,
    startY: number,
    width: number,
    xScale: d3.ScaleLinear<number, number>,
    values: number[],
    color: string,
    title: string,
    shape: 'circle' | 'square' | 'triangle',
  ): void {
    const lineGroup = this.svgMainContainer.append('g');

    // Draw title
    lineGroup
      .append('text')
      .attr('x', startX + width / 2)
      .attr('y', startY - 5)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '8px')
      .attr('font-weight', 'bold')
      .attr('fill', color)
      .text(title);

    // Draw the main line
    lineGroup
      .append('line')
      .attr('x1', startX)
      .attr('x2', startX + width)
      .attr('y1', startY)
      .attr('y2', startY)
      .attr('stroke', '#ccc')
      .attr('stroke-width', 1);

    // Draw tick marks and values - only at start and end
    const domain = xScale.domain();
    const startValue = domain[0];
    const endValue = domain[1];

    // Start tick and label
    const startTickX = startX + xScale(startValue);
    lineGroup
      .append('line')
      .attr('x1', startTickX)
      .attr('x2', startTickX)
      .attr('y1', startY - 2)
      .attr('y2', startY + 2)
      .attr('stroke', '#999')
      .attr('stroke-width', 0.5);

    lineGroup
      .append('text')
      .attr('x', startTickX)
      .attr('y', startY + 12)
      .attr('text-anchor', 'middle')
      .attr('font-family', 'monospace')
      .attr('font-size', '7px')
      .attr('fill', '#666')
      .text(startValue.toFixed(1));

    // End tick and label (only if different from start)
    if (endValue !== startValue) {
      const endTickX = startX + xScale(endValue);
      lineGroup
        .append('line')
        .attr('x1', endTickX)
        .attr('x2', endTickX)
        .attr('y1', startY - 2)
        .attr('y2', startY + 2)
        .attr('stroke', '#999')
        .attr('stroke-width', 0.5);

      lineGroup
        .append('text')
        .attr('x', endTickX)
        .attr('y', startY + 12)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '7px')
        .attr('fill', '#666')
        .text(endValue.toFixed(1));
    }

    // Draw value points
    values.forEach((value, index) => {
      const x = startX + xScale(value);
      const y = startY;

      if (shape === 'circle') {
        lineGroup
          .append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', 3)
          .attr('fill', color)
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
          .attr('opacity', 0.8);
      } else if (shape === 'square') {
        lineGroup
          .append('rect')
          .attr('x', x - 2.5)
          .attr('y', y - 2.5)
          .attr('width', 5)
          .attr('height', 5)
          .attr('fill', color)
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
          .attr('opacity', 0.8);
      } else if (shape === 'triangle') {
        const triangleSize = 3;
        lineGroup
          .append('polygon')
          .attr(
            'points',
            `${x},${y - triangleSize} ${x - triangleSize},${y + triangleSize} ${x + triangleSize},${y + triangleSize}`,
          )
          .attr('fill', color)
          .attr('stroke', 'white')
          .attr('stroke-width', 1)
          .attr('opacity', 0.8);
      }
    });
  }

  private drawErrorBars(result: QuantizationResult): void {
    this.errorBarsSvg.selectAll('*').remove();

    const blockErrors: number[] = [];
    for (let blockIdx = 0; blockIdx < 4; blockIdx++) {
      const originalBlock = this.currentSourceMatrix[blockIdx];
      const dequantizedBlock = result.dequantizedMatrix[blockIdx];
      const error = this.currentQuantType.calculateBlockError(
        originalBlock,
        dequantizedBlock,
      );
      blockErrors.push(error);
    }

    const margin = 15;
    const chartWidth = 188 - 2 * margin;
    const chartHeight = 120 - 2 * margin;
    const barWidth = chartWidth / 4 - 6;
    const barSpacing = 6;

    const maxErr = Math.max(...blockErrors, 0.001);
    const yScale = d3.scaleLinear().domain([0, maxErr]).range([chartHeight, 0]);

    blockErrors.forEach((error, index) => {
      const barHeight = chartHeight - yScale(error);
      const x = margin + index * (barWidth + barSpacing);

      this.errorBarsSvg
        .append('rect')
        .attr('x', x)
        .attr('y', margin + yScale(error))
        .attr('width', barWidth)
        .attr('height', barHeight)
        .attr('fill', this.blockBaseColors[index])
        .attr('stroke', '#333')
        .attr('stroke-width', 0.5);

      this.errorBarsSvg
        .append('text')
        .attr('x', x + barWidth / 2)
        .attr('y', margin + yScale(error) - 2)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '9px')
        .attr('fill', '#333')
        .text(error.toFixed(2));

      this.errorBarsSvg
        .append('text')
        .attr('x', x + barWidth / 2)
        .attr('y', margin + chartHeight + 12)
        .attr('text-anchor', 'middle')
        .attr('font-family', 'monospace')
        .attr('font-size', '8px')
        .attr('fill', this.blockBaseColors[index])
        .text(`B${index}`);
    });

    // Y-axis
    this.errorBarsSvg
      .append('line')
      .attr('x1', margin - 2)
      .attr('x2', margin - 2)
      .attr('y1', margin)
      .attr('y2', margin + chartHeight)
      .attr('stroke', '#333')
      .attr('stroke-width', 1);
  }

  private createColorScales(): ((v: number) => string)[] {
    // Create color scales for each block based on their value ranges
    const colorScales: ((v: number) => string)[] = [];

    for (let blockIdx = 0; blockIdx < 4; blockIdx++) {
      const block = this.currentSourceMatrix[blockIdx];
      const min = Math.min(...block);
      const max = Math.max(...block);
      const avg = block.reduce((a, b) => a + b, 0) / block.length;

      const baseD3Color = d3.color(this.blockBaseColors[blockIdx]);
      if (!baseD3Color) {
        colorScales.push(() => this.blockBaseColors[blockIdx]);
        continue;
      }

      const lightColor = baseD3Color.brighter(1.5).toString();
      const baseColorStr = baseD3Color.toString();
      const darkColor = baseD3Color.darker(1.5).toString();

      if (min === max) {
        colorScales.push(() => baseColorStr);
      } else {
        colorScales.push(
          d3
            .scaleLinear<string>()
            .domain([min, avg, max])
            .range([lightColor, baseColorStr, darkColor])
            .clamp(true),
        );
      }
    }

    return colorScales;
  }

  private showQuantizationTooltip(event: MouseEvent, data: TooltipData): void {
    if (!this.tooltip) {
      this.tooltip = this.createTooltip();
    }

    const tooltipContent =
      this.currentQuantType.renderQuantizationTooltip(data);
    this.showTooltip(event, tooltipContent);
  }

  private showDequantizationTooltip(
    event: MouseEvent,
    data: TooltipData,
  ): void {
    if (!this.tooltip) {
      this.tooltip = this.createTooltip();
    }

    const tooltipContent =
      this.currentQuantType.renderDequantizationTooltip(data);
    this.showTooltip(event, tooltipContent);
  }

  private showTooltip(event: MouseEvent, content: string): void {
    if (!this.tooltip) return;

    const svgWrapperNode = this.svgWrapper.node();
    if (!svgWrapperNode) return;

    const wrapperRect = svgWrapperNode.getBoundingClientRect();
    const mouseX = event.clientX - wrapperRect.left;
    const mouseY = event.clientY - wrapperRect.top;

    this.tooltip.innerHTML = content;
    this.tooltip.style.display = 'block';

    setTimeout(() => {
      if (!this.tooltip) return;

      const tooltipRect = this.tooltip.getBoundingClientRect();
      let left = mouseX + 10;
      let top = mouseY - 10;

      if (left + tooltipRect.width > svgWrapperNode.clientWidth) {
        left = mouseX - tooltipRect.width - 10;
      }
      if (left < 0) {
        left = 10;
      }
      if (top + tooltipRect.height > svgWrapperNode.clientHeight) {
        top = mouseY - tooltipRect.height - 10;
      }
      if (top < 0) {
        top = mouseY + 20;
      }

      this.tooltip.style.left = `${left}px`;
      this.tooltip.style.top = `${top}px`;
    }, 0);
  }

  private hideTooltip(): void {
    if (this.tooltip) {
      this.tooltip.style.display = 'none';
    }
  }

  private createTooltip(): HTMLDivElement {
    const existingTooltip = document.querySelector('.quant-tooltip');
    if (existingTooltip) {
      return existingTooltip as HTMLDivElement;
    }

    const tooltipElement = document.createElement('div');
    tooltipElement.className = 'quant-tooltip';
    tooltipElement.style.display = 'none';
    tooltipElement.style.position = 'absolute';
    tooltipElement.style.zIndex = '1001';
    tooltipElement.style.pointerEvents = 'none';
    this.svgWrapper.node()!.appendChild(tooltipElement);
    return tooltipElement;
  }

  private handleSourceCellClick(
    rowIndex: number,
    colIndex: number,
    x: number,
    y: number,
  ): void {
    // Create a temporary rect for the input overlay
    const targetRect = this.svgMainContainer
      .append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('width', this.cellSize)
      .attr('height', this.cellSize)
      .style('opacity', 0);

    const currentValue = this.currentSourceMatrix[rowIndex][colIndex];
    this.showEditableInput(
      targetRect.node() as SVGElement,
      currentValue,
      (newValueStr) => {
        const newValue = parseFloat(newValueStr);
        if (!isNaN(newValue)) {
          this.currentSourceMatrix[rowIndex][colIndex] = newValue;
          this.currentConfig = this.currentQuantType.initializeQuantization(
            this.currentSourceMatrix,
          );
          this.createParameterSliders();
          this.redrawVisualization();
          return true;
        } else {
          alert('Invalid input. Please enter a number.');
          return false;
        }
      },
    );

    targetRect.remove();
  }

  private showEditableInput(
    targetSVGElement: SVGElement,
    initialValue: string | number,
    onCommit: (newValue: string) => boolean,
    onCancel?: () => void,
  ): void {
    this.removeActiveInputElement();

    const targetRect = targetSVGElement.getBoundingClientRect();
    const wrapperRect = this.svgWrapper.node()!.getBoundingClientRect();

    const input = document.createElement('input');
    input.type = 'text';
    input.value = initialValue.toString();
    input.style.position = 'absolute';
    input.style.left = `${targetRect.left - wrapperRect.left}px`;
    input.style.top = `${targetRect.top - wrapperRect.top}px`;
    input.style.width = `${targetRect.width}px`;
    input.style.height = `${targetRect.height}px`;
    input.style.fontSize = '8px';
    input.style.fontFamily = 'monospace';
    input.style.textAlign = 'center';
    input.style.border = '1px solid #007bff';
    input.style.boxSizing = 'border-box';
    input.style.zIndex = '1000';

    const commitAndCleanup = (value: string) => {
      const committed = onCommit(value);
      this.removeActiveInputElement();
      if (!committed && onCancel) onCancel();
    };

    input.onblur = () => {
      commitAndCleanup(input.value);
    };

    input.onkeydown = (e) => {
      if (e.key === 'Enter') {
        commitAndCleanup(input.value);
      } else if (e.key === 'Escape') {
        this.removeActiveInputElement();
        if (onCancel) onCancel();
      }
    };

    this.svgWrapper.node()!.appendChild(input);
    input.focus();
    input.select();
    this.activeInputElement = input;
  }

  private removeActiveInputElement(): void {
    const elementToRemove = this.activeInputElement;
    this.activeInputElement = null;

    if (elementToRemove && elementToRemove.parentNode) {
      try {
        elementToRemove.parentNode.removeChild(elementToRemove);
      } catch (e: any) {
        if (e.name === 'NotFoundError') {
          console.warn(
            'Attempted to remove an input element that was not found under its parent.',
          );
        } else {
          throw e;
        }
      }
    }
  }
}

export function quantTypeInteractive(): void {
  const visualization = new QuantizationVisualization();
  visualization.initialize();
}
