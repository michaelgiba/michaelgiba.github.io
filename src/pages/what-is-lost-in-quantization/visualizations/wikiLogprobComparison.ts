import * as d3 from 'd3';
import { PROJECT_COLORS } from '../config';

// Define the interface for the data structure
interface WikiTextData {
  allTokens: string[];
  windowData: Array<{
    start: number;
    end: number;
    nextCharIdx: number;
    logprobU: number;
    logprobQ: number;
  }>;
}

// Function to fetch data from JSON file
async function fetchWikiTextData(): Promise<WikiTextData> {
  try {
    const response = await fetch('./assets/wikitext/results.json');
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error loading wiki text data:', error);
    throw error;
  }
}

function applyWikiLogprobStyles(): void {
  const existingStyle = document.getElementById('wiki-logprob-viz-styles');
  if (existingStyle) existingStyle.remove();
  const style = document.createElement('style');
  style.id = 'wiki-logprob-viz-styles';
  style.textContent = `
    #wiki-logprob-visualization-section {
      margin-top: 2em;
      margin-bottom: 3em;
      padding-top: 1em;
    }
    #wiki-logprob-visualization-section h2#wiki-logprob-title {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.6em;
      font-weight: 600;
      color: ${PROJECT_COLORS.headingColor};
      margin-top: 0;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }
    #wiki-logprob-visualization-section p#wiki-logprob-intro {
      font-family: Georgia, serif;
      font-size: 1em;
      line-height: 1.7;
      color: ${PROJECT_COLORS.textColor};
      margin-bottom: 1.5em;
    }
    .wiki-logprob-intro-text {
      font-family: Georgia, serif;
      font-size: 1em;
      line-height: 1.7;
      color: ${PROJECT_COLORS.textColor};
      margin-bottom: 2em;
    }
    .wiki-logprob-intro-text h2 {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.4em;
      font-weight: 600;
      color: ${PROJECT_COLORS.headingColor};
      margin-bottom: 0.8em;
      line-height: 1.3;
    }
    .wiki-logprob-intro-text p {
      margin-bottom: 1em;
    }
    .wiki-logprob-intro-text ol {
      margin-top: -0.5em;
      margin-bottom: 1em;
      margin-left: 2em;
    }
    .wiki-logprob-intro-text code {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      background-color: #f0f0f0;
      padding: 0.2em 0.4em;
      border-radius: 3px;
      font-size: 0.9em;
    }
    .wiki-logprob-intro-text a {
      color: ${PROJECT_COLORS.primaryVizColor};
      text-decoration: none;
      border-bottom: 1px dotted ${PROJECT_COLORS.primaryVizColor};
    }
    .wiki-logprob-intro-text a:hover {
      text-decoration: underline;
    }
    .data-collection-callout {
      background-color: #f8f9fa;
      border: 1px solid #e9ecef;
      border-left: 4px solid ${PROJECT_COLORS.primaryVizColor};
      padding: 1em 1em;
      margin: 1.5em 0;
      border-radius: 4px;
    }
    .data-collection-callout h3 {
      margin-top: 0;
      margin-bottom: 0.5em;
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.1em;
      color: ${PROJECT_COLORS.headingColor};
    }
    .data-collection-callout p {
        margin-bottom: 0.5em;
    }
    .data-collection-callout ol {
        margin-left: 1.5em;
        margin-bottom: 1em;
    }
    .wiki-token-row {
      display: flex;
      flex-direction: row;
      flex-wrap: wrap;
      gap: 0.2em;
      margin-bottom: 1.5em;
      background: #f8f8f8;
      border-radius: 6px;
      padding: 0.7em 0.5em;
      box-shadow: 0 1px 3px #0001;
    }
    .wiki-token {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin: 0 0.1em;
      font-family: monospace;
      position: relative;
    }
    .wiki-token-text {
      font-size: 0.8em;
      padding: 0.1em 0.2em;
      border-bottom: 2px solid ${PROJECT_COLORS.primaryVizColor};
      border-radius: 2px;
      background: #fff;
      margin-bottom: 0.1em;
    }
    .wiki-token-index {
      font-size: 0.6em;
      color: #888;
      margin-bottom: 0.1em;
    }
    .wiki-window-legend {
      display: flex;
      gap: 1em;
      margin-bottom: 0.5em;
      font-size: 0.85em;
      justify-content: center;
    }
    .wiki-legend-item {
      display: flex;
      align-items: center;
      gap: 0.3em;
    }
    .wiki-legend-box {
      width: 16px;
      height: 16px;
      border-radius: 3px;
      border: 2px solid;
    }
    .wiki-legend-box.window {
      background: #b3d9ff;
      border-color: #2196f3;
    }
    .wiki-legend-box.next-char {
      background: #ffcc80;
      border-color: #ff9800;
    }
    .wiki-excerpt-switcher {
      display: flex;
      gap: 0.5em;
      margin-bottom: 1em;
      justify-content: flex-end;
      align-items: center;
    }
    .wiki-excerpt-switcher label {
      font-size: 0.95em;
      color: ${PROJECT_COLORS.textColor};
      margin-right: 0.5em;
    }
    .wiki-excerpt-dropdown {
      background: #fff;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 0.3em 0.7em;
      font-size: 0.95em;
      cursor: pointer;
      transition: border-color 0.15s;
    }
    .wiki-excerpt-dropdown:focus {
      outline: none;
      border-color: ${PROJECT_COLORS.primaryVizColor};
    }
    .wiki-window-controls {
      display: flex;
      align-items: center;
      gap: 0.7em;
    }
    .wiki-controls-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.7em;
      margin-top: 0.5em;
    }
    .wiki-window-arrow {
      background: #eee;
      border: 1px solid #ccc;
      border-radius: 3px;
      padding: 0.2em 0.7em;
      font-size: 1.2em;
      cursor: pointer;
      transition: background 0.15s;
      user-select: none;
    }
    .wiki-window-arrow:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .wiki-window-info {
      font-size: 0.95em;
      color: #555;
    }
    .wiki-token.in-window .wiki-token-text {
      background: #2196f3;
      color: white;
      border: 2px solid #2196f3;
      box-shadow: 0 0 8px rgba(33, 150, 243, 0.3);
      font-weight: 600;
    }
    .wiki-token.next-char .wiki-token-text {
      background: #ffcc80 !important;
      border: 3px solid #ff9800;
      box-shadow: 0 0 12px rgba(255, 152, 0, 0.5);
      font-weight: 700;
      transform: scale(1.1);
      position: relative;
    }
    .wiki-token.next-char .wiki-token-text::after {
      content: "⏭️";
      position: absolute;
      top: -25px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1.2em;
      animation: bounce 1.5s infinite;
    }
    .wiki-token.clickable .wiki-token-text {
      cursor: pointer;
      border-bottom: 2px dotted ${PROJECT_COLORS.headingColor};
    }
    .wiki-token.clickable:hover .wiki-token-text {
      background-color: #f0f0f0;
    }
    @keyframes bounce {
      0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
      40% { transform: translateX(-50%) translateY(-3px); }
      60% { transform: translateX(-50%) translateY(-1px); }
    }
    .wiki-logprob-details {
      margin-bottom: 0.7em;
      font-size: 0.9em;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 6px;
      padding: 0.6em 0.8em;
      border: 1px solid #dee2e6;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      color: #333;
      max-width: 500px;
    }
    .wiki-logprob-details .section-title {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 1em;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.3em;
      display: flex;
      align-items: center;
    }
    .wiki-logprob-details .section-title::before {
      content: "📊";
      margin-right: 0.4em;
      font-size: 0.9em;
    }
    .wiki-logprob-details .section-description {
      font-size: 0.85em;
      line-height: 1.4;
      color: #5a6c7d;
      margin-bottom: 0.5em;
      font-style: italic;
    }
    .wiki-logprob-details .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 0.4em;
    }
    .wiki-logprob-details .metric-item {
      background: rgba(255, 255, 255, 0.7);
      border-radius: 4px;
      padding: 0.3em 0.5em;
      border-left: 3px solid #ccc;
      transition: transform 0.15s ease;
    }
    .wiki-logprob-details .metric-item:hover {
      transform: translateY(-1px);
    }
    .wiki-logprob-details .metric-item.difference {
      border-left-color: #dc3545;
    }
    .wiki-logprob-details .metric-label {
      font-size: 0.75em;
      color: #6c757d;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 0.1em;
    }
    .wiki-logprob-details .metric-value {
      font-size: 1em;
      font-weight: 700;
      color: #2c3e50;
      font-family: 'Courier New', monospace;
    }
    
    /* Top Differences Section Styles */
    .wiki-top-differences {
      margin-bottom: 2em;
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 8px;
      padding: 1.2em;
      border: 1px solid #dee2e6;
      box-shadow: 0 2px 8px rgba(0,0,0,0.08);
    }
    
    .wiki-top-differences h3 {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      font-size: 1.3em;
      font-weight: 600;
      color: #2c3e50;
      margin-bottom: 0.8em;
      display: flex;
      align-items: center;
      margin-top: 0;
    }
    
    .wiki-top-differences h3::before {
      content: "🔍";
      margin-right: 0.5em;
    }
    
    .wiki-difference-item {
      background: #fff;
      border-radius: 6px;
      padding: 0.8em;
      margin-bottom: 0.8em;
      border: 1px solid #e0e0e0;
      box-shadow: 0 1px 4px rgba(0,0,0,0.06);
      transition: transform 0.15s ease, box-shadow 0.15s ease;
    }
    
    .wiki-difference-item:hover {
      transform: translateY(-1px);
      box-shadow: 0 2px 8px rgba(0,0,0,0.12);
    }
    
    .wiki-difference-item:last-child {
      margin-bottom: 0;
    }
    
    .wiki-difference-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.6em;
      font-size: 0.9em;
    }
    
    .wiki-difference-rank {
      font-weight: 600;
      color: #6c757d;
      font-size: 0.85em;
    }
    
    .wiki-difference-metrics {
      display: flex;
      gap: 1em;
      font-family: 'Courier New', monospace;
      font-size: 0.85em;
    }
    
    .wiki-difference-metric {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    
    .wiki-difference-metric-label {
      font-size: 0.7em;
      color: #6c757d;
      text-transform: uppercase;
      letter-spacing: 0.3px;
      margin-bottom: 0.1em;
    }
    
    .wiki-difference-metric-value {
      font-weight: 700;
      color: #2c3e50;
    }
    
    .wiki-difference-metric-value.difference {
      color: #dc3545;
      font-size: 1.1em;
    }
    
    .wiki-difference-tokens {
      margin-top: 0.5em;
    }
    
    .wiki-difference-token-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.15em;
      align-items: center;
    }
    
    .wiki-difference-token {
      font-family: monospace;
      font-size: 0.75em;
      padding: 0.2em 0.3em;
      border-radius: 3px;
      border: 1px solid #ddd;
      background: #f8f9fa;
    }
    
    .wiki-difference-token.in-window {
      background: #2196f3;
      color: white;
      border-color: #2196f3;
      font-weight: 600;
    }
    
    .wiki-difference-token.next-char {
      background: #ff9800;
      color: white;
      border-color: #ff9800;
      font-weight: 700;
      position: relative;
      transform: scale(1.05);
    }
    
    .wiki-difference-token.next-char::after {
      content: "⏭️";
      position: absolute;
      top: -20px;
      left: 50%;
      transform: translateX(-50%);
      font-size: 1em;
    }
    
    .wiki-difference-ellipsis {
      color: #6c757d;
      font-style: italic;
      margin: 0 0.3em;
    }
  `;
  document.head.appendChild(style);
}

