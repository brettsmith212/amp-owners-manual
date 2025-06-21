# Tools

Tools are what the underlying model uses to assist with tasks. For the highest quality results we recommend you use a curated set of tools, with prompts adjusted to fit the underlying model.

## Built-in Tools

Amp comes with a curated set of built-in tools specifically designed for coding. You can find the list of built-in tools inside Amp's extension settings.

## Custom Tools (MCP)

You can extend Amp by adding tools from MCP (Model Context Protocol) servers.

You can configure MCP servers in amp.mcpServers in your configuration file. In VS Code, you can also press + Add MCP Server in Amp's Settings interface.

For best results:

* Use MCP servers that expose a small number of high-level tools with high-quality descriptions.
* Disable MCP tools that you aren't using, by hovering over a tool name in Amp's Settings interface and clicking so it's shown as `tool_name`, or by adding them to `amp.tools.disable` in your [configuration file](../configuration.md).

### Example Configuration for MCP Servers

Stdio MCP servers (running a local command):

```json
"amp.mcpServers": {
 "playwright": {
 "command": "npx",
 "args": ["-y", "@playwright/mcp@latest", "--headless", "--isolated"]
 },
 "postgres": {
 "command": "npx",
 "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://localhost/amp"],
 "env": {
 "PGDATABASE": "mydb"
 }
 }
}
```

HTTPS/SSE MCP server (connecting to a remote server):

```json
"amp.mcpServers": {
 "semgrep": {
 "url": "https://mcp.semgrep.ai/sse"
 }
}
```

### JetBrains

You can connect the Amp CLI or VS Code extension to JetBrains IDEs using MCP. This gives Amp access to JetBrains IDE diagnostics, which help the agent iterate against compiler errors and other information provided by the JetBrains IDE.

To use Amp with JetBrains IDEs:

1. Install the JetBrains MCP Server plugin into the JetBrains IDE. Ensure the JetBrains IDE is running with the plugin installed.
2. Add npx -y @jetbrains/mcp-proxy as an MCP server to Amp. In VS Code, you can add this in the MCP Servers settings panel in the editor or add the following to VS Code settings. In the CLI, add the following to your configuration file:

```json
"amp.mcpServers": {
 "jetbrains": {
 "command": "npx",
 "args": ["-y", "@jetbrains/mcp-proxy"]
 }
}
```

## Command Allowlisting

Amp has a built-in safety system specifically for terminal commands that determines which commands require explicit permission before execution.

By default, Amp automatically allows certain read-only and safe commands like ls, cat, and git status. Common development commands like go test, cargo build, and pnpm run build are also pre-approved. For all other commands, Amp will prompt for permission before execution to protect your system.

You can configure Amp to execute additional commands without prompting for permission each time by adding them to the "amp.commands.allowlist" array in your extension or CLI settings:

```json
"amp.commands.allowlist": [
 "pnpm exec tsc --build",
 "pnpm -C web check",
 "pnpm -C server test"
]
```

Both the Amp extension and CLI use this same setting format. You can use simple command patterns like make build or wildcards like npm run * --test to allow multiple similar commands.
