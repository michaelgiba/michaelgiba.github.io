import * as d3 from 'd3';
import { PROJECT_COLORS } from '../config';

// (existing styles remain the same)
function applyQuantizationErrorStyles(): void {
  const existingStyle = document.getElementById('quantization-error-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  const style = document.createElement('style');
  style.id = 'quantization-error-styles';
  style.textContent = `
    #quantization-error-section {
      margin-top: 0;
      margin-bottom: 1em;
      padding-top: 0;
    }

    #quantization-error-section h2 {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.4em;
      font-weight: 600;
      color: ${PROJECT_COLORS.headingColor};
      margin-top: 0;
      margin-bottom: 0.2em;
      line-height: 1.2;
      text-align: left;
    }

    #quantization-error-section h3 {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 1.1em;
      font-weight: 500;
      color: ${PROJECT_COLORS.headingColor};
      margin-top: 0.6em;
      margin-bottom: 0.3em;
    }

    #quantization-error-section > p {
      font-family: Georgia, serif;
      font-size: 0.95em;
      line-height: 1.4;
      color: ${PROJECT_COLORS.textColor};
      margin-bottom: 0.5em;
      text-align: left;
    }

    .quantization-row {
      display: grid;
      grid-template-columns: 1fr;
      gap: 1em;
      margin-top: 1.5em;
      margin-bottom: 1.5em;
      padding: 1em;
      border: 1px solid #e0e0e0;
      border-radius: 8px;
    }

    @media (min-width: 768px) {
      .quantization-row {
        grid-template-columns: 1fr 1fr;
      }
    }

    .quantization-column {
      display: flex;
      flex-direction: column;
    }

    .quant-controls {
      display: flex;
      justify-content: center;
      gap: 0.5em;
      margin-bottom: 0.5em;
    }

    .quant-controls label {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 0.8em;
      padding: 0.3em 0.6em;
      border: 1px solid #ccc;
      border-radius: 4px;
      cursor: pointer;
      transition: background-color 0.2s, color 0.2s;
    }

    .quant-controls input[type="radio"] {
      display: none;
    }

    .quant-controls input[type="radio"]:checked + label {
      background-color: ${PROJECT_COLORS.primaryVizColor};
      color: white;
      border-color: ${PROJECT_COLORS.primaryVizColor};
    }

    .quant-display-area {
      text-align: center;
    }

    .waveform-container, .image-container {
      margin-bottom: 0.3em;
    }

    .waveform-container h4, .image-container h4 {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 0.85em;
      color: ${PROJECT_COLORS.primaryVizColor};
      margin-bottom: 0.15em;
      font-weight: 600;
    }

    .bitrate-label {
      font-family: Consolas, Monaco, 'Courier New', monospace;
      font-size: 0.75em;
      color: ${PROJECT_COLORS.subtleTextColor};
      margin-bottom: 0.2em;
    }

    .waveform-canvas, .image-canvas {
      max-width: 100%;
      width: 100%;
      height: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
    }

    .audio-player-control {
      max-width: 100%;
      height: 30px;
      width: 100%;
    }

    .audio-start-button {
      padding: 8px 16px;
      font-size: 14px;
      cursor: pointer;
      border: 1px solid #ccc;
      border-radius: 4px;
      background-color: #f0f0f0;
      display: block;
      margin: 10px auto;
    }

  `;
  document.head.appendChild(style);
}

/**
 * Renders a simple audio waveform onto a canvas.
 */
function renderWaveform(canvas: HTMLCanvasElement, audioBuffer: AudioBuffer) {
  const canvasCtx = canvas.getContext('2d');
  if (!canvasCtx) return;

  const width = canvas.width;
  const height = canvas.height;
  canvasCtx.clearRect(0, 0, width, height);

  const data = audioBuffer.getChannelData(0);
  const amp = height / 2;

  // To better visualize quantization, we'll zoom in on a small slice of the waveform.
  const sliceLength = 500; // Number of samples to display
  const start = Math.floor(data.length / 3); // Start at a third of the way through
  const zoomedData = data.slice(start, start + sliceLength);

  canvasCtx.lineWidth = 1.5;
  canvasCtx.strokeStyle = PROJECT_COLORS.primaryVizColor;
  canvasCtx.beginPath();

  const stepX = width / sliceLength;

  for (let i = 0; i < zoomedData.length; i++) {
    const x = i * stepX;
    const y = amp - zoomedData[i] * amp;

    if (i > 0) {
      const prevX = (i - 1) * stepX;
      const prevY = amp - zoomedData[i - 1] * amp;
      // Draw a horizontal line for the previous sample's value, creating a stepped look
      canvasCtx.lineTo(x, prevY);
    }
    // Draw a vertical line to the new sample value
    canvasCtx.lineTo(x, y);
  }
  canvasCtx.stroke();
}

/**
 * Fetches an audio file and decodes it into an AudioBuffer.
 */
async function fetchAudioBuffer(
  audioUrl: string,
  audioContext: AudioContext,
): Promise<AudioBuffer> {
  const response = await fetch(audioUrl);
  const arrayBuffer = await response.arrayBuffer();
  return audioContext.decodeAudioData(arrayBuffer);
}

/**
 * Calculates the difference (error) between two audio buffers.
 */
function calculateError(
  originalBuffer: AudioBuffer,
  quantizedBuffer: AudioBuffer,
): Float32Array {
  const originalData = originalBuffer.getChannelData(0);
  const quantizedData = quantizedBuffer.getChannelData(0);
  const minLength = Math.min(originalData.length, quantizedData.length);
  const errorData = new Float32Array(minLength);

  for (let i = 0; i < minLength; i++) {
    errorData[i] = originalData[i] - quantizedData[i];
  }

  return errorData;
}

/**
 * Renders a slice of waveform data onto a canvas.
 */
function renderWaveformSlice(
  canvas: HTMLCanvasElement,
  data: Float32Array,
  playbackTime: number,
  sampleRate: number,
) {
  const canvasCtx = canvas.getContext('2d');
  if (!canvasCtx) return;

  const width = canvas.width;
  const height = canvas.height;
  const amp = height / 2;

  canvasCtx.clearRect(0, 0, width, height);
  canvasCtx.lineWidth = 1.5;
  canvasCtx.strokeStyle = PROJECT_COLORS.primaryVizColor;
  canvasCtx.beginPath();

  const samplesToDisplay = 2000; // Zoom in to see the details
  const startIndex = Math.floor(playbackTime * sampleRate);

  const stepX = width / samplesToDisplay;

  for (let i = 0; i < samplesToDisplay; i++) {
    const sampleIndex = startIndex + i;
    if (sampleIndex >= data.length) break;

    const x = i * stepX;
    const y = amp - data[sampleIndex] * amp;

    if (i === 0) {
      canvasCtx.moveTo(x, y);
    } else {
      canvasCtx.lineTo(x, y);
    }
  }
  canvasCtx.stroke();
}

async function createAudioQuantizationRow(
  section: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
  audioContext: AudioContext,
): Promise<d3.Selection<HTMLDivElement, unknown, HTMLElement, any>> {
  const audioColumn = section
    .append('div')
    .attr('class', 'quantization-column');

  audioColumn.append('h3').text('Audio Quantization');
  audioColumn
    .append('p')
    .html(
      'WAV files can store sound at different <a href="https://en.wikipedia.org/wiki/Audio_bit_depth#:~:text=The%20resolution%20indicates%20the%20number,%2Dtwo%20floating%2Dpoint%20formats." target="_blank">"bit depths" </a> which quantizes the input sound signal. This introduces noise. ' +
      'The quantization "error" is the difference of this signal from the original. ' +
      'Select a bit depth to see and hear the effect on this <b>AI-generated song about quantization.</b>',
    );

  const audioQualities = [
    { bitDepth: '16-bit', quality: 'Original' },
    { bitDepth: '8-bit', quality: '8-bit' },
    { bitDepth: '4-bit', quality: '4-bit' },
  ];

  const controls = audioColumn.append('div').attr('class', 'quant-controls');
  audioQualities.forEach((audio, index) => {
    controls
      .append('input')
      .attr('type', 'radio')
      .attr('name', 'audio-quant-level')
      .attr('id', `audio-quant-${audio.bitDepth}`)
      .attr('value', audio.bitDepth)
      .property('checked', index === 0);
    controls
      .append('label')
      .attr('for', `audio-quant-${audio.bitDepth}`)
      .text(audio.quality);
  });

  const displayArea = audioColumn
    .append('div')
    .attr('class', 'quant-display-area');

  // Waveform display
  const waveformContainer = displayArea
    .append('div')
    .attr('class', 'waveform-container');
  waveformContainer.append('h4').text('Quantized Waveform');
  const waveformCanvas = waveformContainer
    .append('canvas')
    .attr('class', 'waveform-canvas')
    .attr('width', 250)
    .attr('height', 70)
    .node() as HTMLCanvasElement;

  // Error display
  const errorContainer = displayArea
    .append('div')
    .attr('class', 'waveform-container');
  errorContainer.append('h4').text('Quantization Error');
  const errorCanvas = errorContainer
    .append('canvas')
    .attr('class', 'waveform-canvas')
    .attr('width', 250)
    .attr('height', 70)
    .node() as HTMLCanvasElement;

  const audioPlayer = audioColumn
    .append('audio')
    .attr('class', 'audio-player-control')
    .attr('controls', true)
    .node() as HTMLAudioElement;

  try {
    const [buffer16, buffer8, buffer4] = await Promise.all([
      fetchAudioBuffer(`./assets/audio/sample_audio_16bit.wav`, audioContext),
      fetchAudioBuffer(`./assets/audio/sample_audio_8bit.wav`, audioContext),
      fetchAudioBuffer(`./assets/audio/sample_audio_4bit.wav`, audioContext),
    ]);

    const error8Data = calculateError(buffer16, buffer8);
    const error4Data = calculateError(buffer16, buffer4);

    const error8Buffer = audioContext.createBuffer(
      1,
      error8Data.length,
      buffer16.sampleRate,
    );
    error8Buffer.copyToChannel(error8Data as any, 0);

    const error4Buffer = audioContext.createBuffer(
      1,
      error4Data.length,
      buffer16.sampleRate,
    );
    error4Buffer.copyToChannel(error4Data as any, 0);

    type AudioDataKey = '16-bit' | '8-bit' | '4-bit';
    type ErrorDataKey = '8-bit-error' | '4-bit-error';

    const audioBuffers: { [key in AudioDataKey]: AudioBuffer } = {
      '16-bit': buffer16,
      '8-bit': buffer8,
      '4-bit': buffer4,
    };

    const errorBuffers: { [key in ErrorDataKey]: AudioBuffer } = {
      '8-bit-error': error8Buffer,
      '4-bit-error': error4Buffer,
    };

    const audioData: { [key in AudioDataKey]: Float32Array } = {
      '16-bit': buffer16.getChannelData(0),
      '8-bit': buffer8.getChannelData(0),
      '4-bit': buffer4.getChannelData(0),
    };

    const errorData: { [key: string]: Float32Array } = {
      '16-bit': new Float32Array(buffer16.length).fill(0),
      '8-bit': error8Data,
      '4-bit': error4Data,
    };

    let animationFrameId: number;

    const draw = () => {
      const selectedBitDepth = (
        controls.select('input:checked').node() as HTMLInputElement
      ).value as AudioDataKey;
      const playbackTime = audioPlayer.currentTime;
      const sampleRate = buffer16.sampleRate;

      renderWaveformSlice(
        waveformCanvas,
        audioData[selectedBitDepth],
        playbackTime,
        sampleRate,
      );
      renderWaveformSlice(
        errorCanvas,
        errorData[selectedBitDepth],
        playbackTime,
        sampleRate,
      );

      if (!audioPlayer.paused) {
        animationFrameId = requestAnimationFrame(draw);
      }
    };

    const updateAudioSource = () => {
      const selectedBitDepth = (
        controls.select('input:checked').node() as HTMLInputElement
      ).value as AudioDataKey;
      const wasPlaying = !audioPlayer.paused;
      const currentTime = audioPlayer.currentTime;

      const buffer = audioBuffers[selectedBitDepth];
      const objectURL = URL.createObjectURL(
        new Blob([bufferToWave(buffer)], { type: 'audio/wav' }),
      );
      audioPlayer.src = objectURL;
      audioPlayer.currentTime = currentTime;

      if (wasPlaying) {
        audioPlayer.play();
      }
      draw();
    };

    audioPlayer.onplay = () => {
      if (audioContext.state === 'suspended') {
        audioContext.resume();
      }
      draw();
    };
    audioPlayer.onpause = () => cancelAnimationFrame(animationFrameId);
    audioPlayer.onseeked = () => draw();

    controls.selectAll('input').on('change', updateAudioSource);

    updateAudioSource(); // Initial setup
  } catch (err) {
    console.error('Error loading or processing audio data:', err);
    audioColumn
      .append('p')
      .style('color', 'red')
      .text('Failed to load audio resources. See console for details.');
  }
  return audioColumn;
}

// Helper to convert AudioBuffer to a WAV file blob, needed for dynamic src changes
function bufferToWave(abuffer: AudioBuffer): ArrayBuffer {
  const numOfChan = abuffer.numberOfChannels;
  const length = abuffer.length * numOfChan * 2 + 44;
  const buffer = new ArrayBuffer(length);
  const view = new DataView(buffer);
  const channels = [];
  let i, sample;
  let offset = 0;
  let pos = 0;

  // write WAVE header
  setUint32(0x46464952); // "RIFF"
  setUint32(length - 8); // file length - 8
  setUint32(0x45564157); // "WAVE"

  setUint32(0x20746d66); // "fmt " chunk
  setUint32(16); // length = 16
  setUint16(1); // PCM (uncompressed)
  setUint16(numOfChan);
  setUint32(abuffer.sampleRate);
  setUint32(abuffer.sampleRate * 2 * numOfChan); // avg. bytes/sec
  setUint16(numOfChan * 2); // block-align
  setUint16(16); // 16-bit

  setUint32(0x61746164); // "data" - chunk
  setUint32(length - pos - 4); // chunk length

  // write interleaved data
  for (i = 0; i < abuffer.numberOfChannels; i++)
    channels.push(abuffer.getChannelData(i));

  while (pos < length) {
    for (i = 0; i < numOfChan; i++) {
      // interleave channels
      sample = Math.max(-1, Math.min(1, channels[i][offset])); // clamp
      sample = (0.5 + sample < 0 ? sample * 32768 : sample * 32767) | 0; // scale to 16-bit signed int
      view.setInt16(pos, sample, true); // write 16-bit sample
      pos += 2;
    }
    offset++; // next source sample
  }

  function setUint16(data: number) {
    view.setUint16(pos, data, true);
    pos += 2;
  }

  function setUint32(data: number) {
    view.setUint32(pos, data, true);
    pos += 4;
  }

  return buffer;
}

function createImageQuantizationRow(
  section: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>,
): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
  const imageColumn = section
    .append('div')
    .attr('class', 'quantization-column');

  imageColumn.append('h3').text('Image Color Quantization');

  imageColumn
    .append('p')
    .html(
      'You may have heard of <a href="https://en.wikipedia.org/wiki/8-bit_color" target="_blank">8-bit color</a> palettes from old Atari video games. ' +
      'If you want to display a high-resolution image in 8-bit color, you will need to quantize colors to one of 256 possible values. ' +
      'At even smaller levels, you can see the error as sharp artifacts in the original image. ',
    );

  const imageBits = [
    { bits: 8, label: '8-bit' },
    { bits: 4, label: '4-bit' },
    { bits: 2, label: '2-bit' },
  ];

  const controls = imageColumn.append('div').attr('class', 'quant-controls');
  imageBits.forEach((img, index) => {
    controls
      .append('input')
      .attr('type', 'radio')
      .attr('name', 'image-quant-level')
      .attr('id', `image-quant-${img.bits}`)
      .attr('value', img.bits)
      .property('checked', index === 0);
    controls
      .append('label')
      .attr('for', `image-quant-${img.bits}`)
      .text(img.label);
  });

  const displayArea = imageColumn
    .append('div')
    .attr('class', 'quant-display-area');
  const canvas = displayArea
    .append('canvas')
    .attr('class', 'image-canvas')
    .attr('width', 250)
    .attr('height', 250);

  const canvasNode = canvas.node() as HTMLCanvasElement;

  function drawImage(bits: number) {
    if (!canvasNode) return;
    const ctx = canvasNode.getContext('2d');
    if (!ctx) return;

    const imageData = generateImageData(bits);
    const cellSize = Math.floor(canvasNode.width / imageData[0].length);
    ctx.clearRect(0, 0, canvasNode.width, canvasNode.height);

    imageData.forEach((row, y) => {
      row.forEach((value, x) => {
        ctx.fillStyle = `rgb(${value}, ${value}, ${value})`;
        ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
      });
    });
  }

  controls.selectAll('input').on('change', function () {
    const selectedBits = parseInt((this as HTMLInputElement).value, 10);
    drawImage(selectedBits);
  });

  // Initial draw
  const initialBits = parseInt(
    (controls.select('input:checked').node() as HTMLInputElement).value,
    10,
  );
  drawImage(initialBits);

  return imageColumn;
}

