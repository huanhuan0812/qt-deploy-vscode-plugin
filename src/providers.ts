import * as vscode from 'vscode';
import { targetPlatform } from './extension';

// 定义树节点类型
export class QtItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly command?: vscode.Command,
    public readonly contextValue?: string
  ) {
    super(label, collapsibleState);
    this.tooltip = label;
  }
}

// 构建操作的 TreeDataProvider
export class BuildViewProvider implements vscode.TreeDataProvider<QtItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<QtItem | undefined | void> = new vscode.EventEmitter<QtItem | undefined | void>();
  readonly onDidChangeTreeData: vscode.Event<QtItem | undefined | void> = this._onDidChangeTreeData.event;

  // ⭐ 添加一个刷新方法
  public refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: QtItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: QtItem): Thenable<QtItem[]> {
    if (element) {
      return Promise.resolve([]);
    } else {
      // ⭐ 读取最新的 targetPlatform 显示在标题中
      const platformLabel = targetPlatform ? `选择平台 (当前: ${targetPlatform})` : '选择平台';
      
      return Promise.resolve([
        new QtItem(
          platformLabel,  // 动态显示当前平台
          vscode.TreeItemCollapsibleState.None,
          { command: 'qt-deploy.selectPlatform', title: '选择平台' }
        ),
        new QtItem(
          '选择Kit', 
          vscode.TreeItemCollapsibleState.None,
          { command: 'qt-deploy.selectKit', title: '选择 Qt Kit' }
        ),
        new QtItem(
          '构建', 
          vscode.TreeItemCollapsibleState.None,
          { command: 'qt-deploy.build', title: '构建' }
        ),
        new QtItem(
          '部署', 
          vscode.TreeItemCollapsibleState.None,
          { command: 'qt-deploy.deploy', title: '部署' }
        ),
        new QtItem(
          '运行', 
          vscode.TreeItemCollapsibleState.None,
          { command: 'qt-deploy.run', title: '运行' }
        ),
      ]);
    }
  }
}