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
        this.helpSystem = null;
        this.searchSystem = null;
        this.manPageSystem = null;
        this.registerCommands();
        this.initializeHelp();
        this.initializeSearch();
        this.initializeManPages();
    }

    /**
     * Initialize help system
     */
    initializeHelp() {
        if (typeof HelpSystem !== 'undefined') {
            this.helpSystem = new HelpSystem();
        } else {
            console.warn('HelpSystem not available');
        }
    }

    /**
     * Initialize search system
     */
    initializeSearch() {
        if (typeof SearchSystem !== 'undefined') {
            this.searchSystem = new SearchSystem(this.filesystem);
        } else {
            console.warn('SearchSystem not available');
        }
    }

    /**
     * Initialize man page system
     */
    initializeManPages() {
        if (typeof ManPageSystem !== 'undefined') {
            this.manPageSystem = new ManPageSystem();
        } else {
            console.warn('ManPageSystem not available');
        }
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
        if (args.length === 0) {
            return { success: false, output: 'cat: missing file operand' };
        }
        
        const filename = args[0];
        const fileNode = this.filesystem.getFileNode(filename);
        
        if (!fileNode.success) {
            return { success: false, output: `cat: ${filename}: ${fileNode.message}` };
        }
        
        if (fileNode.node.type === 'directory') {
            return { success: false, output: `cat: ${filename}: Is a directory` };
        }
        
        // Load content using ContentLoader
        if (!fileNode.node.sourcePath) {
            return { success: false, output: `cat: ${filename}: No source path available` };
        }
        
        if (!this.filesystem.contentLoader) {
            return { success: false, output: `cat: ${filename}: Content loader not initialized` };
        }
        
        try {
            const content = await this.filesystem.contentLoader.loadContent(fileNode.node.sourcePath);
            return { success: true, output: content };
        } catch (error) {
            return { success: false, output: `cat: ${filename}: ${error.message}` };
        }
    }

    /**
     * Display file content with paging
     */
    async displayFilePaged(args) {
        if (args.length === 0) {
            return { success: false, output: 'less: missing file operand' };
        }
        
        const filename = args[0];
        const fileNode = this.filesystem.getFileNode(filename);
        
        if (!fileNode.success) {
            return { success: false, output: `less: ${filename}: ${fileNode.message}` };
        }
        
        if (fileNode.node.type === 'directory') {
            return { success: false, output: `less: ${filename}: Is a directory` };
        }
        
        if (!fileNode.node.sourcePath) {
            return { success: false, output: `less: ${filename}: No source path available` };
        }
        
        if (!this.filesystem.contentLoader) {
            return { success: false, output: `less: ${filename}: Content loader not initialized` };
        }
        
        try {
            const content = await this.filesystem.contentLoader.loadContent(fileNode.node.sourcePath);
            
            // Use pager for less command if available
            if (this.terminal.pagerSystem) {
                this.terminal.pagerSystem.enterPager(content, filename);
                return { success: true, output: '', usePager: true };
            } else {
                // Fallback to direct output
                return { success: true, output: content + '\n(END)' };
            }
        } catch (error) {
            return { success: false, output: `less: ${filename}: ${error.message}` };
        }
    }

    /**
     * Display first lines of file
     */
    async displayFileHead(args) {
        if (args.length === 0) {
            return { success: false, output: 'head: missing file operand' };
        }
        
        // Parse options (-n number)
        let lines = 10; // default
        let filename = args[0];
        
        if (args[0] === '-n' && args.length >= 3) {
            lines = parseInt(args[1]);
            filename = args[2];
            if (isNaN(lines) || lines < 0) {
                return { success: false, output: 'head: invalid number of lines' };
            }
        }
        
        const fileNode = this.filesystem.getFileNode(filename);
        
        if (!fileNode.success) {
            return { success: false, output: `head: ${filename}: ${fileNode.message}` };
        }
        
        if (fileNode.node.type === 'directory') {
            return { success: false, output: `head: ${filename}: Is a directory` };
        }
        
        try {
            const content = await this.filesystem.contentLoader.loadContent(fileNode.node.sourcePath);
            const contentLines = content.split('\n');
            const displayLines = contentLines.slice(0, lines);
            return { success: true, output: displayLines.join('\n') };
        } catch (error) {
            return { success: false, output: `head: ${filename}: ${error.message}` };
        }
    }

    /**
     * Display last lines of file
     */
    async displayFileTail(args) {
        if (args.length === 0) {
            return { success: false, output: 'tail: missing file operand' };
        }
        
        // Parse options (-n number)
        let lines = 10; // default
        let filename = args[0];
        
        if (args[0] === '-n' && args.length >= 3) {
            lines = parseInt(args[1]);
            filename = args[2];
            if (isNaN(lines) || lines < 0) {
                return { success: false, output: 'tail: invalid number of lines' };
            }
        }
        
        const fileNode = this.filesystem.getFileNode(filename);
        
        if (!fileNode.success) {
            return { success: false, output: `tail: ${filename}: ${fileNode.message}` };
        }
        
        if (fileNode.node.type === 'directory') {
            return { success: false, output: `tail: ${filename}: Is a directory` };
        }
        
        try {
            const content = await this.filesystem.contentLoader.loadContent(fileNode.node.sourcePath);
            const contentLines = content.split('\n');
            const displayLines = contentLines.slice(-lines);
            return { success: true, output: displayLines.join('\n') };
        } catch (error) {
            return { success: false, output: `tail: ${filename}: ${error.message}` };
        }
    }

    /**
     * Show help information
     */
    async showHelp(args) {
        if (!this.helpSystem) {
            return { success: false, output: 'Help system not available' };
        }

        if (args.length === 0) {
            // Show general help
            const helpText = this.helpSystem.getGeneralHelp();
            return { success: true, output: helpText };
        } else {
            // Show help for specific command
            const commandName = args[0];
            const commandHelp = this.helpSystem.getCommandHelp(commandName);
            
            if (commandHelp) {
                return { success: true, output: commandHelp };
            } else {
                return { success: false, output: `No help available for command: ${commandName}` };
            }
        }
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
        const startPath = args.length > 0 ? args[0] : this.filesystem.getCurrentDirectory();
        
        try {
            const treeOutput = this.generateTree(startPath);
            return { success: true, output: treeOutput };
        } catch (error) {
            return { success: false, output: `tree: ${error.message}` };
        }
    }

    /**
     * Generate tree structure display
     */
    generateTree(startPath, prefix = '', isLast = true) {
        const resolvedPath = this.filesystem.resolvePath(startPath);
        const pathInfo = this.filesystem.getPathInfo(resolvedPath);
        
        if (!pathInfo) {
            throw new Error(`${startPath}: No such file or directory`);
        }
        
        let result = '';
        const currentName = pathInfo.name || resolvedPath.split('/').pop() || '/';
        
        if (pathInfo.type === 'directory') {
            result += `${currentName}/\n`;
            
            if (pathInfo.children) {
                const childEntries = Object.entries(pathInfo.children);
                const sortedChildren = childEntries.sort(([,a], [,b]) => {
                    // Directories first, then files, both alphabetically
                    if (a.type !== b.type) {
                        return a.type === 'directory' ? -1 : 1;
                    }
                    return a.name.localeCompare(b.name);
                });
                
                sortedChildren.forEach(([name, child], index) => {
                    const isLastChild = index === sortedChildren.length - 1;
                    const childPrefix = prefix + (isLast ? '    ' : '│   ');
                    const connector = isLastChild ? '└── ' : '├── ';
                    
                    result += prefix + connector;
                    
                    if (child.type === 'directory') {
                        result += this.generateTree(child.path, childPrefix, isLastChild);
                    } else {
                        result += `${child.name}\n`;
                    }
                });
            }
        } else {
            result += `${currentName}\n`;
        }
        
        return result;
    }

    /**
     * Find content
     */
    async findContent(args) {
        if (args.length === 0) {
            return { success: false, output: 'find: missing search term' };
        }

        if (!this.searchSystem) {
            return { success: false, output: 'find: search system not available' };
        }

        const searchTerm = args.join(' '); // Join all args to support multi-word searches
        
        try {
            const results = await this.searchSystem.searchContent(searchTerm, {
                maxResults: 10,
                caseSensitive: false
            });
            
            const formattedResults = this.searchSystem.formatSearchResults(results, searchTerm);
            return { success: true, output: formattedResults };
        } catch (error) {
            return { success: false, output: `find: ${error.message}` };
        }
    }

    /**
     * Show manual page
     */
    async showManPage(args) {
        if (args.length === 0) {
            return { 
                success: false, 
                output: 'What manual page do you want?\nTry: man amp, man commands, man terminal' 
            };
        }

        if (!this.manPageSystem) {
            return { success: false, output: 'Manual system not available' };
        }

        const topic = args[0].toLowerCase();
        const manPage = this.manPageSystem.getManPage(topic);

        if (!manPage) {
            const availablePages = this.manPageSystem.getAvailablePages();
            return { 
                success: false, 
                output: `No manual entry for ${topic}\nAvailable pages: ${availablePages.join(', ')}` 
            };
        }

        const formattedContent = this.manPageSystem.formatManPage(manPage);
        
        // Use pager for man pages if available
        if (this.terminal.pagerSystem) {
            this.terminal.pagerSystem.enterPager(formattedContent, `Manual page ${topic.toUpperCase()}(1)`);
            return { success: true, output: '', usePager: true };
        } else {
            // Fallback to direct output
            return { success: true, output: formattedContent };
        }
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
