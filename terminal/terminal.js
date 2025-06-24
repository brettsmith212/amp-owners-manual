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
        this.filesystem = null;
        this.commandProcessor = null;
        this.completionSystem = null;
        this.pagerSystem = null;
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
                    background: '#0c0c0c',
                    foreground: '#c0c0c0',
                    cursor: '#808080',
                    cursorAccent: '#0c0c0c',
                    selection: 'rgba(128, 128, 128, 0.3)',
                    black: '#0c0c0c',
                    red: '#808080',
                    green: '#808080',
                    yellow: '#808080',
                    blue: '#808080',
                    magenta: '#808080',
                    cyan: '#808080',
                    white: '#c0c0c0',
                    brightBlack: '#404040',
                    brightRed: '#808080',
                    brightGreen: '#a0a0a0',
                    brightYellow: '#808080',
                    brightBlue: '#808080',
                    brightMagenta: '#808080',
                    brightCyan: '#808080',
                    brightWhite: '#ffffff'
                },
                fontFamily: '"Courier New", monospace',
                fontSize: 14,
                lineHeight: 1.4,
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

            // Initialize filesystem and command processor
            await this.initializeFilesystem();

            // Set initialization flag
            this.isInitialized = true;

            // Display welcome message
            this.terminal.writeln('Amp Owners Manual Terminal');
            this.terminal.writeln('Welcome to the interactive documentation terminal.');
            this.terminal.writeln('Type "help" for available commands.');
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
     * Initialize filesystem and command processor
     */
    async initializeFilesystem() {
        // Initialize virtual filesystem
        this.filesystem = new VirtualFilesystem();
        await this.filesystem.initialize();
        
        // Initialize command processor
        this.commandProcessor = new CommandProcessor(this.filesystem, this);
        
        // Initialize completion system
        if (typeof CompletionSystem !== 'undefined') {
            this.completionSystem = new CompletionSystem(this.filesystem, this.commandProcessor);
        } else {
            console.warn('CompletionSystem not available');
        }

        // Initialize pager system
        if (typeof PagerSystem !== 'undefined') {
            this.pagerSystem = new PagerSystem(this);
        } else {
            console.warn('PagerSystem not available');
        }
        
        console.log('Filesystem and command processor initialized');
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
        // Check if pager is active first
        if (this.pagerSystem && this.pagerSystem.isActivePager()) {
            const handled = this.pagerSystem.handleInput(data);
            if (handled) return; // Pager handled the input
        }

        const code = data.charCodeAt(0);
        
        // Handle special keys
        if (code === 13) { // Enter key
            this.processCommand().catch(error => {
                console.error('Command processing error:', error);
                this.terminal.writeln(`Error: ${error.message}`);
                this.showPrompt();
            });
        } else if (code === 9) { // Tab key
            this.handleTabCompletion();
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
     * Handle tab completion
     */
    handleTabCompletion() {
        if (!this.completionSystem) return;
        
        try {
            const completions = this.completionSystem.getCompletions(this.currentInput);
            const result = this.completionSystem.completeInput(this.currentInput, completions);
            
            if (result.hasMore && result.matches) {
                // Multiple matches - show them
                this.terminal.writeln(''); // Move to new line
                this.terminal.writeln(result.matches.join('  ')); // Show matches simply
                
                // Redraw prompt with completed input
                this.showPrompt();
                this.terminal.write(result.completed);
                this.currentInput = result.completed;
            } else {
                // Single match or common prefix - complete it
                const oldLength = this.currentInput.length;
                this.currentInput = result.completed;
                
                // Clear old input and write new
                for (let i = 0; i < oldLength; i++) {
                    this.terminal.write('\b \b');
                }
                this.terminal.write(this.currentInput);
            }
        } catch (error) {
            console.error('Tab completion error:', error);
        }
    }

    /**
     * Handle escape sequences (arrow keys, etc.)
     */
    handleEscapeSequence(data) {
        if (data.length >= 3) {
            const sequence = data.substring(1);
            
            if (sequence === '[A') { // Up arrow
                this.navigateHistory('up');
            } else if (sequence === '[B') { // Down arrow
                this.navigateHistory('down');
            }
            // Ignore other escape sequences for now
        }
    }

    /**
     * Navigate command history
     */
    navigateHistory(direction) {
        if (this.commandHistory.length === 0) return;
        
        if (direction === 'up') {
            if (this.historyIndex > 0) {
                this.historyIndex--;
            } else if (this.historyIndex === -1) {
                this.historyIndex = this.commandHistory.length - 1;
            }
        } else if (direction === 'down') {
            if (this.historyIndex < this.commandHistory.length - 1) {
                this.historyIndex++;
            } else {
                this.historyIndex = -1;
                this.replaceCurrentInput('');
                return;
            }
        }
        
        const historyCommand = this.commandHistory[this.historyIndex];
        this.replaceCurrentInput(historyCommand);
    }

    /**
     * Replace current input with new text
     */
    replaceCurrentInput(newInput) {
        // Clear current input
        for (let i = 0; i < this.currentInput.length; i++) {
            this.terminal.write('\b \b');
        }
        
        // Write new input
        this.currentInput = newInput;
        this.terminal.write(newInput);
    }

    /**
     * Process the current command
     */
    async processCommand() {
        const command = this.currentInput.trim();
        this.currentInput = '';
        
        // Handle clear command specially - clear immediately without showing command
        if (command === 'clear') {
            this.clear();
            this.showPrompt();
            return;
        }
        
        this.terminal.writeln(''); // New line
        
        if (command) {
            // Add to history
            this.commandHistory.push(command);
            this.historyIndex = this.commandHistory.length;
            
            // Execute command
            await this.executeCommand(command);
        } else {
            // Empty command, just show prompt
            this.showPrompt();
        }
    }

    /**
     * Execute a command
     */
    async executeCommand(command) {
        // Handle built-in terminal commands first
        if (command === 'exit') {
            // Exit terminal mode
            const event = new CustomEvent('exitTerminal');
            document.dispatchEvent(event);
            return;
        }
        
        // Use command processor for all other commands
        if (this.commandProcessor) {
            try {
                const result = await this.commandProcessor.processCommand(command);
                
                // Check if command used pager (like man pages)
                if (result.usePager) {
                    // Don't show prompt - pager is handling display
                    return;
                }
                
                if (result.output) {
                    // Handle multi-line output properly
                    const lines = result.output.split('\n');
                    lines.forEach(line => {
                        this.terminal.writeln(line);
                    });
                }
                if (!result.success && result.output) {
                    // Error message already included in output
                }
            } catch (error) {
                this.terminal.writeln(`Error: ${error.message}`);
            }
        } else {
            this.terminal.writeln('Terminal not properly initialized');
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
        if (this.terminal && this.isInitialized && this.filesystem) {
            const currentPath = this.filesystem.getCurrentDirectory();
            this.terminal.write(`root@amp:${currentPath} $ `);
        }
    }

    /**
     * Clear terminal screen
     */
    clear() {
        if (this.terminal) {
            this.terminal.reset();
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
