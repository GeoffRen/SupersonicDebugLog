import * as vscode from "vscode";

export interface LanguageSettings {
    commentSymbol?: string;
    fileExtension?: string;
    logFormat?: string;
    defaultLogFormat?: string;
    wrappedLogFormat?: string;
}

export class SDLConfig {
    private config: vscode.WorkspaceConfiguration;

    constructor() {
        this.config = vscode.workspace.getConfiguration("supersonicDebugLog");
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
        this.setDefaultLanguageSettingsProps(languageSettings);

        return languageSettings;
    }

    private setDefaultLanguageSettingsProps(languageSettings: LanguageSettings): void {
        const defaultLanguageSetting = this.config.get<LanguageSettings>("defaultLanguageSettings");
        if (!languageSettings.logFormat) {
            languageSettings.logFormat = defaultLanguageSetting.logFormat;
        }

        if (!languageSettings.commentSymbol) {
            languageSettings.commentSymbol = defaultLanguageSetting.commentSymbol;
        }

        if (!languageSettings.defaultLogFormat) {
            languageSettings.defaultLogFormat = defaultLanguageSetting.defaultLogFormat;
        }

        if (!languageSettings.wrappedLogFormat) {
            languageSettings.wrappedLogFormat = defaultLanguageSetting.wrappedLogFormat;
        }
    }
}
