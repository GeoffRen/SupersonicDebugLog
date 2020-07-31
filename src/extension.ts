import * as vscode from "vscode";
import { GetInsertPosition, insertLogMessage } from './insertLogMessage';
import { commentAllLogMessages, deleteAllLogMessages, uncommentAllLogMessages } from './modifyAllLogMessages';

export function activate(context: vscode.ExtensionContext): void {
	const insertLogMessageDisposable = vscode.commands.registerCommand(
		"supersonicdebuglog.insertLogMessage",
		insertLogMessage
	);

	const getInsertPositionBelow: GetInsertPosition = (_: vscode.TextDocument, startLine: number): vscode.Position => new vscode.Position(startLine + 1, 0);
	const insertLogMessageBelowDisposable = vscode.commands.registerCommand(
		"supersonicdebuglog.insertLogMessageDirectlyBelow",
		() => insertLogMessage(getInsertPositionBelow)
	);

	const getInsertPositionAbove: GetInsertPosition = (_: vscode.TextDocument, startLine: number): vscode.Position => new vscode.Position(startLine, 0);
	const insertLogMessageAboveDisposable = vscode.commands.registerCommand(
		"supersonicdebuglog.insertLogMessageDirectlyAbove",
		() => insertLogMessage(getInsertPositionAbove)
	);

	const commentAllLogMessagesDisposable = vscode.commands.registerCommand(
		"supersonicdebuglog.commentAllLogMessages",
		commentAllLogMessages
	);

	const uncommentAllLogMessagesDisposable = vscode.commands.registerCommand(
		"supersonicdebuglog.uncommentAllLogMessages",
		uncommentAllLogMessages
	);

	const deleteAllLogMessagesDisposable = vscode.commands.registerCommand(
		"supersonicdebuglog.deleteAllLogMessages",
		deleteAllLogMessages
	);

	context.subscriptions.push(insertLogMessageDisposable);
	context.subscriptions.push(insertLogMessageBelowDisposable);
	context.subscriptions.push(insertLogMessageAboveDisposable);
	context.subscriptions.push(commentAllLogMessagesDisposable);
	context.subscriptions.push(uncommentAllLogMessagesDisposable);
	context.subscriptions.push(deleteAllLogMessagesDisposable);
}