export function initWikiLogprobComparison(): void {
  applyWikiLogprobStyles();
  const mainD3Selection = d3.select<HTMLElement, unknown>('main');
  if (mainD3Selection.empty()) {
    console.error('Main element not found for Wiki Logprob Comparison.');
    return;
  }
  const vizSectionId = 'wiki-logprob-visualization-section';
  let existingVizSection = d3.select<HTMLElement, unknown>(`#${vizSectionId}`);
  if (!existingVizSection.empty()) {
    existingVizSection.remove();
  }
  const vizSection = mainD3Selection
    .append<HTMLElement>('section')
    .attr('id', vizSectionId);

  const introSection = vizSection
    .append('div')
    .attr('class', 'wiki-logprob-intro-text');

  introSection.html(`
    <h2>What is lost for LLMs though?</h2>
    <p>
      Obviously we are losing something by snapping values to lower resolutions, but how can we figure out exactly what that is?
      We know that each weight from the original fidelity representation now has some noise added to it. We could determine this difference by subtracting
      (<code>original model weight - dequantized model weight = noise</code>), but this won't tell us much.
    </p>
    <p>
      Another idea is, instead of looking at the weights, look at the model's change in certainty against some known dataset.
      Comparing the output probabilities of the original and quantized models will give us hints into where the model has changed in certainty.
      One common way this is done is practice via <a href="https://huggingface.co/docs/evaluate/en/perplexity" target="_blank">Perplexity</a>.
      (No not the AI application, the metric which predates it).
    </p>
    <div class="data-collection-callout">
        <h3>Data Collection</h3>
        <p>For demonstration purposes I implemented a variation of this metric, basically we:</p>
        <ol>
            <li>Get a target dataset (<a href="https://huggingface.co/datasets/Salesforce/wikitext/" target="blank_">wikitext</a>)</li>
            <li>Slide a window over the dataset to capture input context tokens <code>x_0, ..., x_i-1</code></li>
            <li>Run inference for the quantized and unquantized models for the same input context</li> 
            <li>Get each model's log-probability for the next true token in the dataset, <code>x_i</code></li>
        </ol>
        <p>
          Then to see some impacts of the quantization error we have added, we look at the places in <code>wikitext</code> with 
          the largest absolute difference between model logprobs.
        </p>
        <p>The models I used for this test were:</p>
        <ul>
          <li><strong>Unquantized:</strong> <code><a href="https://huggingface.co/unsloth/gemma-3-1b-it-GGUF/blob/main/gemma-3-1b-it-BF16.gguf" target="_blank">gemma-3-1b-it-BF16</a></code></li>
          <li><strong>Quantized:</strong> <code><a href="https://huggingface.co/unsloth/gemma-3-1b-it-GGUF/blob/main/gemma-3-1b-it-Q4_0.gguf" target="_blank">gemma-3-1b-it-Q4_0</a></code></li>
        </ul>
        <p>
          Although the process is general and could be run with others. 
          You can see the code for that <a href="https://github.com/michaelgiba/what-is-lost-in-quantization/blob/main/python/main.py" target="_blank">here</a>.
        </p>
    </div>
  `);

  const vizContainer = vizSection
    .append('div')
    .attr('id', 'wiki-logprob-viz-container');

  // Initialize visualization with loading state
  const loadingContainer = vizSection
    .append('div')
    .attr('id', 'loading-container');
  loadingContainer.append('p').text('Loading data...');

  // Load data and initialize visualization
  initializeVisualization(vizSection);
}

