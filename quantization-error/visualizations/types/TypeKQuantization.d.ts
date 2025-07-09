import * as d3 from 'd3';
import { QuantizationType, QuantizationConfig, QuantizationResult, TooltipData } from './QuantizationType';
export declare class TypeKQuantization extends QuantizationType {
    readonly name = "typeK";
    readonly displayName = "Type K";
    readonly quantizedDataType = "uint8";
    readonly requiresMinValues = true;
    readonly requiresSuperblock = true;
    initializeQuantization(sourceMatrix: number[][]): QuantizationConfig;
    quantize(sourceMatrix: number[][], config: QuantizationConfig): QuantizationResult;
    renderQuantizationTooltip(data: TooltipData): string;
    renderDequantizationTooltip(data: TooltipData): string;
    getFormulaDescription(): string;
    createParameterSliders(container: d3.Selection<HTMLDivElement, unknown, HTMLElement, unknown>, config: QuantizationConfig, blockColors: string[], onUpdate: (newConfig: QuantizationConfig) => void): void;
}
