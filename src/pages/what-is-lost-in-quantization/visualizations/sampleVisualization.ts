import * as d3 from 'd3';
import { PROJECT_COLORS } from '../config';

function applyVisualizationStyles(): void {
  const existingStyle = document.getElementById('sample-viz-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = 'sample-viz-styles';
  style.textContent = `
    #sample-d3-visualization-section {
      margin-top: 2em;
      margin-bottom: 3em;
      padding-top: 1em;
    }

    #sample-d3-visualization-section h2#sample-d3-title {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.6em;
      font-weight: 600;
      color: ${PROJECT_COLORS.headingColor};
      margin-top: 0;
      margin-bottom: 0.5em;
      line-height: 1.3;
    }

    #sample-d3-visualization-section p#sample-d3-intro {
      font-family: Georgia, serif;
      font-size: 1em;
      line-height: 1.7;
      color: ${PROJECT_COLORS.textColor};
      margin-bottom: 1.5em;
    }

    #sample-d3-svg-wrapper {
      border: 1px solid ${PROJECT_COLORS.textColor}20;
      border-radius: 4px;
      overflow: hidden;
      max-width: 100%;
    }

    #sample-d3-svg-wrapper svg {
      display: block;
      width: 100%;
    }
  `;
  document.head.appendChild(style);
}

export function initSampleVisualization(): void {
  applyVisualizationStyles();

  const mainD3Selection = d3.select<HTMLElement, unknown>('main');
  if (mainD3Selection.empty()) {
    console.error('Main element not found for D3 sample visualization.');
    return;
  }

  const oldPlaceholderId = 'sample-visualization-container';
  const vizSectionId = 'sample-d3-visualization-section';
  const titleId = 'sample-d3-title';
  const introTextId = 'sample-d3-intro';
  const svgWrapperId = 'sample-d3-svg-wrapper';

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
    .text('Sample D3 Visualization');

  vizSection
    .append<HTMLParagraphElement>('p')
    .attr('id', introTextId)
    .html(
      'This is a placeholder for introductory text. You can explain what the visualization shows here. <em>HTML is allowed.</em>',
    );

  const svgWrapper: d3.Selection<
    HTMLDivElement,
    unknown,
    HTMLElement,
    unknown
  > = vizSection.append<HTMLDivElement>('div').attr('id', svgWrapperId);

  const designWidth = 400;
  const designHeight = 200;

  const svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, unknown> =
    svgWrapper
      .append<SVGSVGElement>('svg')
      .attr('viewBox', `0 0 ${designWidth} ${designHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet')
      .style('display', 'block')
      .style('width', '100%')
      .style('height', '100%');

  svg
    .append<SVGCircleElement>('circle')
    .attr('cx', designWidth * 0.25)
    .attr('cy', designHeight * 0.5)
    .attr('r', designHeight * 0.2)
    .style('fill', PROJECT_COLORS.primaryVizColor);

  console.log('Sample D3 Visualization Initialized');
}
