# Building a Web Terminal Emulator with XTerm.js

A comprehensive guide to creating a fully-functional terminal emulator in the browser using xterm.js.

## What is XTerm.js?

[XTerm.js](https://xtermjs.org/) is a powerful terminal emulator library for the web that provides:

- Full VT100/VT200/VT300 terminal compatibility
- Hardware-accelerated rendering
- Rich text formatting and colors
- Mouse and keyboard input handling
- Extensive addon ecosystem

## Installation

```bash
npm install @xterm/xterm
npm install @xterm/addon-fit      # Auto-sizing
npm install @xterm/addon-web-links # Clickable URLs
```

Import the CSS for proper styling:

```javascript
import "@xterm/xterm/css/xterm.css";
```

## Basic Terminal Setup

### 1. Create the Terminal Instance

```javascript
import { Terminal } from "@xterm/xterm";

const terminal = new Terminal({
  cursorBlink: true,
  fontFamily: '"Cascadia Code", Consolas, "Liberation Mono", Menlo, monospace',
  fontSize: 14,
  lineHeight: 1.2,
  rows: 24,
  cols: 80,
});
```

### 2. Mount to DOM Element

```javascript
// Get your container element
const terminalContainer = document.getElementById("terminal-container");

// Open terminal in the container
terminal.open(terminalContainer);
```

### 3. Basic Input/Output

```javascript
// Handle user input
terminal.onData((data) => {
  // Send data to your backend/shell process
  sendToBackend(data);
});

// Write output to terminal
function displayOutput(data) {
  terminal.write(data);
}

// Write a line with automatic newline
function displayLine(text) {
  terminal.writeln(text);
}
```

## Essential Addons

### Fit Addon - Auto-sizing

```javascript
import { FitAddon } from "@xterm/addon-fit";

const fitAddon = new FitAddon();
terminal.loadAddon(fitAddon);

// Fit terminal to container size
fitAddon.fit();

// Auto-fit on window resize
window.addEventListener("resize", () => {
  fitAddon.fit();
});
```

### Web Links Addon - Clickable URLs

```javascript
import { WebLinksAddon } from "@xterm/addon-web-links";

const webLinksAddon = new WebLinksAddon();
terminal.loadAddon(webLinksAddon);
```

## Styling and Theming

### Custom Theme

```javascript
const terminal = new Terminal({
  theme: {
    background: "#1a1b26",
    foreground: "#c0caf5",
    cursor: "#c0caf5",
    black: "#15161e",
    red: "#f7768e",
    green: "#9ece6a",
    yellow: "#e0af68",
    blue: "#7aa2f7",
    magenta: "#bb9af7",
    cyan: "#7dcfff",
    white: "#a9b1d6",
    brightBlack: "#414868",
    brightRed: "#f7768e",
    brightGreen: "#9ece6a",
    brightYellow: "#e0af68",
    brightBlue: "#7aa2f7",
    brightMagenta: "#bb9af7",
    brightCyan: "#7dcfff",
    brightWhite: "#c0caf5",
  },
});
```

### CSS Styling

```css
.terminal-container {
  width: 100%;
  height: 400px;
  background: #1a1b26;
  border-radius: 8px;
  padding: 16px;
  overflow: hidden;
}

.xterm-viewport {
  background-color: transparent !important;
}

.xterm-screen {
  background-color: transparent !important;
}
```

## Handling Resize Events

### Responsive Terminal

```javascript
// Handle terminal resize events
terminal.onResize(({ cols, rows }) => {
  console.log(`Terminal resized to ${cols}x${rows}`);
  // Notify your backend about size change
  notifyBackendResize(cols, rows);
});

// Debounced resize function
let resizeTimeout;
function handleContainerResize() {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  resizeTimeout = setTimeout(() => {
    fitAddon.fit();
  }, 100);
}

// Use ResizeObserver for container changes
const resizeObserver = new ResizeObserver(handleContainerResize);
resizeObserver.observe(terminalContainer);
```

## Advanced Input Handling

### Keyboard Shortcuts

```javascript
// Handle special key combinations
terminal.attachCustomKeyEventHandler((event) => {
  if (event.ctrlKey) {
    switch (event.key) {
      case "c":
        // Handle Ctrl+C
        sendSignal("SIGINT");
        return false; // Prevent default
      case "z":
        // Handle Ctrl+Z
        sendSignal("SIGTSTP");
        return false;
      case "l":
        // Handle Ctrl+L (clear screen)
        terminal.clear();
        return false;
    }
  }
  return true; // Allow default handling
});
```

### Mouse Support

```javascript
const terminal = new Terminal({
  // Enable mouse reporting
  mouseEventsIgnoreSendKeys: false,

  // Handle mouse events
  onMouseEvent: (event) => {
    // Process mouse clicks, selections, etc.
    handleMouseEvent(event);
  },
});
```

## Connection Status Indicator

### Visual Status Display

```javascript
function createStatusIndicator() {
  const statusBar = document.createElement("div");
  statusBar.className = "terminal-status";
  statusBar.innerHTML = `
    <div class="status-dot disconnected"></div>
    <span class="status-text">Disconnected</span>
    <span class="terminal-size">80x24</span>
  `;
  return statusBar;
}

function updateConnectionStatus(connected) {
  const dot = document.querySelector(".status-dot");
  const text = document.querySelector(".status-text");

  if (connected) {
    dot.className = "status-dot connected";
    text.textContent = "Connected";
  } else {
    dot.className = "status-dot disconnected";
    text.textContent = "Disconnected";
  }
}
```

```css
.terminal-status {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 12px;
  color: #ccc;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 8px;
}

.status-dot.connected {
  background: #4ade80;
  animation: pulse 2s infinite;
}

.status-dot.disconnected {
  background: #ef4444;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.terminal-size {
  margin-left: auto;
  font-family: monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 6px;
  border-radius: 3px;
}
```

## Backend Communication

### WebSocket Integration Pattern

```javascript
class TerminalWebSocket {
  constructor(url, terminal) {
    this.terminal = terminal;
    this.ws = new WebSocket(url);
    this.setupEventHandlers();
  }

  setupEventHandlers() {
    this.ws.onopen = () => {
      console.log("Terminal connected");
      updateConnectionStatus(true);
    };

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case "output":
          this.terminal.write(data.content);
          break;
        case "clear":
          this.terminal.clear();
          break;
        case "resize":
          this.terminal.resize(data.cols, data.rows);
          break;
      }
    };

    this.ws.onclose = () => {
      console.log("Terminal disconnected");
      updateConnectionStatus(false);
    };

    this.ws.onerror = (error) => {
      console.error("Terminal error:", error);
      this.terminal.writeln("\r\n\x1b[31mConnection error\x1b[0m");
    };
  }

  sendInput(data) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "input",
          data: data,
        })
      );
    }
  }

  sendResize(cols, rows) {
    if (this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(
        JSON.stringify({
          type: "resize",
          cols: cols,
          rows: rows,
        })
      );
    }
  }
}
```

## Complete Example

### HTML Structure

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Web Terminal</title>
    <link rel="stylesheet" href="node_modules/@xterm/xterm/css/xterm.css" />
    <style>
      body {
        margin: 0;
        padding: 20px;
        background: #1a1a1a;
        font-family: Arial, sans-serif;
      }

      .terminal-wrapper {
        max-width: 1000px;
        margin: 0 auto;
        background: #2d3748;
        border-radius: 8px;
        overflow: hidden;
      }

      .terminal-container {
        height: 500px;
        padding: 20px;
      }
    </style>
  </head>
  <body>
    <div class="terminal-wrapper">
      <div id="terminal-status"></div>
      <div id="terminal-container"></div>
    </div>

    <script type="module" src="terminal.js"></script>
  </body>
</html>
```

### JavaScript Implementation

```javascript
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { WebLinksAddon } from "@xterm/addon-web-links";

class WebTerminal {
  constructor(containerId, options = {}) {
    this.container = document.getElementById(containerId);
    this.terminal = new Terminal({
      cursorBlink: true,
      fontFamily: '"Cascadia Code", Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.2,
      theme: {
        background: "#1a1b26",
        foreground: "#c0caf5",
        cursor: "#c0caf5",
      },
      ...options,
    });

    this.setupAddons();
    this.setupEventHandlers();
    this.mount();
  }

  setupAddons() {
    this.fitAddon = new FitAddon();
    this.webLinksAddon = new WebLinksAddon();

    this.terminal.loadAddon(this.fitAddon);
    this.terminal.loadAddon(this.webLinksAddon);
  }

  setupEventHandlers() {
    // Handle input
    this.terminal.onData((data) => {
      this.handleInput(data);
    });

    // Handle resize
    this.terminal.onResize(({ cols, rows }) => {
      this.handleResize(cols, rows);
    });

    // Window resize
    window.addEventListener("resize", () => {
      setTimeout(() => this.fitAddon.fit(), 10);
    });
  }

  mount() {
    this.terminal.open(this.container);
    setTimeout(() => this.fitAddon.fit(), 10);
  }

  handleInput(data) {
    // Override this method to handle input
    console.log("Input:", data);
  }

  handleResize(cols, rows) {
    // Override this method to handle resize
    console.log("Resize:", cols, rows);
  }

  write(data) {
    this.terminal.write(data);
  }

  writeln(data) {
    this.terminal.writeln(data);
  }

  clear() {
    this.terminal.clear();
  }

  focus() {
    this.terminal.focus();
  }
}

// Usage
const terminal = new WebTerminal("terminal-container");

// Example: Echo input back to terminal
terminal.handleInput = (data) => {
  terminal.write(data);
};

// Welcome message
terminal.writeln("Welcome to Web Terminal!");
terminal.writeln("Type something to see it echoed back.");
terminal.write("$ ");
```

## Best Practices

### Performance

- Use `fit()` sparingly - debounce resize events
- Limit terminal buffer size for long-running sessions
- Consider virtualizing very large outputs

### Accessibility

- Ensure keyboard navigation works properly
- Provide screen reader support where needed
- Use semantic HTML structure around the terminal

### Security

- Always validate and sanitize input from terminals
- Be careful with ANSI escape sequences that could be malicious
- Implement proper authentication for terminal access

### User Experience

- Show connection status clearly
- Handle network disconnections gracefully
- Provide keyboard shortcuts for common operations
- Make the terminal responsive to different screen sizes

## Additional Resources

- [XTerm.js Official Documentation](https://xtermjs.org/)
- [XTerm.js GitHub Repository](https://github.com/xtermjs/xterm.js)
- [XTerm.js API Reference](https://xtermjs.org/docs/api/)
- [Terminal Escape Sequences](https://invisible-island.net/xterm/ctlseqs/ctlseqs.html)

This guide provides the foundation for building a professional web-based terminal emulator. Customize the styling, add your own backend communication layer, and extend with additional features as needed for your specific use case.
