/**
 * Command Processor - Terminal command handlers
 * 
 * This module processes user commands and coordinates with the filesystem
 * to provide Unix-like command functionality for documentation navigation.
 */

class CommandProcessor {
    constructor(filesystem, terminal) {
        this.filesystem = filesystem;
        this.terminal = terminal;
        this.commands = new Map();
        this.registerCommands();
    }

    /**
     * Register all available commands
     */
    registerCommands() {
        // Navigation commands
        this.commands.set('ls', this.listDirectory.bind(this));
        this.commands.set('cd', this.changeDirectory.bind(this));
        this.commands.set('pwd', this.printWorkingDirectory.bind(this));
        
        // File viewing commands
        this.commands.set('cat', this.displayFile.bind(this));
        this.commands.set('less', this.displayFilePaged.bind(this));
        this.commands.set('head', this.displayFileHead.bind(this));
        this.commands.set('tail', this.displayFileTail.bind(this));
        
        // Utility commands
        this.commands.set('help', this.showHelp.bind(this));
        this.commands.set('clear', this.clearScreen.bind(this));
        this.commands.set('tree', this.showTree.bind(this));
        this.commands.set('find', this.findContent.bind(this));
        this.commands.set('man', this.showManPage.bind(this));
        this.commands.set('grep', this.grepContent.bind(this));
    }

    /**
     * Process a command line input
     */
    async processCommand(input) {
        const trimmed = input.trim();
        if (!trimmed) {
            return { success: true, output: '' };
        }

        const parts = this.parseCommand(trimmed);
        const command = parts[0];
        const args = parts.slice(1);

        if (this.commands.has(command)) {
            try {
                return await this.commands.get(command)(args);
            } catch (error) {
                return {
                    success: false,
                    output: `Error executing ${command}: ${error.message}`
                };
            }
        } else {
            return {
                success: false,
                output: `Command not found: ${command}. Type 'help' for available commands.`
            };
        }
    }

    /**
     * Parse command line into command and arguments
     */
    parseCommand(input) {
        // Simple parsing - can be enhanced later for quoted arguments
        return input.split(/\s+/);
    }

    /**
     * List directory contents
     */
    async listDirectory(args) {
        const path = args.length > 0 ? args[0] : null;
        const result = this.filesystem.listDirectory(path);
        
        if (!result.success) {
            return { success: false, output: result.message };
        }
        
        if (result.items.length === 0) {
            return { success: true, output: '' };
        }
        
        // Format output like Unix ls
        const output = result.items.map(item => {
            return item.isDirectory ? `${item.name}/` : item.name;
        }).join('\n');
        
        return { success: true, output: output };
    }

    /**
     * Change directory
     */
    async changeDirectory(args) {
        if (args.length === 0) {
            // cd with no arguments goes to home (root)
            const result = this.filesystem.changeDirectory('/');
            return { 
                success: result.success, 
                output: result.message 
            };
        }
        
        const path = args[0];
        const result = this.filesystem.changeDirectory(path);
        
        return { 
            success: result.success, 
            output: result.message 
        };
    }

    /**
     * Print working directory
     */
    async printWorkingDirectory(args) {
        // Will be implemented in Step 7
        return { 
            success: true, 
            output: this.filesystem.getCurrentDirectory() 
        };
    }

    /**
     * Display file content
     */
    async displayFile(args) {
        // Will be implemented in Step 8
        console.log('cat command placeholder:', args);
        return { success: true, output: 'File content placeholder' };
    }

    /**
     * Display file content with paging
     */
    async displayFilePaged(args) {
        // Will be implemented in Step 8
        console.log('less command placeholder:', args);
        return { success: true, output: 'Paged file content placeholder' };
    }

    /**
     * Display first lines of file
     */
    async displayFileHead(args) {
        // Will be implemented in Step 8
        console.log('head command placeholder:', args);
        return { success: true, output: 'File head placeholder' };
    }

    /**
     * Display last lines of file
     */
    async displayFileTail(args) {
        // Will be implemented in Step 8
        console.log('tail command placeholder:', args);
        return { success: true, output: 'File tail placeholder' };
    }

    /**
     * Show help information
     */
    async showHelp(args) {
        // Will be implemented in Step 9
        const helpText = `
Available commands:
  ls [path]     - List directory contents
  cd <path>     - Change directory
  pwd           - Print working directory
  cat <file>    - Display file content
  less <file>   - Display file content with paging
  head <file>   - Display first lines of file
  tail <file>   - Display last lines of file
  tree          - Show directory tree
  find <term>   - Search for content
  man <topic>   - Show manual page
  grep <term>   - Search in files
  help          - Show this help
  clear         - Clear screen
        `;
        return { success: true, output: helpText.trim() };
    }

    /**
     * Clear terminal screen
     */
    async clearScreen(args) {
        this.terminal.clear();
        return { success: true, output: '' };
    }

    /**
     * Show directory tree
     */
    async showTree(args) {
        // Will be implemented in Step 9
        console.log('tree command placeholder:', args);
        return { success: true, output: 'Directory tree placeholder' };
    }

    /**
     * Find content
     */
    async findContent(args) {
        // Will be implemented in Step 9
        console.log('find command placeholder:', args);
        return { success: true, output: 'Search results placeholder' };
    }

    /**
     * Show manual page
     */
    async showManPage(args) {
        // Will be implemented in Step 11
        console.log('man command placeholder:', args);
        return { success: true, output: 'Manual page placeholder' };
    }

    /**
     * Search content with grep
     */
    async grepContent(args) {
        // Will be implemented in Step 12
        console.log('grep command placeholder:', args);
        return { success: true, output: 'Grep results placeholder' };
    }

    /**
     * Get list of available commands
     */
    getAvailableCommands() {
        return Array.from(this.commands.keys()).sort();
    }
}

// Export for use in other modules
window.CommandProcessor = CommandProcessor;
