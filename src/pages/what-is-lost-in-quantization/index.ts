import './style.css';
import { initGeneralQuantizationIntro } from './visualizations/generalQuantizationIntro';
import { initQuantizationErrorIntro } from './visualizations/quantizationErrorIntro';
import { quantTypeInteractive } from './visualizations/quantTypeInteractive';
import { initWikiLogprobComparison } from './visualizations/wikiLogprobComparison';
import { initSummary } from './visualizations/summary';

document.addEventListener('DOMContentLoaded', () => {
  requestAnimationFrame(() => {
    document.body.classList.add('loaded');
  });
  initGeneralQuantizationIntro();
  initQuantizationErrorIntro();
  quantTypeInteractive();
  initWikiLogprobComparison();
  initSummary();
});
