import * as vscode from "vscode";
import { APSCLConfig } from './APSCLConfig';
import { getFileExtension } from './fileUtils';
import { createFullLog, createLogMessage } from './logFactory';
import { getPadding } from './stringUtils';

export type GetInsertPosition = (document: vscode.TextDocument, startLine: number) => vscode.Position;

export async function insertLogMessage(getInsertPosition?: GetInsertPosition): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const language = getFileExtension(document);
    const apsclConfig = new APSCLConfig();
    const languageSettings = apsclConfig.getLanguageSettings(language);

    await editor.edit(editBuilder => {
        for (const selection of editor.selections) {
            const insertPosition = !getInsertPosition ? getInsertPositionAfterBrackets(document, selection.active.line) : getInsertPosition(document, selection.active.line);
            const padding = calculatePadding(document, insertPosition.line);
            const prependNewLine = insertPosition.line >= document.lineCount;

            const text = getSelectedText(document, selection);
            const logMessage = !text ? languageSettings.defaultLogFormat : createLogMessage(apsclConfig, text, language);
            const wrappedLogFormat = !apsclConfig.getWrapLogMessage() || !text ? '' : languageSettings.wrappedLogFormat;
            const log = createFullLog({ logMessage, padding, prependNewLine, wrappedLogFormat });

            editBuilder.insert(insertPosition, log);
        }
    });
}

function getInsertPositionAfterBrackets(document: vscode.TextDocument, startLine: number): vscode.Position {
    let bracketCount = 0;
    let lineNum = startLine;
    for (lineNum; lineNum < document.lineCount; lineNum++) {
        const curText = document.lineAt(lineNum).text;
        const openBracketMatches = curText.match(/[<[{(]/g);
        if (openBracketMatches) {
            bracketCount += openBracketMatches.length;
        }

        const closedBracketMatches = curText.match(/[>\]})]/g);
        if (closedBracketMatches) {
            bracketCount -= closedBracketMatches.length;
        }

        if (bracketCount <= 0) {
            break;
        }
    }

    return new vscode.Position(lineNum + 1, 0);
}

function calculatePadding(document: vscode.TextDocument, insertLine: number): number {
    const prevLinePadding = insertLine > 0 ? getPadding(document.lineAt(insertLine - 1).text) : 0;
    const postLinePadding = insertLine < document.lineCount ? getPadding(document.lineAt(insertLine).text) : 0;
    return Math.max(prevLinePadding, postLinePadding);
}

function getSelectedText(document: vscode.TextDocument, selection: vscode.Selection): string {
    const selectedText = document.getText(selection);
    if (selectedText.trim()) {
        return selectedText.trim();
    }

    if (selectedText.length > 0) {
        return '';
    }

    const lineNum = selection.start.line;
    const lineText = document.lineAt(lineNum).text;
    const selectedCharacter = selection.start.character;

    const startStr = [...lineText.substring(0, selectedCharacter)].reverse().join("");
    const startSpaceIdx = startStr.includes(' ') ? startStr.indexOf(' ') : startStr.length;
    const startChar = startStr.length - startSpaceIdx;

    const endStr = lineText.substring(selection.end.character);
    const endSpaceIdx = endStr.includes(' ') ? endStr.indexOf(' ') : endStr.length;
    const endChar = selectedCharacter + endSpaceIdx;
    if (startChar === endChar) {
        return '';
    }

    return document.getText(new vscode.Range(new vscode.Position(lineNum, startChar), new vscode.Position(lineNum, endChar)));
}
