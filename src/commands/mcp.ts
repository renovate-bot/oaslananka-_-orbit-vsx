import * as vscode from 'vscode';
import type { McpExplorerProvider } from '../panels/mcp/McpExplorerProvider';
import { COMMAND_IDS } from '../constants';

export function registerMcpCommands(
  context: vscode.ExtensionContext,
  mcpProvider: McpExplorerProvider
): void {
  context.subscriptions.push(
    vscode.commands.registerCommand(COMMAND_IDS.MCP_EXPLORER_REFRESH, async () => {
      try {
        await mcpProvider.refresh();
      } catch (error) {
        vscode.window.showErrorMessage(
          `Refresh failed: ${error instanceof Error ? error.message : String(error)}`
        );
      }
    })
  );
}
