import * as vscode from "vscode";
import { createLog } from './logFactory';

export async function createLogMessage() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return;
    }

    const document = editor.document;
    // const config: vscode.WorkspaceConfiguration = vscode.workspace.getConfiguration("automaticProgrammaticSupersonicConsoleLog");
    for (let selection of editor.selections) {
        const text = document.getText(selection);
        if (!text.trim()) {
            return;
        }

        const curRange = new vscode.Range(new vscode.Position(selection.active.line, 0), selection.end);
        const padding = document.getText(curRange).search(/\S|$/);
        const log = createLog({ text, padding });
        await editor.edit((editBuilder) => {
            editBuilder.insert(
                new vscode.Position(selection.active.line + 1, 0),
                log
            );
        });
    }
}