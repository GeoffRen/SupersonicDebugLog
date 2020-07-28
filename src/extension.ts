import * as vscode from "vscode";
import { createLogMessage } from './createLogMessage';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("automaticprogrammaticsupersonicconsolelog.createLogMessage", createLogMessage);
	context.subscriptions.push(disposable);
}
