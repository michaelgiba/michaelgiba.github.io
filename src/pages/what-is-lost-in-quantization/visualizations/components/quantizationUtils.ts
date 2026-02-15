// Utility functions for quantization logic

export function quantizeBlockSymmetric(
  block: number[][],
  bits: number = 8,
): { quantized: number[][]; scale: number } {
  const flatBlock = block.flat();
  const maxAbs = Math.max(...flatBlock.map((v) => Math.abs(v)));

  const maxQuantValue = Math.pow(2, bits - 1) - 1;
  const scale = maxAbs === 0 ? 1.0 : maxAbs / maxQuantValue;

  const quantized: number[][] = [];
  for (let i = 0; i < block.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < block[i].length; j++) {
      const quantizedValue = Math.round(block[i][j] / scale);
      const clampedValue = Math.max(
        -maxQuantValue - 1,
        Math.min(maxQuantValue, quantizedValue),
      );
      row.push(clampedValue);
    }
    quantized.push(row);
  }

  return { quantized, scale };
}

export function quantizeBlockAsymmetric(
  block: number[][],
  bits: number = 8,
): { quantized: number[][]; scale: number; zeroPoint: number } {
  const flatBlock = block.flat();
  const minVal = Math.min(...flatBlock);
  const maxVal = Math.max(...flatBlock);
  const quantMin = 0;
  const quantMax = Math.pow(2, bits) - 1;
  // Avoid division by zero
  const scale =
    maxVal - minVal === 0 ? 1.0 : (maxVal - minVal) / (quantMax - quantMin);
  // Calculate zero point so that minVal maps to quantMin
  let zeroPoint = Math.round(quantMin - minVal / scale);
  zeroPoint = Math.max(quantMin, Math.min(quantMax, zeroPoint));

  const quantized: number[][] = [];
  const clamp = (value: number): number => {
    return Math.max(quantMin, Math.min(quantMax, value));
  };

  for (let i = 0; i < block.length; i++) {
    const row: number[] = [];
    for (let j = 0; j < block[i].length; j++) {
      // Correct asymmetric quantization formula
      const quantizedValue = Math.round((block[i][j] - minVal) / scale);
      const clampedValue = clamp(quantizedValue);
      row.push(clampedValue);
    }
    quantized.push(row);
  }

  return { quantized, scale, zeroPoint };
}

// For 4x8, each block is a row of 8 values
export function extractBlock(matrix: number[][], blockIndex: number): number[] {
  // blockIndex: 0-3, each block is a row
  return matrix[blockIndex].slice();
}

export function generateMatrix(): number[][] {
  // 4 rows, 8 columns
  const matrix: number[][] = [];
  const blockHotspots = [
    [150, 300],
    [800, 1200],
    [-200, 100],
    [1400, 1600],
  ];
  for (let i = 0; i < 4; i++) {
    const row: number[] = [];
    const hotspots = blockHotspots[i];
    for (let j = 0; j < 8; j++) {
      if (Math.random() < 0.7) {
        const hotspot = hotspots[Math.floor(Math.random() * hotspots.length)];
        const stdDev = 80;
        const value =
          hotspot +
          (Math.random() - 0.5) * 2 * stdDev +
          (Math.random() - 0.5) * 2 * stdDev;
        const clampedValue = Math.max(-1024, Math.min(1852, value));
        row.push(parseFloat(clampedValue.toFixed(2)));
      } else {
        const minRange = Math.min(...hotspots) - 200;
        const maxRange = Math.max(...hotspots) + 200;
        const value = minRange + Math.random() * (maxRange - minRange);
        const clampedValue = Math.max(-1024, Math.min(1852, value));
        row.push(parseFloat(clampedValue.toFixed(2)));
      }
    }
    matrix.push(row);
  }
  return matrix;
}
