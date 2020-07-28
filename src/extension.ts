import * as vscode from "vscode";
import { GetInsertPosition, insertLogMessage } from './insertLogMessage';

export function activate(context: vscode.ExtensionContext) {
	const insertLogMessageDisposable = vscode.commands.registerCommand(
		"automaticprogrammaticsupersonicconsolelog.insertLogMessage",
		insertLogMessage
	);

	const getInsertPositionBelow: GetInsertPosition = (document: vscode.TextDocument, startLine: number): vscode.Position => new vscode.Position(startLine + 1, 0);
	const insertLogMessageBelowDisposable = vscode.commands.registerCommand(
		"automaticprogrammaticsupersonicconsolelog.insertLogMessageBelow",
		() => insertLogMessage(getInsertPositionBelow)
	);

	context.subscriptions.push(insertLogMessageBelowDisposable);
	context.subscriptions.push(insertLogMessageDisposable);
}
