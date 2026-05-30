import * as vscode from 'vscode';
import { getNonce, getWebviewUri } from '../../utils/webview';
import type { DebugClient } from './DebugClient';
import type { DebugSession } from './types';

export function createDebugDetailWebview(
  context: vscode.ExtensionContext,
  client: DebugClient,
  sessionId: string
): void {
  const panel = vscode.window.createWebviewPanel(
    'orbit.debug.detail',
    `Session — ${sessionId.slice(0, 8)}`,
    vscode.ViewColumn.One,
    {
      enableScripts: true,
      localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'dist', 'webview', 'debug')],
    }
  );

  const scriptUri = getWebviewUri(panel.webview, context.extensionUri, [
    'dist',
    'webview',
    'debug',
    'index.js',
  ]);
  const nonce = getNonce();

  // Render shell immediately, load data async
  panel.webview.html = renderDebugShellHtml(scriptUri, nonce);

  panel.webview.onDidReceiveMessage((message) => {
    if (message.type === 'ready') {
      // Webview is ready — fetch and push session data
      void client
        .getSessionContext(sessionId)
        .then((session: DebugSession) => {
          void panel.webview.postMessage({ type: 'update', payload: session });
        })
        .catch(() => {
          void panel.webview.postMessage({
            type: 'error',
            payload: { message: `Could not load session ${sessionId}` },
          });
        });
    }
    if (message.type === 'addFix') {
      void client.addFix(sessionId, message.description as string).then(() => {
        void client.getSessionContext(sessionId).then((session: DebugSession) => {
          void panel.webview.postMessage({ type: 'update', payload: session });
        });
      });
    }
    if (message.type === 'copyToClipboard') {
      void vscode.env.clipboard.writeText(message.text as string);
    }
  });
}

function renderDebugShellHtml(scriptUri: vscode.Uri, nonce: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
    content="default-src 'none';
             style-src 'unsafe-inline';
             script-src 'nonce-${nonce}';">
  <title>Debug Session</title>
</head>
<body>
  <div id="root"></div>
  <script nonce="${nonce}" src="${scriptUri.toString()}"></script>
</body>
</html>`;
}
