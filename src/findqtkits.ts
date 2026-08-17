import * as vscode from 'vscode';

// ============ 方式一：获取 CMake Tools API ============
async function getCMakeToolsAPI() {
  // CMake Tools 的扩展 ID
  const extensionId = 'ms-vscode.cmake-tools';
  const extension = vscode.extensions.getExtension(extensionId);
  
  if (!extension) {
    vscode.window.showErrorMessage('CMake Tools is not installed');
    return null;
  }

  // 等待扩展激活
  if (!extension.isActive) {
    await extension.activate();
  }

  // 获取 CMake Tools 的 API
  const api = extension.exports;
  return api;
}

// ============ 方式二：获取当前 Kit ============
async function getCurrentCMakeKit() {
  const api = await getCMakeToolsAPI();
  if (!api){ return null; }

  try {
    // CMake Tools API 提供了获取 Kit 的方法
    const kit = await api.getActiveKit();
    return kit;
  } catch (error) {
    console.error('Failed to get active kit:', error);
    return null;
  }
}

// ============ 方式三：获取所有可用的 Kit ============
async function getAllCMakeKits() {
  const api = await getCMakeToolsAPI();
  if (!api) { return []; }

  try {
    const kits = await api.getKits();
    return kits;
  } catch (error) {
    console.error('Failed to get kits:', error);
    return [];
  }
}

export { getCurrentCMakeKit, getAllCMakeKits };