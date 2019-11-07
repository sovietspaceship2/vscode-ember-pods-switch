import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	registerSwitchCommand('extension.switchToRoute', ['controller.js', 'template.hbs'], ['route.js']);
	registerSwitchCommand('extension.switchToControllerOrComponent', ['route.js', 'template.hbs'], ['controller.js', 'component.js']);
	registerSwitchCommand('extension.switchToTemplate', ['controller.js', 'route.js', 'component.js'], ['template.hbs']);

	function registerSwitchCommand(name: string, from: Array<string>, to: Array<string>) {
		const fromPattern: RegExp = new RegExp(from.map(part => '/' + part.replace('.', '\\.') + '$').join('|'));
		const switchFileCommand = vscode.commands.registerCommand(name, async () => {
			if (vscode.window.activeTextEditor) {
				const currentFileName = vscode.window.activeTextEditor.document.fileName;
				for (const target of to) {
					const targetFileName = currentFileName.replace(fromPattern, '/' + target);
					const openPath = vscode.Uri.parse('file://' + targetFileName);
					try {
						const document = await vscode.workspace.openTextDocument(openPath)
						if (document) {
							vscode.window.showTextDocument(document);
							return;
						}
					} catch (error) {}
				}
				vscode.window.showInformationMessage(`No ${to.join(', ')} found in this directory`);
			} else {
				vscode.window.showInformationMessage('No active editor switching pods');
			}
		});
	
		context.subscriptions.push(switchFileCommand);
	}
}

export function deactivate() {}
