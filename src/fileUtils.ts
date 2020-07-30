import * as vscode from "vscode";

export function getFileExtension(document: vscode.TextDocument): string {
    const fileParts = document.fileName.split('.');
    return fileParts[fileParts.length - 1];
}
