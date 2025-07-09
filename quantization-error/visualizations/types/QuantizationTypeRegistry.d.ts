import { QuantizationType } from './QuantizationType';
export declare class QuantizationTypeRegistry {
    private static instance;
    private types;
    private constructor();
    static getInstance(): QuantizationTypeRegistry;
    private registerDefaultTypes;
    register(type: QuantizationType): void;
    get(name: string): QuantizationType | undefined;
    getAll(): QuantizationType[];
    getNames(): string[];
    getDropdownOptions(): Array<{
        value: string;
        text: string;
    }>;
}
