import { LABEL, TEXT } from './constants';
import * as vscode from "vscode";

export interface APSCLConfig {
    LanguageSettings: LanguageConfig[];
}

export interface LanguageConfig {
    fileExtension?: string;
    logFormat?: string;
}

export function parseConfig(): APSCLConfig {
    const config = vscode.workspace.getConfiguration("automaticProgrammaticSupersonicConsoleLog");
    return {
        LanguageSettings: config.get<LanguageConfig[]>("languageSettings", [])
    };
}

export function parseLanguageConfig(language: string): LanguageConfig {
    const config = vscode.workspace.getConfiguration("automaticProgrammaticSupersonicConsoleLog");
    const languageSettings = config.get<LanguageConfig[]>("languageSettings", []);
    const filteredLanguageSettings = languageSettings.filter(languageSetting => languageSetting.fileExtension.toLowerCase() === language.toLowerCase());
    const languageConfig = filteredLanguageSettings.length > 0 ? filteredLanguageSettings[0] : {};
    if (!languageConfig.logFormat) {
        languageConfig.logFormat = `console.log('${LABEL}' + ${TEXT});`;
    }

    return languageConfig;
}
