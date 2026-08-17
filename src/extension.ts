// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
// 导入 providers.ts 中定义的类
import { BuildViewProvider } from './providers';

import { getAllCMakeKits } from './findqtkits';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

let targetPlatform: string | undefined = undefined;

export function activate(context: vscode.ExtensionContext) {
	console.log('Qt Deploy 扩展已激活！');

	// ============================================
	// 1. 注册 "构建操作" 视图
	// ============================================
	const buildViewProvider = new BuildViewProvider();
	context.subscriptions.push(
		vscode.window.registerTreeDataProvider('qt-deploy.buildView', buildViewProvider)
	);

	

	// ============================================
	// 3. 注册命令（与 View 中的点击事件对应）
	// ============================================
	// 构建命令
	context.subscriptions.push(
		vscode.commands.registerCommand('qt-deploy.build', () => {
			vscode.window.showInformationMessage('🔨 正在构建 Qt 项目...');
		})
	);

	// 部署命令
	context.subscriptions.push(
		vscode.commands.registerCommand('qt-deploy.deploy', () => {
			vscode.window.showInformationMessage('🚀 正在部署 Qt 应用...');
		})
	);

	// 运行命令
	context.subscriptions.push(
		vscode.commands.registerCommand('qt-deploy.run', () => {
			vscode.window.showInformationMessage('▶️ 正在运行 Qt 应用...');
		})
	);

	// 支持的平台列表
	let supportedPlatforms: string[] = [];
	if (process.platform === 'win32') {
		supportedPlatforms = ['Windows','macOS', 'Android',"HarmonyOS"];
	}
	else if (process.platform === 'darwin') {
		supportedPlatforms = ['macOS', 'iOS', 'Android',"HarmonyOS"];
	}
	else if (process.platform === 'linux') {
		supportedPlatforms = ['Linux', 'Android',"HarmonyOS"];
	}
	// 选择平台命令
	context.subscriptions.push(
		vscode.commands.registerCommand('qt-deploy.selectPlatform', () => {
			vscode.window.showQuickPick(
				supportedPlatforms,
				{ placeHolder: '请选择部署平台:'}
			).then(selected => {
				if (selected) {
					targetPlatform = selected;
					vscode.window.showInformationMessage(`✅ 已选择平台: ${selected}`);
          			// ⭐ 关键：刷新 TreeView
          			buildViewProvider.refresh();
				}
			});
		})
	);

	let qtKits = getAllCMakeKits();

	// 选择 Kit 命令
	context.subscriptions.push(
		vscode.commands.registerCommand('qt-deploy.selectKit', () => {
			vscode.window.showQuickPick(
				qtKits,
				{ placeHolder: '请选择 Qt Kit' }
			).then(selected => {
				if (selected) {
					vscode.window.showInformationMessage(`✅ 已选择: ${selected}`);
				}
			});
		})
	);

	const outputChannel = vscode.window.createOutputChannel('Qt Deploy');

	console.log('所有视图和命令已注册完成！');
}

// This method is called when your extension is deactivated
export function deactivate() {}
export { targetPlatform };