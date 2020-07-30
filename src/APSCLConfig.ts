import * as vscode from "vscode";
import { LABEL, TEXT } from './constants';

export interface LanguageSettings {
    commentSymbol?: string;
    fileExtension?: string;
    logFormat?: string;
    defaultLogFormat?: string;
    wrappedLogFormat?: string;
}

export class APSCLConfig {
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = vscode.workspace.getConfiguration("automaticProgrammaticSupersonicConsoleLog");
    }

    public getLabel(): string {
        return this.config.get<string>("label");
    }

    public getWrapLogMessage(): boolean {
        return this.config.get<boolean>("wrapLogMessage");
    }

    public getLanguageSettings(language: string): LanguageSettings {
        const allLanguageSettings = this.config.get<LanguageSettings[]>("languageSettings", []);
        const filteredLanguageSettings = allLanguageSettings.filter(languageSetting => languageSetting.fileExtension.toLowerCase() === language.toLowerCase());
        const languageSettings = filteredLanguageSettings.length > 0 ? filteredLanguageSettings[0] : {};
        if (!languageSettings.logFormat) {
            languageSettings.logFormat = `console.log('${LABEL}' + ${TEXT});`;
        }

        if (!languageSettings.commentSymbol) {
            languageSettings.commentSymbol = '//';
        }

        if (!languageSettings.defaultLogFormat) {
            languageSettings.defaultLogFormat = "console.log();";
        }

        if (!languageSettings.wrappedLogFormat) {
            languageSettings.wrappedLogFormat = "console.log('~~~~~~ APSCL ~~~~~~');";
        }

        return languageSettings;
    }
}
