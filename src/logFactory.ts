import { SDLConfig } from './SDLConfig';
import { LABEL, TEXT } from './constants';

export interface LogOptions {
    padding: number;
    prependNewLine: boolean;
    logMessage: string;
    wrappedLogFormat: string;
}

export function createLogMessage(sdlConfig: SDLConfig, text: string, language: string): string {
    const label = sdlConfig.getLabel().replace(TEXT, text);
    const logFormat = sdlConfig.getLanguageSettings(language).logFormat;
    return logFormat.replace(LABEL, label).replace(TEXT, text);
}

export function createFullLog(logOptions: LogOptions): string {
    const logMessage = logOptions.logMessage;
    const padding = ' '.repeat(logOptions.padding);
    const prependNewLine = !logOptions.prependNewLine ? '' : '\n';
    const wrappedLogMessage = !logOptions.wrappedLogFormat ? '' : `${padding}${logOptions.wrappedLogFormat}\n`;
    return `${prependNewLine}${wrappedLogMessage}${padding}${logMessage}\n${wrappedLogMessage}`;
}
