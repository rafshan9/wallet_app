declare module 'whisper.rn' {
    export interface WhisperContext {
        transcribe(
            path: string,
            options?: {
                language?: string;
                maxLen?: number;
                tokenTimestamps?: boolean;
                [key: string]: any;
            }
        ): Promise<{ result: string; segments?: any[] }>;
        transcribeRealtime(options?: any): Promise<{
            stop: () => void;
            subscribe: (cb: (event: any) => void) => void;
        }>;
        release(): Promise<void>;
    }

    export function initWhisper(options: {
        filePath?: string;
        assets?: any;
        [key: string]: any;
    }): Promise<WhisperContext>;
}