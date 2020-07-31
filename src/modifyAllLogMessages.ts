import * as vscode from "vscode";
import { SDLConfig, LanguageSettings } from './SDLConfig';
import { LABEL, TEXT } from './constants';
import { getFileExtension } from './fileUtils';
import { getPadding } from "./stringUtils";

export async function commentAllLogMessages(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const languageSettings = new SDLConfig().getLanguageSettings(getFileExtension(document));
    const logLinePositions = getLogLinePositions(document, languageSettings);
    await editor.edit((editBuilder) => {
        logLinePositions.forEach(insertPosition => editBuilder.insert(insertPosition, `${languageSettings.commentSymbol} `));
    });
}

export async function uncommentAllLogMessages(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const languageSettings = new SDLConfig().getLanguageSettings(getFileExtension(document));
    const logLinePositions = getLogLinePositions(document, languageSettings);
    await editor.edit((editBuilder) => {
        for (const lineNum of logLinePositions.map(linePosition => linePosition.line)) {
            const text = document.lineAt(lineNum).text;
            if (text.includes(languageSettings.commentSymbol)) {
                const commentRange = getCommentRange(document.lineAt(lineNum).text, languageSettings.commentSymbol, lineNum);
                editBuilder.replace(commentRange, '');
            }
        }
    });
}

export async function deleteAllLogMessages(): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const languageSettings = new SDLConfig().getLanguageSettings(getFileExtension(document));
    const logLinePositions = getLogLinePositions(document, languageSettings);
    await editor.edit((editBuilder) => {
        for (const linePosition of logLinePositions) {
            editBuilder.delete(document.lineAt(linePosition.line).rangeIncludingLineBreak);
        }
    });
}

function getLogLinePositions(document: vscode.TextDocument, languageSettings: LanguageSettings): vscode.Position[] {
    const logPatterns = [languageSettings.logFormat, languageSettings.wrappedLogFormat]
        .map(format => format.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'))
        .map(escapedFormat => new RegExp(escapedFormat.replace(LABEL, '.*').replace(TEXT, '.*')));

    const logLinePositions: vscode.Position[] = [];
    for (let lineNum = 0; lineNum < document.lineCount; lineNum++) {
        logPatterns.forEach(logPattern => {
            const charNum = document.lineAt(lineNum).text.search(logPattern);
            if (charNum > -1) {
                logLinePositions.push(new vscode.Position(lineNum, charNum));
            }
        });
    }

    return logLinePositions;
}

function getCommentRange(text: string, commentSymbol: string, lineNum: number): vscode.Range {
    const startCharacter = text.indexOf(commentSymbol);
    const endIdxComment = startCharacter + commentSymbol.length;
    const endCharacter = endIdxComment + getPadding(text.substring(endIdxComment));
    return new vscode.Range(new vscode.Position(lineNum, startCharacter), new vscode.Position(lineNum, endCharacter));
}
