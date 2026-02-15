import * as d3 from 'd3';
import { PROJECT_COLORS } from '../config';

function applyVisualizationStyles(): void {
  const existingStyle = document.getElementById(
    'general-quantization-intro-styles',
  );
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = 'general-quantization-intro-styles';
  style.textContent = `
    #general-quantization-intro-section {
      margin-top: 1em;
      margin-bottom: 1.5em;
      padding-top: 1em;
    }

    #general-quantization-intro-section h2#general-quantization-intro-title {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.6em;
      font-weight: 600;
      color: ${PROJECT_COLORS.headingColor};
      margin-top: 0;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }

    #general-quantization-intro-section p#general-quantization-intro-text {
      font-family: Georgia, serif;
      font-size: 1em;
      line-height: 1.7;
      color: ${PROJECT_COLORS.textColor};
      margin-bottom: 1.5em;
    }

    #general-quantization-intro-svg-wrapper {
      border: 1px solid ${PROJECT_COLORS.textColor}20;
      border-radius: 4px;
      overflow: hidden;
      max-width: 100%;
    }

    #general-quantization-intro-svg-wrapper svg {
      display: block;
      width: 100%;
    }

    .llm-question {
      background-color: #f7f7f7;
      padding: 1em;
      border-radius: 4px;
      border-left: 4px solid ${PROJECT_COLORS.primaryVizColor};
      margin-top: 1.5em;
    }      
  `;
  document.head.appendChild(style);
}

