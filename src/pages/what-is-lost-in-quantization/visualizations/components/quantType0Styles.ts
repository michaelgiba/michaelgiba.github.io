// Handles injecting/removing styles for the quantType0Interactive visualization
import { PROJECT_COLORS } from '../../config';

export function applyVisualizationStyles(): void {
  const existingStyle = document.getElementById('quant-type-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = 'quant-type-styles';
  style.textContent = `
    /* General styles */
    #quant-type-section {
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
      background-color: #f4f4f9;
      border-radius: 8px;
    }

    .quant-explanation {
      margin-bottom: 20px;
      font-family: 'Georgia', serif;
      line-height: 1.6;
      color: #333;
    }

    .quant-explanation p, .quant-explanation ul {
      margin-bottom: 15px;
    }

    .quant-explanation code {
      font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
      background-color: #e8e8e8;
      padding: 2px 5px;
      border-radius: 4px;
      font-size: 0.9em;
    }

    .quant-type-cards {
      display: flex;
      gap: 20px;
      justify-content: space-between;
      margin-top: 20px;
      flex-wrap: wrap;
    }

    .quant-card {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 20px;
      flex: 1;
      min-width: 280px;
      background-color: #ffffff;
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
      transition: transform 0.2s, box-shadow 0.2s;
    }

    .quant-card:hover {
      transform: translateY(-5px);
      box-shadow: 0 4px 10px rgba(0,0,0,0.15);
    }

    .quant-card h4 {
      margin-top: 0;
      color: ${PROJECT_COLORS.primaryVizColor};
      font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
      border-bottom: 2px solid ${PROJECT_COLORS.secondaryVizColor};
      padding-bottom: 10px;
      margin-bottom: 15px;
    }

    .quant-card ul {
      padding-left: 20px;
      margin-bottom: 0;
      list-style-type: '» ';
    }

    .quant-card li {
      margin-bottom: 10px;
    }

    .quant-callout-container {
      max-width: 1200px;
      margin: 20px auto;
      padding: 0 20px;
    }

    .quant-callout {
      background-color: #fffbe6; /* Yellow background */
      border-left: 5px solid #ffc107; /* Amber border */
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }

    .quant-callout p {
      margin: 0 0 10px 0;
    }

    .quant-callout blockquote {
      border-left: 3px solid #ccc;
      padding-left: 15px;
      margin-left: 0;
      font-style: italic;
      color: #555;
    }

    .quant-callout a {
      color: ${PROJECT_COLORS.linkColor};
      text-decoration: none;
      font-weight: bold;
    }

    .quant-callout a:hover {
      text-decoration: underline;
    }

    /* SVG and Controls */
    #quant-type-svg-wrapper {
      position: relative; 
      border: 1px solid ${PROJECT_COLORS.textColor}20;
      border-radius: 4px;
      overflow: hidden;
      max-width: 100%;
    }

    #quant-type-svg-wrapper svg {
      display: block;
      width: 100%;
    }

    .matrix-cell {
      stroke: #ccc;
      stroke-width: 1px;
      cursor: pointer; 
    }
    
    .scale-legend-text {
        cursor: pointer; 
    }

    .matrix-text {
      font-family: monospace;
      font-size: 8px; 
      text-anchor: middle;
      dominant-baseline: central;
      pointer-events: none;
      /* Ensure text stays within cell bounds */
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* Responsive text sizing for smaller screens */
    @media (max-width: 768px) {
      .matrix-text {
        font-size: 7px;
      }
      
      .number-line-text {
        font-size: 9px;
      }
      
      .scale-legend-text {
        font-size: 9px;
      }
      
      .error-bar-text {
        font-size: 8px;
      }
    }

    .highlight-anim {
      animation: blinkAnimation 1500ms ease-in-out; 
    }

    /* Number line text styling */
    .number-line-text {
      font-family: monospace;
      font-size: 10px;
      text-anchor: middle;
      fill: #333;
      font-weight: 500;
    }

    /* Scale legend text styling */
    .scale-legend-text {
      cursor: pointer;
      font-family: monospace;
      font-size: 10px;
      fill: #333;
    }

    .scale-legend-text:hover {
      fill: #000;
      font-weight: bold;
    }

    /* Error bar text styling */
    .error-bar-text {
      font-family: monospace;
      font-size: 9px;
      text-anchor: middle;
      fill: #333;
    }

    .audio-start-button {
      padding: 10px 20px;
      font-size: 16px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f0f0f0;
      display: block;
      margin: 20px auto;
    }
    
    .quant-tooltip {
      position: absolute;
      background: rgba(0, 0, 0, 0.9);
      color: white;
      padding: 8px 12px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 11px;
      line-height: 1.4;
      pointer-events: none;
      z-index: 1000;
      white-space: nowrap;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }

    .quant-tooltip .formula {
      color: #87CEEB;
      font-weight: bold;
    }

    .quant-tooltip .values {
      color: #98FB98;
      margin-top: 4px;
    }

    @keyframes blinkAnimation {
      0%, 100% { 
        opacity: 1;
        
      }
      10%, 60% { 
        opacity: 1;
        fill: #00FF00 !important;  
        stroke: #333333 !important; 
        stroke-width: 1.5px;
      }
    }

    /* Very compact slider styling */
    input[type="range"] {
      -webkit-appearance: none;
      appearance: none;
      height: 3px;
      background: #ddd;
      border-radius: 2px;
      outline: none;
    }

    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance: none;
      appearance: none;
      width: 10px;
      height: 10px;
      background: #007bff;
      border-radius: 50%;
      cursor: pointer;
      transition: background 0.2s ease;
    }

    input[type="range"]::-webkit-slider-thumb:hover {
      background: #0056b3;
      transform: scale(1.2);
    }

    input[type="range"]::-moz-range-thumb {
      width: 10px;
      height: 10px;
      background: #007bff;
      border-radius: 50%;
      cursor: pointer;
      border: none;
      transition: background 0.2s ease;
    }

    input[type="range"]::-moz-range-thumb:hover {
      background: #0056b3;
      transform: scale(1.2);
    }
  `;
  document.head.appendChild(style);
}
