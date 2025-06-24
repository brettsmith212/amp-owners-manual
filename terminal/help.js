/**
 * Help System - Terminal command documentation and help
 * 
 * This module provides comprehensive help documentation for all terminal commands
 * with examples and usage information.
 */

class HelpSystem {
    constructor() {
        this.commands = new Map();
        this.initializeHelp();
    }

    /**
     * Initialize help documentation for all commands
     */
    initializeHelp() {
        // Navigation commands
        this.commands.set('ls', {
            name: 'ls',
            syntax: 'ls [path]',
            description: 'List directory contents',
            examples: [
                'ls                    # List current directory',
                'ls using-amp          # List contents of using-amp directory',
                'ls /                  # List root directory'
            ],
            options: []
        });

        this.commands.set('cd', {
            name: 'cd',
            syntax: 'cd [path]',
            description: 'Change current directory',
            examples: [
                'cd using-amp          # Change to using-amp directory',
                'cd ..                 # Go up one directory',
                'cd /                  # Go to root directory',
                'cd ~                  # Go to home (root) directory'
            ],
            options: []
        });

        this.commands.set('pwd', {
            name: 'pwd',
            syntax: 'pwd',
            description: 'Print current working directory',
            examples: [
                'pwd                   # Show current directory path'
            ],
            options: []
        });

        // File viewing commands
        this.commands.set('cat', {
            name: 'cat',
            syntax: 'cat <file>',
            description: 'Display entire file content',
            examples: [
                'cat introduction.md   # Display introduction file',
                'cat getting-started.md # Display getting started guide'
            ],
            options: []
        });

        this.commands.set('head', {
            name: 'head',
            syntax: 'head [-n lines] <file>',
            description: 'Display first lines of a file (default: 10)',
            examples: [
                'head introduction.md  # Show first 10 lines',
                'head -n 5 intro.md    # Show first 5 lines'
            ],
            options: [
                '-n lines             # Number of lines to display'
            ]
        });

        this.commands.set('tail', {
            name: 'tail',
            syntax: 'tail [-n lines] <file>',
            description: 'Display last lines of a file (default: 10)',
            examples: [
                'tail introduction.md  # Show last 10 lines',
                'tail -n 3 intro.md    # Show last 3 lines'
            ],
            options: [
                '-n lines             # Number of lines to display'
            ]
        });

        this.commands.set('less', {
            name: 'less',
            syntax: 'less <file>',
            description: 'Display file content with paging',
            examples: [
                'less introduction.md  # View file with paging'
            ],
            options: []
        });

        // Utility commands
        this.commands.set('tree', {
            name: 'tree',
            syntax: 'tree [path]',
            description: 'Display directory structure as a tree',
            examples: [
                'tree                  # Show tree of current directory',
                'tree using-amp        # Show tree of using-amp directory'
            ],
            options: []
        });

        this.commands.set('find', {
            name: 'find',
            syntax: 'find <term>',
            description: 'Search for content across all documentation',
            examples: [
                'find "configuration"  # Search for "configuration"',
                'find installation     # Search for "installation"'
            ],
            options: []
        });

        this.commands.set('help', {
            name: 'help',
            syntax: 'help [command]',
            description: 'Show help information',
            examples: [
                'help                  # Show all commands',
                'help cat              # Show help for cat command'
            ],
            options: []
        });

        this.commands.set('man', {
            name: 'man',
            syntax: 'man <topic>',
            description: 'Show manual page for topic',
            examples: [
                'man amp               # Show Amp manual',
                'man commands          # Show commands reference'
            ],
            options: []
        });

        this.commands.set('clear', {
            name: 'clear',
            syntax: 'clear',
            description: 'Clear the terminal screen',
            examples: [
                'clear                 # Clear screen'
            ],
            options: []
        });

        this.commands.set('exit', {
            name: 'exit',
            syntax: 'exit',
            description: 'Exit terminal mode',
            examples: [
                'exit                  # Return to documentation view'
            ],
            options: []
        });
    }

    /**
     * Get help for a specific command
     */
    getCommandHelp(commandName) {
        const cmd = this.commands.get(commandName);
        if (!cmd) {
            return null;
        }

        let help = `${cmd.name} - ${cmd.description}\n\n`;
        help += `SYNTAX:\n  ${cmd.syntax}\n\n`;
        
        if (cmd.options.length > 0) {
            help += `OPTIONS:\n`;
            cmd.options.forEach(option => {
                help += `  ${option}\n`;
            });
            help += '\n';
        }

        help += `EXAMPLES:\n`;
        cmd.examples.forEach(example => {
            help += `  ${example}\n`;
        });

        return help;
    }

    /**
     * Get general help with all commands
     */
    getGeneralHelp() {
        let help = `Amp Owners Manual Terminal - Available Commands\n\n`;
        
        help += `NAVIGATION:\n`;
        help += `  ls [path]             List directory contents\n`;
        help += `  cd <path>             Change directory\n`;
        help += `  pwd                   Print working directory\n`;
        help += `  tree [path]           Show directory tree\n\n`;

        help += `FILE VIEWING:\n`;
        help += `  cat <file>            Display file content\n`;
        help += `  head [-n] <file>      Show first lines of file\n`;
        help += `  tail [-n] <file>      Show last lines of file\n`;
        help += `  less <file>           View file with paging\n\n`;

        help += `SEARCH & HELP:\n`;
        help += `  find <term>           Search documentation\n`;
        help += `  help [command]        Show help information\n`;
        help += `  man <topic>           Show manual pages\n\n`;

        help += `UTILITIES:\n`;
        help += `  clear                 Clear screen\n`;
        help += `  exit                  Exit terminal mode\n\n`;

        help += `TIPS:\n`;
        help += `  - Use quotes for multi-word search terms: find "getting started"\n`;
        help += `  - Tab completion is available for commands and files\n`;
        help += `  - Use arrow keys to navigate command history\n`;
        help += `  - Type 'help <command>' for detailed command help\n`;

        return help;
    }

    /**
     * Get list of all available commands
     */
    getAvailableCommands() {
        return Array.from(this.commands.keys()).sort();
    }
}

// Export for use in other modules
window.HelpSystem = HelpSystem;
