import { LABEL, TEXT } from './constants';
import { parseLanguageConfig } from './parseConfig';

export interface LogOptions {
    language: string;
    padding: number;
    prependNewLine: boolean;
    text: string;
}


export function createLog(logOptions: LogOptions): string {
    const padding = ' '.repeat(logOptions.padding);
    const prependNewLine = logOptions.prependNewLine ? '\n' : '';
    const logMessage = getLogMessage(logOptions.language, "Test log", logOptions.text);
    return `${prependNewLine}${padding}${logMessage}\n`;
}

function getLogMessage(language: string, label: string, text: string): string {
    const logFormat = parseLanguageConfig(language).logFormat!;
    return logFormat.replace(LABEL, label).replace(TEXT, text);
}
