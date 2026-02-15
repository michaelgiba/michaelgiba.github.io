import { QuantizationType } from './QuantizationType';
import { Type0Quantization } from './Type0Quantization';
import { Type1Quantization } from './Type1Quantization';
import { TypeKQuantization } from './TypeKQuantization';

/**
 * Registry for all available quantization types
 */
export class QuantizationTypeRegistry {
  private static instance: QuantizationTypeRegistry;
  private types: Map<string, QuantizationType> = new Map();

  private constructor() {
    this.registerDefaultTypes();
  }

  public static getInstance(): QuantizationTypeRegistry {
    if (!QuantizationTypeRegistry.instance) {
      QuantizationTypeRegistry.instance = new QuantizationTypeRegistry();
    }
    return QuantizationTypeRegistry.instance;
  }

  private registerDefaultTypes(): void {
    this.register(new Type0Quantization());
    this.register(new Type1Quantization());
    this.register(new TypeKQuantization());
  }

  public register(type: QuantizationType): void {
    this.types.set(type.name, type);
  }

  public get(name: string): QuantizationType | undefined {
    return this.types.get(name);
  }

  public getAll(): QuantizationType[] {
    return Array.from(this.types.values());
  }

  public getNames(): string[] {
    return Array.from(this.types.keys());
  }

  public getDropdownOptions(): Array<{ value: string; text: string }> {
    return this.getAll().map((type) => ({
      value: type.name,
      text: type.displayName,
    }));
  }
}