function createTopDifferencesSection(
  vizSection: d3.Selection<HTMLElement, unknown, HTMLElement, any>,
  allTokens: string[],
  windowData: Array<{
    start: number;
    end: number;
    nextCharIdx: number;
    logprobU: number;
    logprobQ: number;
  }>,
): void {
  // Sort windows by absolute difference in probabilities (descending)
  const sortedWindows = [...windowData]
    .map((window, originalIndex) => {
      const pQ = Math.exp(window.logprobQ);
      const pU = Math.exp(window.logprobU);
      return {
        ...window,
        pQ,
        pU,
        difference: Math.abs(pQ - pU),
        originalIndex,
      };
    })
    .sort((a, b) => b.difference - a.difference)
    .slice(0, 10); // Show top 10

  console.log(
    'Top differences:',
    sortedWindows.slice(0, 5).map((w) => ({
      start: w.start,
      end: w.end,
      windowSize: w.end - w.start,
      nextChar: w.nextCharIdx,
      tokens: allTokens.slice(w.start, w.end),
      difference: w.difference,
    })),
  );

  let currentTopWindowIndex = 0;

  const topDifferencesSection = vizSection
    .append('div')
    .attr('class', 'wiki-top-differences');

  topDifferencesSection.append('h3').text('Top Quantization Impact Windows');

  topDifferencesSection
    .append('p')
    .style('font-size', '0.9em')
    .style('color', '#6c757d')
    .style('margin-bottom', '1em')
    .text(
      'Navigate through the sliding windows with the largest differences in log-probability predictions. ' +
        'An interesting observation is that tokens involving numbers, especially that are part of years seemed to ' +
        'have some of the largest changes in certainty.',
    );

  // Navigation controls
  const controlsRow = topDifferencesSection
    .append('div')
    .attr('class', 'wiki-controls-row')
    .style('margin-bottom', '1em');

  const controls = controlsRow
    .append('div')
    .attr('class', 'wiki-window-controls');

  const prevButton = controls
    .append('button')
    .attr('class', 'wiki-window-arrow')
    .text('←')
    .on('click', () => {
      if (currentTopWindowIndex > 0) {
        currentTopWindowIndex--;
        renderTopWindow();
      }
    });

  const windowInfo = controls.append('span').attr('class', 'wiki-window-info');

  const nextButton = controls
    .append('button')
    .attr('class', 'wiki-window-arrow')
    .text('→')
    .on('click', () => {
      if (currentTopWindowIndex < sortedWindows.length - 1) {
        currentTopWindowIndex++;
        renderTopWindow();
      }
    });

  // Container for the current window display
  const windowContainer = topDifferencesSection
    .append('div')
    .attr('id', 'top-window-container');

  function renderTopWindow() {
    windowContainer.selectAll('*').remove();

    const window = sortedWindows[currentTopWindowIndex];

    console.log('Rendering top window:', {
      window,
      start: window.start,
      end: window.end,
      nextCharIdx: window.nextCharIdx,
      difference: window.difference,
    });

    // Update controls
    prevButton.attr('disabled', currentTopWindowIndex === 0 ? true : null);
    nextButton.attr(
      'disabled',
      currentTopWindowIndex === sortedWindows.length - 1 ? true : null,
    );
    windowInfo.text(
      `Rank ${currentTopWindowIndex + 1} of ${sortedWindows.length}`,
    );

    const itemContainer = windowContainer
      .append('div')
      .attr('class', 'wiki-difference-item');

    // Header with rank and metrics
    const header = itemContainer
      .append('div')
      .attr('class', 'wiki-difference-header');

    header
      .append('div')
      .attr('class', 'wiki-difference-rank')
      .text(`#${currentTopWindowIndex + 1}`);

    const metrics = header
      .append('div')
      .attr('class', 'wiki-difference-metrics');

    // Quantized probability metric
    const quantizedMetric = metrics
      .append('div')
      .attr('class', 'wiki-difference-metric');
    quantizedMetric
      .append('div')
      .attr('class', 'wiki-difference-metric-label')
      .text('Quantized Prob.');
    quantizedMetric
      .append('div')
      .attr('class', 'wiki-difference-metric-value')
      .text(window.pQ.toFixed(5));

    // Unquantized probability metric
    const unquantizedMetric = metrics
      .append('div')
      .attr('class', 'wiki-difference-metric');
    unquantizedMetric
      .append('div')
      .attr('class', 'wiki-difference-metric-label')
      .text('Unquantized Prob.');
    unquantizedMetric
      .append('div')
      .attr('class', 'wiki-difference-metric-value')
      .text(window.pU.toFixed(5));

    // Absolute probability difference metric
    const differenceMetric = metrics
      .append('div')
      .attr('class', 'wiki-difference-metric');
    differenceMetric
      .append('div')
      .attr('class', 'wiki-difference-metric-label')
      .text('Abs Prob Diff');
    differenceMetric
      .append('div')
      .attr('class', 'wiki-difference-metric-value difference')
      .text(window.difference.toFixed(3));

    // Simplified sliding window highlight around top differences
    const tokensContainer = itemContainer
      .append('div')
      .attr('class', 'wiki-difference-tokens');
    const tokenRow = tokensContainer
      .append('div')
      .attr('class', 'wiki-difference-token-row');
    const contextSize = 5;
    const preStart = Math.max(0, window.start - contextSize);
    const postEnd = Math.min(allTokens.length, window.end + contextSize);
    // Leading ellipsis
    if (preStart > 0) {
      tokenRow
        .append('span')
        .attr('class', 'wiki-difference-ellipsis')
        .text('...');
    }
    // Pre-window tokens
    for (let i = preStart; i < window.start; i++) {
      tokenRow
        .append('span')
        .attr('class', 'wiki-difference-token')
        .text(allTokens[i]);
    }
    // Window tokens
    const windowSize = window.end - window.start;
    const maxWindowDisplay = 23;
    if (windowSize > maxWindowDisplay) {
      // Show first part of window
      for (let i = window.start; i < window.start + 1; i++) {
        tokenRow
          .append('span')
          .attr('class', 'wiki-difference-token in-window')
          .text(allTokens[i]);
      }
      // Ellipsis for middle of window
      tokenRow
        .append('span')
        .attr('class', 'wiki-difference-ellipsis')
        .text('...');
      // Show last part of window
      for (let i = window.end - 20; i < window.end; i++) {
        tokenRow
          .append('span')
          .attr('class', 'wiki-difference-token in-window')
          .text(allTokens[i]);
      }
    } else {
      for (let i = window.start; i < window.end; i++) {
        tokenRow
          .append('span')
          .attr('class', 'wiki-difference-token in-window')
          .text(allTokens[i]);
      }
    }
    // Next character
    if (window.nextCharIdx < allTokens.length) {
      tokenRow
        .append('span')
        .attr('class', 'wiki-difference-token next-char')
        .text(allTokens[window.nextCharIdx]);
    }
    // Post-window tokens
    for (let i = window.end; i < postEnd; i++) {
      if (i !== window.nextCharIdx) {
        tokenRow
          .append('span')
          .attr('class', 'wiki-difference-token')
          .text(allTokens[i]);
      }
    }
    // Trailing ellipsis
    if (postEnd < allTokens.length) {
      tokenRow
        .append('span')
        .attr('class', 'wiki-difference-ellipsis')
        .text('...');
    }
  }

  // Initial render
  renderTopWindow();
}

