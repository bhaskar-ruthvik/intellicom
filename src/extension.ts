import * as vscode from 'vscode';
import openai from './utils'

export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "intellicom" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('intellicom.commentCode',async () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		const editor = vscode.window.activeTextEditor;
		if(editor){
			const document = editor.document;
			const selection = editor.selection;
			const cursor = editor.selection.start;
			const word = document.getText(selection);
			const completion = await openai.chat.completions.create({
				messages: [{ role: "system", content: " You are code commenting bot. You will be given a code and you have to return a comment about what the code does." },{role: "user", content: `Can you return the comment in plain text?\nCode:\n${word}`}],
				model: "gpt-3.5-turbo-16k",
			  });
			let commentLines = completion.choices[0].message.content!.split('.')
			commentLines = commentLines.map((line: string)=> '#'+line);
			const comment = commentLines.slice(0,-1).join('\n')
			editor.edit(editBuilder =>{
				editBuilder.replace(selection, comment+'\n'+word)
			})
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
