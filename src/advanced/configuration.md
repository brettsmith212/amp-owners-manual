# Configuration

Amp can be configured through settings in VS Code (.vscode/settings.json) and the CLI configuration file. All settings use the `amp.` prefix.

## CLI Configuration Paths

The CLI configuration file location varies by operating system:

| Operating System | Path | Example |
|------------------|------|---------|
| **Windows** | `%APPDATA%\amp\settings.json` | `C:\Users\USERNAME\AppData\Roaming\amp\settings.json` |
| **macOS** | `~/.config/amp/settings.json` | `/Users/USERNAME/.config/amp/settings.json` |
| **Linux** | `~/.config/amp/settings.json` | `/home/USERNAME/.config/amp/settings.json` |

## Corporate Networks

When using the Amp CLI in corporate networks with proxy servers or custom certificates, set these standard Node.js environment variables in your shell profile or CI environment as needed:

```bash
export HTTP_PROXY=your-proxy-url
export HTTPS_PROXY=your-proxy-url
export NODE_EXTRA_CA_CERTS=/path/to/your/certificates.pem
```

## Core Settings

| Setting | Type | Default | Availability | Description |
|---------|------|---------|--------------|-------------|
| `amp.url` | string | - | VS Code & CLI | URL to the Amp server, usually `https://ampcode.com/` |
| `amp.notifications.enabled` | boolean | `true` | VS Code | Play notification sound when done or blocked |
| `amp.anthropic.thinking.enabled` | boolean | `true` | VS Code & CLI | Enable Claude's extended thinking capabilities |
| `amp.todos.enabled` | boolean | `true` | VS Code & CLI | Enable TODOs tracking for managing tasks |
| `amp.tools.disable` | array | `[]` | VS Code & CLI | Disable specific tools by name. Use 'builtin:toolname' to disable only the builtin tool with that name (allowing an MCP server to provide a tool by that name). |
| `amp.tools.stopTimeout` | number | `300` | VS Code & CLI | How many seconds to wait before canceling a running tool |
| `amp.debugLogs` | boolean | `false` | VS Code | Enable debug logging in the Amp output channel |
| `amp.ui.zoomLevel` | number | `1` | VS Code | Zoom level for the Amp user interface |

### Example for `amp.tools.disable`:
```json
[
  "read_file", 
  "create_file", 
  "edit_file", 
  "undo_edit", 
  "list_directory", 
  "glob", 
  "format_file", 
  "Grep", 
  "codebase_search", 
  "Bash", 
  "read_web_page", 
  "web_search", 
  "get_diagnostics", 
  "think", 
  "mermaid", 
  "todo_write", 
  "todo_read", 
  "Task", 
  "run_routine", 
  "builtin:edit_file"
]
```

## Terminal & Environment

| Setting | Type | Default | Availability | Description |
|---------|------|---------|--------------|-------------|
| `amp.terminal.commands.hide` | boolean | `true` | VS Code | Whether to hide the integrated VS Code terminal by default when starting commands |
| `amp.terminal.commands.environment` | string | `"vscode-terminal"` | VS Code & CLI | What environment to use when running terminal commands |
| `amp.terminal.commands.vscodeTerminal.detachTimeout` | number | `90` | VS Code | How many seconds to wait before detaching a running command to continue the conversation. The command continues to run in the background. This setting only has an effect when using the `vscode-terminal` environment |
| `amp.terminal.commands.nodeSpawn.loadProfile` | string | `"always"` | VS Code & CLI | Before running commands (including MCP servers), whether to load environment variables from the user's profile (`.bashrc`, `.zshrc`, `.envrc`) as visible from the workspace root directory |

### Options for `amp.terminal.commands.environment`:
- `vscode-terminal`
- `node-spawn`

### Options for `amp.terminal.commands.nodeSpawn.loadProfile`:
- `always`
- `never` 
- `daily`

## Advanced Settings

| Setting | Type | Default | Availability | Description |
|---------|------|---------|--------------|-------------|
| `amp.mcpServers` | object | - | VS Code & CLI | Model Context Protocol servers that expose tools. See [Custom Tools (MCP) documentation](../tools/custom-tools.md). |
| `amp.commands.allowlist` | array | `[]` | VS Code & CLI | Run specific terminal commands without waiting for user confirmation. See [Command Allowlisting documentation](../tools/command-allowlisting.md). |

### Example for `amp.commands.allowlist`:
```json
[
  "pnpm exec tsc --build", 
  "pnpm -C web check", 
  "pnpm -C server test"
]
```
