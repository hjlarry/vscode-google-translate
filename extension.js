// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const request = require('request');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "google-translate" is now active!');

	let excludeSpecial = function (s) {
		// 去掉转义字符
		s = s.replace(/[\'\"\\\/\b\f\n\r\t]/g, ' ');
		// 去掉特殊字符
		s = s.replace(/[\@\#\$\%\^\&\*\(\)\{\}\:\"\L\<\>\?\[\]]/, ' ');
		return s;
	};

	// The command has been defined in the package.json file Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.translate', function () {
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		let document = editor.document;
		let selection = editor.selection;
		let text = document.getText(selection);
		text = excludeSpecial(text);
		let url = 'https://translate.google.cn/translate_a/single?client=gtx&sl=auto&tl=zh-CN&hl=en&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&dt=t&ie=UTF-8&oe=UTF-8&otf=1&ssel=0&tsel=0&kc=7&tk=514069.514069&q=' + text;
		request(url, function (error, response, body) {
			if (response && response.statusCode == 200) {
				let result = JSON.parse(body);
				vscode.window.setStatusBarMessage(result[0][0][0]);
			} else {
				console.log('error:', error);
				vscode.window.showWarningMessage(error);
			}
		});
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
