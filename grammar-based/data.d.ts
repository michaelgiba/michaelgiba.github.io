export type Token = string;
export type Vocabulary = Token[];
export type Logits = number[];
export type LogitsSequence = Logits[];
export type Completion = string[];
export interface SamplingAnalysisData {
    id: string;
    inputText: string;
    sampledCharacters: Completion;
    originalLogitsValues: LogitsSequence;
    originalLogitTokenIndex: LogitsSequence;
    completionTokens: Vocabulary;
}
export interface RenderData {
    originalLogits: LogitsSequence;
    tokens: Vocabulary;
    sampledCharacters: Completion;
}
export declare function loadVocabulary(basePath: string): Promise<Vocabulary>;
export declare function loadSamplingAnalysisData(id: string, basePath: string): Promise<SamplingAnalysisData>;
export declare function loadAllSamplingAnalysisData(ids: string[], basePath: string): Promise<SamplingAnalysisData[]>;