export function initGeneralQuantizationIntro(): void {
  applyVisualizationStyles();

  const mainD3Selection = d3.select<HTMLElement, unknown>('main');
  if (mainD3Selection.empty()) {
    console.error(
      'Main element not found for General Quantization Intro visualization.',
    );
    return;
  }

  const oldPlaceholderId = 'general-quantization-intro-container';
  const vizSectionId = 'general-quantization-intro-section';
  const titleId = 'general-quantization-intro-title';
  const introTextId = 'general-quantization-intro-text';
  const svgWrapperId = 'general-quantization-intro-svg-wrapper';

  const existingOldPlaceholder = document.getElementById(oldPlaceholderId);
  if (existingOldPlaceholder) {
    existingOldPlaceholder.remove();
  }

  let existingVizSection = d3.select<HTMLElement, unknown>(`#${vizSectionId}`);
  if (!existingVizSection.empty()) {
    existingVizSection.remove();
  }

  const vizSection: d3.Selection<HTMLElement, unknown, HTMLElement, unknown> =
    mainD3Selection.append<HTMLElement>('section').attr('id', vizSectionId);

  vizSection
    .append<HTMLHeadingElement>('h2')
    .attr('id', titleId)
    .text('Oh Snap!');

  vizSection
    .append<HTMLHeadingElement>('h3')
    .attr('id', titleId)
    .text('What is Lost When We Quantize?');

  const svgWrapper: d3.Selection<
    HTMLDivElement,
    unknown,
    HTMLElement,
    unknown
  > = vizSection.append<HTMLDivElement>('div').attr('id', svgWrapperId);

  vizSection
    .append<HTMLParagraphElement>('p')
    .attr('id', introTextId)
    .html(
      'Quantization is the process of taking values in a higher-resolution datatype and mapping them to a lower-resolution one. ' +
        'For example, mapping 32-bit floating points to a set of 4 bit integers. <br/><br/>' +
        'This general mechanism is used ubiquitously in signal processing and computers: it underlies many things - ' +
        'audio codecs, computer graphics and more recently has been used to <b>shrink the weights of neural networks</b> to reduce their size.',
    );

  vizSection
    .append('p')
    .attr('class', 'llm-question')
    .html(
      '<b>Why Quantize Models?</b><br/> ' +
        'Quantization has become more popular in recent years, enabling inference for models with small footprints which maintain much of their capability. ' +
        'For example one open source quantized version of Gemma3 27B with Quantization Aware Training (QAT) outperforms gpt3.5 on certain benchmarks ' +
        'while still being <20GB on disk.' +
        '<sup><a href="https://huggingface.co/bartowski/google_gemma-3-27b-it-qat-GGUF" target="_blank">[1]</a></sup>' +
        '<sup><a href="https://www.reddit.com/r/LocalLLaMA/comments/1k6nrl1/i_benchmarked_the_gemma_3_27b_qat_models/" target="_blank">[2]</a></sup>' +
        '<sup><a href="https://www.vals.ai/benchmarks/gpqa-03-11-2025" target="_blank">[3]</a></sup>.',
    );

  vizSection
    .append('p')
    .html(
      'Since there is no free lunch, it is natural to ask what does it cost to quantize something? What does the error look like or sound like? ' +
        'Or in the case of an LLM, how is quantization applied and how does it impact model outputs? ' +
        'The intention of this article is to provide intution into what this error is at a high level ' +
        'and observe how it specifically manifests for an example quantized LLM. ' +
        '<br/>',
    );

  const designWidth = 800;
  const designHeight = 200; // Make it more compact
  const margin = { top: 10, right: 20, bottom: 10, left: 20 }; // Reduce vertical margins
  const innerWidth = designWidth - margin.left - margin.right;
  const innerHeight = designHeight - margin.top - margin.bottom;

  const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown> =
    svgWrapper
      .append<SVGSVGElement>('svg')
      .attr('viewBox', `0 0 ${designWidth} ${designHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block')
      .style('width', '100%')
      .style('height', '100%');

  // Create main group for the visualization
  const g = svg
    .append('g')
    .attr('transform', `translate(${margin.left}, ${margin.top})`);

  // Set up scales
  const xScale = d3
    .scaleLinear()
    .domain([0, 4 * Math.PI]) // Two full cycles
    .range([0, innerWidth]);

  // Reserve space for error visualization at the bottom
  const sineWaveHeight = innerHeight * 0.6; // Use 60% of height for sine wave
  const yScale = d3
    .scaleLinear()
    .domain([-1.2, 1.2])
    .range([sineWaveHeight, 0]);

  // Generate initial sine wave data
  const numPoints = 200;
  const quantizationLevels = [16, 8, 4, 2, 4, 8]; // Cycling quantization levels
  let currentLevelIndex = 0;
  let levelChangeCounter = 0;
  const framesPerLevelChange = 300; // Change level every 5 seconds at 60fps
  let phase = 0;

  function generateSineWaveData(phaseOffset: number): Array<[number, number]> {
    const data: Array<[number, number]> = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * 4 * Math.PI;
      const y = Math.sin(x + phaseOffset);
      data.push([x, y]);
    }
    return data;
  }

  function generateQuantizedSineWaveData(
    phaseOffset: number,
    currentQuantLevels: number,
  ): Array<[number, number]> {
    const data: Array<[number, number]> = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * 4 * Math.PI;
      const y = Math.sin(x + phaseOffset);

      // Quantize the y value to discrete levels
      const quantizedY =
        Math.round(y * (currentQuantLevels / 2)) / (currentQuantLevels / 2);
      const clampedY = Math.max(-1, Math.min(1, quantizedY));

      data.push([x, clampedY]);
    }
    return data;
  }
  // Define color interpolation colors (left and right colors)
  const leftColor = '#fff'; // Deep charcoal
  const rightColor = '#000'; // Sophisticated indigo

  // Create color interpolator
  const colorInterpolator = d3.interpolateRgb(leftColor, rightColor);

  // Create gradient definitions for the paths
  const defs = svg.append('defs');

  // Create gradient for continuous sine wave
  const continuousGradient = defs
    .append('linearGradient')
    .attr('id', 'continuous-gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', margin.left)
    .attr('x2', margin.left + innerWidth)
    .attr('y1', 0)
    .attr('y2', 0);

  continuousGradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', leftColor);

  continuousGradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', rightColor);

  // Create gradient for quantized sine wave
  const quantizedGradient = defs
    .append('linearGradient')
    .attr('id', 'quantized-gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', margin.left)
    .attr('x2', margin.left + innerWidth)
    .attr('y1', 0)
    .attr('y2', 0);

  quantizedGradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', leftColor);

  quantizedGradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', rightColor);

  // Create line generator
  const line = d3
    .line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveCardinal);

  // Create line generator for quantized data (use step curve for stepped appearance)
  const quantizedLine = d3
    .line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => yScale(d[1]))
    .curve(d3.curveStepAfter);

  // Create the sine wave path (original continuous)
  const sinePath = g
    .append('path')
    .datum(generateSineWaveData(phase))
    .attr('class', 'sine-wave')
    .attr('d', line)
    .attr('fill', 'none')
    .attr('stroke', 'url(#continuous-gradient)')
    .attr('stroke-width', 4)
    .attr('opacity', 0.7);

  // Create the quantized sine wave path
  const quantizedPath = g
    .append('path')
    .datum(
      generateQuantizedSineWaveData(
        phase,
        quantizationLevels[currentLevelIndex],
      ),
    )
    .attr('class', 'quantized-sine-wave')
    .attr('d', quantizedLine)
    .attr('fill', 'none')
    .attr('stroke', 'url(#quantized-gradient)')
    .attr('stroke-width', 3);

  // Add error visualization area - position it between sine wave and bars
  const errorAreaHeight = 30;
  const errorAreaY = sineWaveHeight + 5; // Start 5px below sine wave area

  // Create error background
  const errorBackground = g
    .append('rect')
    .attr('class', 'error-background')
    .attr('x', 0)
    .attr('y', errorAreaY)
    .attr('width', innerWidth)
    .attr('height', errorAreaHeight)
    .attr('fill', '#f8f8f8')
    .attr('stroke', '#ddd')
    .attr('stroke-width', 1)
    .attr('rx', 2);

  // Create scale for error visualization
  const errorScale = d3
    .scaleLinear()
    .domain([0, 1]) // Error ranges from 0 to max possible error
    .range([errorAreaHeight, 0]);

  // Create error line generator
  const errorLine = d3
    .line<[number, number]>()
    .x((d) => xScale(d[0]))
    .y((d) => errorScale(d[1]))
    .curve(d3.curveCardinal);

  // Function to generate error data
  function generateErrorData(
    phaseOffset: number,
    quantLevels: number,
  ): Array<[number, number]> {
    const data: Array<[number, number]> = [];
    for (let i = 0; i <= numPoints; i++) {
      const x = (i / numPoints) * 4 * Math.PI;
      const original = Math.sin(x + phaseOffset);

      // Calculate quantized value
      const quantized =
        Math.round(original * (quantLevels / 2)) / (quantLevels / 2);
      const clampedQuantized = Math.max(-1, Math.min(1, quantized));

      // Calculate error (absolute difference)
      const error = Math.abs(original - clampedQuantized);

      data.push([x, error]);
    }
    return data;
  }

  // Create error path
  const errorPath = g
    .append('path')
    .datum(generateErrorData(phase, quantizationLevels[currentLevelIndex]))
    .attr('class', 'error-wave')
    .attr('d', errorLine)
    .attr('fill', 'none')
    .attr('stroke', '#e74c3c')
    .attr('stroke-width', 2)
    .attr('transform', `translate(0, ${errorAreaY})`);

  // Add error area fill
  const errorArea = d3
    .area<[number, number]>()
    .x((d) => xScale(d[0]))
    .y0(errorScale(0))
    .y1((d) => errorScale(d[1]))
    .curve(d3.curveCardinal);

  const errorFill = g
    .append('path')
    .datum(generateErrorData(phase, quantizationLevels[currentLevelIndex]))
    .attr('class', 'error-fill')
    .attr('d', errorArea)
    .attr('fill', '#e74c3c')
    .attr('fill-opacity', 0.3)
    .attr('transform', `translate(0, ${errorAreaY})`);

  // Add error label
  const errorLabel = g
    .append('text')
    .attr('class', 'error-label')
    .attr('x', 10)
    .attr('y', errorAreaY + 12)
    .style('font-size', '10px')
    .style('font-weight', 'bold')
    .style('fill', '#e74c3c')
    .text('Quantization Error');

  // Add gradient bars below the error visualization
  const barHeight = 10;
  const barSpacing = 5;
  const barsStartY = errorAreaY + errorAreaHeight + 5; // Position bars below error area

  // Function to create quantized gradient stops
  function createQuantizedGradientStops(levels: number) {
    const quantizedGradientStops = defs.select('#quantized-bar-gradient');
    if (!quantizedGradientStops.empty()) {
      quantizedGradientStops.remove();
    }

    const newQuantizedGradient = defs
      .append('linearGradient')
      .attr('id', 'quantized-bar-gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', margin.left)
      .attr('x2', margin.left + innerWidth)
      .attr('y1', 0)
      .attr('y2', 0);

    // Create discrete color stops for quantized appearance
    for (let i = 0; i < levels; i++) {
      const startPosition = i / levels;
      const endPosition = (i + 1) / levels;
      const color = colorInterpolator(
        startPosition + (endPosition - startPosition) / 2,
      );

      // Add flat segment for this quantization level
      newQuantizedGradient
        .append('stop')
        .attr('offset', `${(startPosition * 100).toFixed(2)}%`)
        .attr('stop-color', color);

      newQuantizedGradient
        .append('stop')
        .attr('offset', `${(endPosition * 100).toFixed(2)}%`)
        .attr('stop-color', color);
    }
  }

  // Initialize quantized gradient
  createQuantizedGradientStops(quantizationLevels[currentLevelIndex]);

  // Quantized gradient bar
  const quantizedGradientBar = g
    .append('rect')
    .attr('class', 'quantized-gradient-bar')
    .attr('x', 0)
    .attr('y', barsStartY)
    .attr('width', innerWidth)
    .attr('height', barHeight)
    .attr('fill', 'url(#quantized-bar-gradient)')
    .attr('stroke', '#333')
    .attr('stroke-width', 1);

  // Add background rectangle for text readability
  const textBackground = g
    .append('rect')
    .attr('class', 'level-display-bg')
    .attr('x', innerWidth - 120)
    .attr('y', 5)
    .attr('width', 110)
    .attr('height', 20)
    .attr('fill', 'rgba(255, 255, 255, 0.9)')
    .attr('stroke', leftColor)
    .attr('stroke-width', 1)
    .attr('rx', 4);

  // Add text display for current quantization level
  const levelDisplay = g
    .append('text')
    .attr('class', 'level-display')
    .attr('x', innerWidth - 65)
    .attr('y', 18)
    .attr('text-anchor', 'middle')
    .style('font-size', '12px')
    .style('font-weight', 'bold')
    .style('fill', leftColor)
    .text(`${quantizationLevels[currentLevelIndex]} levels`);

  // Animation function
  function animate() {
    phase += 0.02; // Slower oscillation

    // Update level change counter
    levelChangeCounter++;
    if (levelChangeCounter >= framesPerLevelChange) {
      levelChangeCounter = 0;
      currentLevelIndex = (currentLevelIndex + 1) % quantizationLevels.length;

      // Update level display text
      levelDisplay.text(`${quantizationLevels[currentLevelIndex]} levels`);

      // Update quantized gradient bar
      createQuantizedGradientStops(quantizationLevels[currentLevelIndex]);
    }

    // Update both paths
    sinePath.datum(generateSineWaveData(phase)).attr('d', line);

    quantizedPath
      .datum(
        generateQuantizedSineWaveData(
          phase,
          quantizationLevels[currentLevelIndex],
        ),
      )
      .attr('d', quantizedLine);

    // Update error visualization
    const currentErrorData = generateErrorData(
      phase,
      quantizationLevels[currentLevelIndex],
    );
    errorPath.datum(currentErrorData).attr('d', errorLine);
    errorFill.datum(currentErrorData).attr('d', errorArea);

    requestAnimationFrame(animate);
  }

  // Start animation
  animate();

  console.log('General Quantization Intro Visualization Initialized');
}
