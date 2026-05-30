import * as vscode from 'vscode';
import { getNonce, getWebviewUri } from '../../utils/webview';
import type { McpServer } from './types';

export function createHealthDetailWebview(
  context: vscode.ExtensionContext,
  server: McpServer
): void {
  const panel = vscode.window.createWebviewPanel(
    'orbit.health.detail',
    `${server.name} — Health Detail`,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview', 'health')],
    }
  );

  const scriptUri = getWebviewUri(panel.webview, context.extensionUri, [
    'dist',
    'webview',
    'health',
    'index.js',
  ]);
  const nonce = getNonce();

  panel.webview.html = renderHealthDetailHtml(server, scriptUri, nonce);

  panel.webview.onDidReceiveMessage((message) => {
    if (message.type === 'command') {
      vscode.commands.executeCommand(message.command as string, message.data as unknown);
    }
    if (message.type === 'copyToClipboard') {
      void vscode.env.clipboard.writeText(message.text as string).then(() => {
        void vscode.window.showInformationMessage('Copied to clipboard.');
      });
    }
  });
}

function renderHealthDetailHtml(server: McpServer, scriptUri: vscode.Uri, nonce: string): string {
  const initialData = JSON.stringify(server);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             style-src 'unsafe-inline';
             script-src 'nonce-${nonce}';">
  <title>${escapeHtml(server.name)} — Health Detail</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}">
    window.__ORBIT_DATA__ = ${initialData};
  </script>
  <script nonce="${nonce}" src="${scriptUri.toString()}"></script>
</body>
</html>`;
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
