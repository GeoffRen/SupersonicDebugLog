export interface LogOptions {
    text: string;
    padding: number;
}

export function createLog(logOptions: LogOptions): string {
    return `${' '.repeat(logOptions.padding)}console.log('Test log:' ${logOptions.text});\n`;
}