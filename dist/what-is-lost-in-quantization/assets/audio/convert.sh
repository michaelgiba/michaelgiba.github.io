#!/bin/bash

INPUT_FILE="./sample_audio.mp3"
OUTPUT_16BIT="./sample_audio_16bit.wav"
OUTPUT_8BIT="./sample_audio_8bit.wav"
OUTPUT_4BIT="./sample_audio_4bit.wav"

set -e

if [ ! -f "$INPUT_FILE" ]; then
    echo "Error: Input file not found at $INPUT_FILE"
    exit 1
fi

echo "Starting audio conversions..."

# 16-bit: mono, 8kHz
echo "Converting to 16-bit WAV..."
ffmpeg -y -i "$INPUT_FILE" -ac 1 -ar 24000 -acodec pcm_s16le "$OUTPUT_16BIT"

# 8-bit: mono, 8kHz
echo "Converting to 8-bit WAV..."
ffmpeg -y -i "$INPUT_FILE" -ac 1 -ar 24000 -acodec pcm_u8 "$OUTPUT_8BIT"

# 4-bit simulation: mono, 8kHz, quantize to 16 levels, save as 8-bit PCM
echo "Converting to simulated 4-bit WAV..."
ffmpeg -y -i "$INPUT_FILE" -ac 1 -ar 24000 -af "aformat=sample_fmts=u8,volume=8,alimiter=limit=0.0625,volume=0.125" -acodec pcm_u8 "$OUTPUT_4BIT"

echo "All conversions complete."
echo "Generated files:"
echo "- $OUTPUT_16BIT"
echo "- $OUTPUT_8BIT"
echo "- $OUTPUT_4BIT"
