import * as d3 from 'd3';
import { PROJECT_COLORS } from '../config';

export function initSummary() {
  const main = document.querySelector('main');
  if (!main) {
    console.error('Main element not found');
    return;
  }

  const summarySection = d3
    .select(main)
    .append('article')
    .attr('id', 'summary')
    .style('margin-top', '2em')
    .style('margin-bottom', '3em');

  summarySection
    .append('h2')
    .text('Summary')
    .style('font-family', 'Consolas, Monaco, "Courier New", monospace')
    .style('font-size', '1.6em')
    .style('font-weight', '600')
    .style('color', PROJECT_COLORS.headingColor)
    .style('margin-bottom', '0.5em');

  const summaryContent = summarySection
    .append('div')
    .style('font-family', 'Georgia, serif')
    .style('font-size', '1em')
    .style('line-height', '1.7')
    .style('color', PROJECT_COLORS.textColor);

  const summaryText = `
        <p>While we definitely did not fully characterize what the impact of quantization for LLMs is generally, we have:</p>
        <ol style="margin-left: 2em;">
            <li>Observed some interesting artifacts in outputs, similar to the noise of quantized audio or images with small color spaces.</li>
            <li>Gained a better understanding of the machinery which underlies state-of-the-art techniques for making models smaller.</li>
        </ol>
    `;
  summaryContent.html(summaryText);

  summaryContent
    .append('p')
    .html(
      'Have any thoughts or questions? Feel free to email me at <a href="mailto:michaelgiba@gmail.com" style="color: ${PROJECT_COLORS.primaryVizColor};">michaelgiba@gmail.com</a>.',
    )
    .style('margin-top', '20px')
    .style('font-style', 'italic');
}
