import * as vscode from "vscode";
import { createLog } from './logFactory';

export type GetInsertPosition = (document: vscode.TextDocument, startLine: number) => vscode.Position;

export async function insertLogMessage(getInsertPosition?: GetInsertPosition): Promise<void> {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    const fileParts = document.fileName.split('.');
    const language = fileParts[fileParts.length - 1];

    for (const selection of editor.selections) {
        const text = document.getText(selection);
        if (!text.trim()) {
            return;
        }

        const insertPosition = !getInsertPosition ? getInsertPositionAfterBrackets(document, selection.active.line) : getInsertPosition(document, selection.active.line);

        const padding = getPadding(document, insertPosition.line);
        const prependNewLine = insertPosition.line >= document.lineCount;
        const log = createLog({ language, text, padding, prependNewLine });

        await editor.edit((editBuilder) => {
            editBuilder.insert(
                insertPosition,
                log
            );
        });
    }
}

function getInsertPositionAfterBrackets(document: vscode.TextDocument, startLine: number): vscode.Position {
    let bracketCount = 0;
    let lineNum = startLine;
    for (lineNum; lineNum < document.lineCount; lineNum++) {
        const curText = document.lineAt(lineNum).text;
        const openBracketMatches = curText.match(/[\<\[\{\(]/g);
        if (openBracketMatches) {
            bracketCount += openBracketMatches.length;
        }

        const closedBracketMatches = curText.match(/[\>\]\}\)]/g);
        if (closedBracketMatches) {
            bracketCount -= closedBracketMatches.length;
        }

        if (bracketCount <= 0) {
            break;
        }
    }

    return new vscode.Position(lineNum + 1, 0);
}

function getPadding(document: vscode.TextDocument, insertLine: number): number {
    const prevLinePadding = document.lineAt(insertLine - 1).text.search(/\S|$/);
    const postLinePadding = document.lineAt(insertLine).text.search(/\S|$/);
    return Math.max(prevLinePadding, postLinePadding);
}
