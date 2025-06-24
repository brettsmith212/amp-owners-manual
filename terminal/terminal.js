/**
 * Terminal Controller - Main terminal emulator management
 * 
 * This module handles the xterm.js terminal instance, input/output processing,
 * and coordination between the UI and command system.
 */

class TerminalController {
    constructor() {
        this.terminal = null;
        this.fitAddon = null;
        this.webLinksAddon = null;
        this.isInitialized = false;
        this.currentDirectory = '/';
        this.commandHistory = [];
        this.historyIndex = -1;
        this.currentInput = '';
        this.promptString = '$ ';
    }

    /**
     * Initialize the terminal instance and addons
     */
    async initialize(container) {
        try {
            // Create terminal instance with configuration
            this.terminal = new Terminal({
                theme: {
                    background: '#001100',
                    foreground: '#00ff00',
                    cursor: '#00ff00',
                    cursorAccent: '#001100',
                    selection: 'rgba(0, 255, 0, 0.3)',
                    black: '#001100',
                    red: '#ff0000',
                    green: '#00ff00',
                    yellow: '#ffff00',
                    blue: '#0066ff',
                    magenta: '#ff00ff',
                    cyan: '#00ffff',
                    white: '#ffffff'
                },
                fontFamily: '"Courier New", monospace',
                fontSize: 14,
                lineHeight: 1.2,
                cursorBlink: true,
                cursorStyle: 'block',
                bellStyle: 'none',
                scrollback: 1000,
                cols: 80,
                rows: 24
            });

            // Initialize addons
            this.fitAddon = new FitAddon.FitAddon();
            this.webLinksAddon = new WebLinksAddon.WebLinksAddon();

            // Load addons
            this.terminal.loadAddon(this.fitAddon);
            this.terminal.loadAddon(this.webLinksAddon);

            // Open terminal in container
            this.terminal.open(container);

            // Fit terminal to container
            this.fitAddon.fit();

            // Handle window resize
            window.addEventListener('resize', () => {
                if (this.terminal && this.fitAddon) {
                    this.fitAddon.fit();
                }
            });

            // Set initialization flag
            this.isInitialized = true;

            // Display welcome message
            this.terminal.writeln('\x1b[32mAmp Owners Manual Terminal\x1b[0m');
            this.terminal.writeln('\x1b[36mWelcome to the interactive documentation terminal.\x1b[0m');
            this.terminal.writeln('\x1b[33mType "help" for available commands.\x1b[0m');
            this.terminal.writeln('');

            // Set up input handling
            this.setupInputHandling();

            // Show initial prompt
            this.showPrompt();

            console.log('Terminal initialized successfully');
            return true;
        } catch (error) {
            console.error('Failed to initialize terminal:', error);
            return false;
        }
    }

    /**
     * Set up terminal input handling
     */
    setupInputHandling() {
        if (!this.terminal) return;
        
        // Handle keyboard input
        this.terminal.onData(data => {
            this.handleInput(data);
        });
    }

    /**
     * Handle user input from terminal
     */
    handleInput(data) {
        const code = data.charCodeAt(0);
        
        // Handle special keys
        if (code === 13) { // Enter key
            this.processCommand();
        } else if (code === 127) { // Backspace
            this.handleBackspace();
        } else if (code === 3) { // Ctrl+C
            this.handleInterrupt();
        } else if (code === 27) { // Escape sequences (arrow keys, etc.)
            this.handleEscapeSequence(data);
        } else if (code >= 32 && code <= 126) { // Printable characters
            this.addToInput(data);
        }
        // Ignore other control characters
    }

    /**
     * Add character to current input line
     */
    addToInput(char) {
        this.currentInput += char;
        this.terminal.write(char);
    }

    /**
     * Handle backspace key
     */
    handleBackspace() {
        if (this.currentInput.length > 0) {
            this.currentInput = this.currentInput.slice(0, -1);
            this.terminal.write('\b \b'); // Move back, space, move back
        }
    }

    /**
     * Handle Ctrl+C interrupt
     */
    handleInterrupt() {
        this.terminal.writeln('^C');
        this.currentInput = '';
        this.showPrompt();
    }

    /**
     * Handle escape sequences (arrow keys, etc.)
     */
    handleEscapeSequence(data) {
        // For now, ignore escape sequences
        // Command history navigation will be implemented in Step 10
    }

    /**
     * Process the current command
     */
    processCommand() {
        this.terminal.writeln(''); // New line
        
        const command = this.currentInput.trim();
        this.currentInput = '';
        
        if (command) {
            // Add to history
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
            
            // Execute command (placeholder for now)
            this.executeCommand(command);
        } else {
            // Empty command, just show prompt
            this.showPrompt();
        }
    }

    /**
     * Execute a command
     */
    executeCommand(command) {
        if (command === 'help') {
            this.terminal.writeln('\x1b[32mAvailable commands:\x1b[0m');
            this.terminal.writeln('  help    - Show this help message');
            this.terminal.writeln('  clear   - Clear the terminal screen');
            this.terminal.writeln('  exit    - Exit terminal mode');
            this.terminal.writeln('');
        } else if (command === 'clear') {
            this.clear();
        } else if (command === 'exit') {
            // Exit terminal mode
            const event = new CustomEvent('exitTerminal');
            document.dispatchEvent(event);
            return;
        } else {
            this.terminal.writeln(`\x1b[31mCommand not found: ${command}\x1b[0m`);
            this.terminal.writeln('Type "help" for available commands.');
        }
        
        this.showPrompt();
    }

    /**
     * Write output to terminal
     */
    writeOutput(data) {
        if (this.terminal && this.isInitialized) {
            this.terminal.write(data);
        }
    }

    /**
     * Display command prompt
     */
    showPrompt() {
        if (this.terminal && this.isInitialized) {
            this.terminal.write('\x1b[32m$ \x1b[0m');
        }
    }

    /**
     * Clear terminal screen
     */
    clear() {
        if (this.terminal) {
            this.terminal.clear();
        }
    }

    /**
     * Cleanup terminal resources
     */
    destroy() {
        if (this.terminal) {
            this.terminal.dispose();
            this.terminal = null;
        }
    }
}

// Export for use in other modules
window.TerminalController = TerminalController;