function generateImageData(bits: number): number[][] {
  const size = 50; // Increased size for a better gradient
  const levels = Math.pow(2, bits);
  const step = 255 / (levels - 1);

  const data: number[][] = [];
  for (let y = 0; y < size; y++) {
    const row: number[] = [];
    for (let x = 0; x < size; x++) {
      // Create a gradient pattern
      const value = Math.floor(((x + y) / (size * 2)) * 255);
      const quantized = Math.round(value / step) * step;
      row.push(Math.min(255, Math.max(0, quantized)));
    }
    data.push(row);
  }

  return data;
}

export function initQuantizationErrorIntro(): void {
  applyQuantizationErrorStyles();

  const mainSelection = d3.select<HTMLElement, unknown>('main');
  if (mainSelection.empty()) {
    console.error(
      'Main element not found for quantization error visualization.',
    );
    return;
  }

  const sectionId = 'quantization-error-section';

  let existingSection = d3.select<HTMLElement, unknown>(`#${sectionId}`);
  if (!existingSection.empty()) {
    existingSection.remove();
  }

  const section = mainSelection
    .append<HTMLElement>('section')
    .attr('id', sectionId);

  section.append<HTMLHeadingElement>('h2').text('Quantization Error');

  section
    .append<HTMLParagraphElement>('p')
    .html(
      `Since the source datatype is higher resolution than the target datatype, obviously some information will be lost in the process. This is called <em>quantization error</em>. Explore the effects on audio and images below.`,
    );

  const audioContext = new (window.AudioContext ||
    (window as any).webkitAudioContext)();

  const contentRow = section.append('div').attr('class', 'quantization-row');

  createAudioQuantizationRow(contentRow, audioContext);
  createImageQuantizationRow(contentRow);

}