async function initializeVisualization(
  vizSection: d3.Selection<HTMLElement, unknown, HTMLElement, any>,
): Promise<void> {
  try {
    const data = await fetchWikiTextData();

    // Remove loading indicator
    vizSection.select('#loading-container').remove();

    // Use the fetched data
    const allTokens = data.allTokens;
    const windowData = data.windowData;

    console.log('Data loaded:', {
      totalTokens: allTokens.length,
      totalWindows: windowData.length,
      firstFewTokens: allTokens.slice(0, 10),
      firstFewWindows: windowData.slice(0, 3),
    });

    // Add top differences section
    createTopDifferencesSection(vizSection, allTokens, windowData);

    // Add separator for interactive explorer
    vizSection
      .append('hr')
      .style('margin', '2em 0')
      .style('border', 'none')
      .style('border-top', '2px solid #e9ecef');

    vizSection
      .append('h3')
      .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
      .style('font-size', '1.4em')
      .style('font-weight', '600')
      .style('color', PROJECT_COLORS.headingColor)
      .style('margin-bottom', '0.8em')
      .text('Interactive Window Explorer');

    // Define excerpts based on clusters of high-difference windows
    const excerptSize = 200;
    const excerpts: { start: number; end: number }[] = [];
    const sortedWindows = [...windowData]
      .map((w, i) => ({
        ...w,
        originalIndex: i,
        difference: Math.abs(w.logprobQ - w.logprobU),
      }))
      .sort((a, b) => b.difference - a.difference);

    const topWindows = sortedWindows.slice(0, 20); // Focus on top 20 for excerpt generation
    const usedRegions: { start: number; end: number }[] = [];

    topWindows.forEach((win) => {
      const center = win.start + Math.floor((win.end - win.start) / 2);
      const excerptStart = Math.max(0, center - Math.floor(excerptSize / 2));
      const excerptEnd = Math.min(allTokens.length, excerptStart + excerptSize);

      // Check if this excerpt overlaps significantly with existing ones
      const overlaps = usedRegions.some((region) => {
        const overlapStart = Math.max(excerptStart, region.start);
        const overlapEnd = Math.min(excerptEnd, region.end);
        const overlapSize = Math.max(0, overlapEnd - overlapStart);
        return overlapSize > excerptSize * 0.5; // More than 50% overlap
      });

      if (!overlaps) {
        excerpts.push({ start: excerptStart, end: excerptEnd });
        usedRegions.push({ start: excerptStart, end: excerptEnd });
      }
    });

    if (excerpts.length === 0 && allTokens.length > 0) {
      excerpts.push({ start: 0, end: Math.min(allTokens.length, excerptSize) });
    }

    // Filter out excerpts that have no windows
    const excerptsfinallyFiltered = excerpts.filter((excerpt) => {
      const excerptWindowCount = windowData.filter(
        (w) =>
          w.start < excerpt.end &&
          w.end > excerpt.start &&
          w.nextCharIdx >= excerpt.start &&
          w.nextCharIdx < excerpt.end,
      ).length;
      return excerptWindowCount > 0;
    });

    // Use filtered excerpts
    const finalExcerpts =
      excerptsfinallyFiltered.length > 0 ? excerptsfinallyFiltered : excerpts;

    let currentExcerpt = 0;

    console.log('Generated excerpts:', finalExcerpts.length);

    let currentWindow = 0;

    // Create excerpt switcher dropdown
    const excerptSwitcher = vizSection
      .append('div')
      .attr('class', 'wiki-excerpt-switcher');
    excerptSwitcher.append('label').text('Select Excerpt:');
    const excerptDropdown = excerptSwitcher
      .append('select')
      .attr('class', 'wiki-excerpt-dropdown');

    finalExcerpts.forEach((excerpt, idx) => {
      // Count windows in this excerpt for better labeling
      const excerptWindowCount = windowData.filter(
        (w) =>
          w.start < excerpt.end &&
          w.end > excerpt.start &&
          w.nextCharIdx >= excerpt.start &&
          w.nextCharIdx < excerpt.end,
      ).length;

      excerptDropdown
        .append('option')
        .attr('value', idx)
        .property('selected', idx === currentExcerpt)
        .text(`Excerpt ${idx + 1} (${excerptWindowCount} windows)`);
    });

    excerptDropdown.on('change', function () {
      const selectedIndex = parseInt((this as HTMLSelectElement).value);
      currentExcerpt = selectedIndex;
      currentWindow = 0;
      renderExcerpt();
    });

    const excerptContainer = vizSection
      .append('div')
      .attr('id', 'wiki-excerpt-container');

    // Function to extract excerpt and window data around current window and excerpt
    function getExcerptAroundWindow(windowIndex: number) {
      const excerptDef = finalExcerpts[currentExcerpt];
      // Filter windows that have any overlap with this excerpt (not just fully contained)
      const localWindows: {
        start: number;
        end: number;
        nextCharIdx: number;
        logprobQ: number;
        logprobU: number;
      }[] = windowData.filter(
        (w) =>
          w.start < excerptDef.end &&
          w.end > excerptDef.start &&
          w.nextCharIdx >= excerptDef.start &&
          w.nextCharIdx < excerptDef.end,
      );

      console.log('getExcerptAroundWindow:', {
        excerptDef,
        totalWindows: windowData.length,
        localWindowsCount: localWindows.length,
        windowIndex,
        sampleWindows: windowData.slice(0, 3).map((w) => ({
          start: w.start,
          end: w.end,
          nextCharIdx: w.nextCharIdx,
        })),
      });

      if (localWindows.length === 0) {
        // No windows in this excerpt. Return a default/empty state.
        const excerptTokens = allTokens.slice(excerptDef.start, excerptDef.end);
        return {
          tokens: excerptTokens,
          text: excerptTokens.join(' '),
          windowStart: -1,
          windowEnd: -1,
          nextCharIdx: -1,
          absoluteStart: excerptDef.start,
          localWindows: [] as typeof windowData,
          win: null,
        };
      }

      if (windowIndex >= localWindows.length)
        windowIndex = localWindows.length - 1;
      if (windowIndex < 0) windowIndex = 0;
      const win = localWindows[windowIndex];

      // Show all tokens in the excerpt, not just a context window around the current window
      const startIdx = excerptDef.start;
      const endIdx = excerptDef.end;

      const excerptTokens = allTokens.slice(startIdx, endIdx);
      const excerptText = excerptTokens.join(' ');

      const relativeStart = Math.max(0, win.start - startIdx);
      const relativeEnd = Math.min(excerptTokens.length, win.end - startIdx);
      const relativeNextChar = win.nextCharIdx - startIdx;

      return {
        tokens: excerptTokens,
        text: excerptText,
        windowStart: relativeStart,
        windowEnd: relativeEnd,
        nextCharIdx: relativeNextChar,
        absoluteStart: startIdx,
        localWindows,
        win,
      };
    }

    // Add a flag to prevent infinite recursion
    let isRendering = false;

    function renderExcerpt() {
      // Prevent recursive calls
      if (isRendering) {
        console.warn(
          'renderExcerpt called while already rendering, skipping to prevent stack overflow',
        );
        return;
      }
      isRendering = true;

      try {
        excerptContainer.selectAll('*').remove();

        const {
          tokens,
          text,
          windowStart,
          windowEnd,
          nextCharIdx,
          absoluteStart,
          localWindows,
          win,
        } = getExcerptAroundWindow(currentWindow);

        // Debug logging
        console.log('renderExcerpt called:', {
          currentExcerpt,
          currentWindow,
          localWindowsCount: localWindows.length,
          hasWin: !!win,
          tokens: tokens.slice(0, 5),
          windowStart,
          windowEnd,
          nextCharIdx,
        });

        // Clamp currentWindow - but only if we have windows
        if (localWindows.length > 0) {
          if (currentWindow >= localWindows.length)
            currentWindow = localWindows.length - 1;
          if (currentWindow < 0) currentWindow = 0;
        } else {
          currentWindow = 0;
        }

        if (!win) {
          // Render just the tokens if no window is available
          console.log('No window available, rendering basic tokens');
          const tokenRow = excerptContainer
            .append('div')
            .attr('class', 'wiki-token-row');
          tokens.forEach((token, i) => {
            const absoluteTokenIdx = absoluteStart + i;
            const correspondingWindowIndex = localWindows.findIndex(
              (w) => w.nextCharIdx === absoluteTokenIdx,
            );

            const tokenEl = tokenRow.append('div').attr('class', 'wiki-token');
            if (correspondingWindowIndex !== -1) {
              tokenEl.classed('clickable', true);
              tokenEl.on('click', () => {
                currentWindow = correspondingWindowIndex;
                renderExcerpt();
              });
            }

            tokenEl.append('div').attr('class', 'wiki-token-text').text(token);
            tokenEl
              .append('div')
              .attr('class', 'wiki-token-index')
              .text(absoluteStart + i);
          });
          // Hide controls if no windows
          d3.select('.wiki-controls-row').style('display', 'none');
          return;
        }

        console.log('Rendering with window:', win);
        d3.select('.wiki-controls-row').style('display', 'flex');

        // Calculate max difference for color scaling across all windows
        // Remove spread-based Math.max/Math.min to avoid call stack issues on large arrays
        let maxDiff = -Infinity;
        let minDiff = Infinity;
        for (const w of windowData) {
          const d = Math.abs(w.logprobQ - w.logprobU);
          if (d > maxDiff) maxDiff = d;
          if (d < minDiff) minDiff = d;
        }

        // Function to get color intensity based on difference
        function getColorForDiff(tokenIndex: number): string {
          // Find if this absolute token index is a next character in any window
          const absoluteTokenIdx = absoluteStart + tokenIndex;
          const tokenWindow = windowData.find(
            (w) => w.nextCharIdx === absoluteTokenIdx,
          );
          if (!tokenWindow) return 'transparent'; // No window has this token as next char

          const diff = Math.abs(tokenWindow.logprobQ - tokenWindow.logprobU);
          if (maxDiff === minDiff) return 'transparent'; // All differences are the same

          // Normalize difference to 0-1 scale
          const normalizedDiff = (diff - minDiff) / (maxDiff - minDiff);

          // Create red color with alpha based on normalized difference
          const alpha = normalizedDiff * 0.7; // Max 70% opacity
          return `rgba(220, 53, 69, ${alpha})`;
        }

        // Logprob details above tokens
        // Compute probabilities from log-probs and their absolute difference
        const pQ = Math.exp(win.logprobQ);
        const pU = Math.exp(win.logprobU);
        const diff = Math.abs(pQ - pU);
        const logprobDetails = excerptContainer
          .append('div')
          .attr('class', 'wiki-logprob-details');

        logprobDetails
          .append('div')
          .attr('class', 'section-title')
          .text('Next Character Log Probability Comparison');

        logprobDetails
          .append('div')
          .attr('class', 'section-description')
          .text(
            'This section shows the predicted log-probabilities for the next character in the sequence, as computed by both the quantized and unquantized models. The difference quantifies the impact of quantization on model confidence.',
          );

        const metricsGrid = logprobDetails
          .append('div')
          .attr('class', 'metrics-grid');

        // Quantized probability metric
        const quantizedMetric = metricsGrid
          .append('div')
          .attr('class', 'metric-item');
        quantizedMetric
          .append('div')
          .attr('class', 'metric-label')
          .text('Quantized Prob.');
        quantizedMetric
          .append('div')
          .attr('class', 'metric-value')
          .text(pQ.toFixed(3));

        // Unquantized probability metric
        const unquantizedMetric = metricsGrid
          .append('div')
          .attr('class', 'metric-item');
        unquantizedMetric
          .append('div')
          .attr('class', 'metric-label')
          .text('Unquantized Prob.');
        unquantizedMetric
          .append('div')
          .attr('class', 'metric-value')
          .text(pU.toFixed(3));

        // Absolute probability difference metric
        const differenceMetric = metricsGrid
          .append('div')
          .attr('class', 'metric-item difference');
        differenceMetric
          .append('div')
          .attr('class', 'metric-label')
          .text('Abs Prob Diff');
        differenceMetric
          .append('div')
          .attr('class', 'metric-value')
          .text(diff.toFixed(3));

        const tokenRow = excerptContainer
          .append('div')
          .attr('class', 'wiki-token-row');
        tokens.forEach((token, i) => {
          const absoluteTokenIdx = absoluteStart + i;
          const correspondingWindowIndex = localWindows.findIndex(
            (w) => w.nextCharIdx === absoluteTokenIdx,
          );

          const tokenEl = tokenRow
            .append('div')
            .attr('class', 'wiki-token')
            .classed('in-window', i >= windowStart && i < windowEnd)
            .classed('next-char', i === nextCharIdx);

          if (correspondingWindowIndex !== -1) {
            tokenEl.classed('clickable', true);
            tokenEl.on('click', () => {
              currentWindow = correspondingWindowIndex;
              renderExcerpt();
            });
          }

          const tokenText = tokenEl
            .append('div')
            .attr('class', 'wiki-token-text')
            .text(token);

          // Apply background color highlighting for quantization differences
          // But don't override the CSS styling for in-window or next-char tokens
          if (!(i >= windowStart && i < windowEnd) && i !== nextCharIdx) {
            tokenText.style('background-color', getColorForDiff(i));
          }

          tokenEl
            .append('div')
            .attr('class', 'wiki-token-index')
            .text(absoluteStart + i);
        });

        // Controls row with just window controls (no excerpt switcher needed)
        const controlsRow = excerptContainer
          .append('div')
          .attr('class', 'wiki-controls-row');

        // Window controls
        const controls = controlsRow
          .append('div')
          .attr('class', 'wiki-window-controls');
        controls
          .append('button')
          .attr('class', 'wiki-window-arrow')
          .attr('disabled', currentWindow === 0 ? true : null)
          .text('←')
          .on('click', () => {
            if (currentWindow > 0) {
              currentWindow--;
              renderExcerpt();
            }
          });
        controls
          .append('span')
          .attr('class', 'wiki-window-info')
          .text(`Window ${currentWindow + 1} of ${localWindows.length}`);
        controls
          .append('button')
          .attr('class', 'wiki-window-arrow')
          .attr(
            'disabled',
            currentWindow === localWindows.length - 1 ? true : null,
          )
          .text('→')
          .on('click', () => {
            if (currentWindow < localWindows.length - 1) {
              currentWindow++;
              renderExcerpt();
            }
          });

        // Legend
        const legend = controlsRow
          .append('div')
          .attr('class', 'wiki-window-legend');
        const windowLegend = legend
          .append('div')
          .attr('class', 'wiki-legend-item');
        windowLegend.append('div').attr('class', 'wiki-legend-box window');
        windowLegend.append('span').text('Current Window');
        const nextCharLegend = legend
          .append('div')
          .attr('class', 'wiki-legend-item');
        nextCharLegend.append('div').attr('class', 'wiki-legend-box next-char');
        nextCharLegend.append('span').text('Next Character');
      } finally {
        isRendering = false;
      }
    }

    // Initialize with first excerpt
    renderExcerpt();
  } catch (error) {
    console.error('Failed to load wiki text data:', error);
    vizSection
      .select('#loading-container')
      .select('p')
      .text('Failed to load data. Please check the console for details.')
      .style('color', 'red');
  }
}
