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
     * Handle user input from terminal
     */
    handleInput(data) {
        // Will be implemented in Step 5
        console.log('Input handling placeholder:', data);
    }

    /**
     * Write output to terminal
     */
    writeOutput(data) {
        // Will be implemented in Step 5
        console.log('Output writing placeholder:', data);
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
