/**
 * Man Pages System - Traditional Unix manual page formatting
 * 
 * This module provides beautifully formatted man pages for Amp documentation
 * with proper Unix conventions and visual appeal.
 */

class ManPageSystem {
    constructor() {
        this.pages = new Map();
        this.initializeManPages();
    }

    /**
     * Initialize all available man pages
     */
    initializeManPages() {
        // Main Amp manual page
        this.pages.set('amp', {
            name: 'AMP',
            section: '1',
            title: 'Amp Owners Manual',
            content: this.createAmpManPage()
        });

        // Commands reference
        this.pages.set('commands', {
            name: 'AMP-COMMANDS',
            section: '1',
            title: 'Amp Terminal Commands',
            content: this.createCommandsManPage()
        });

        // Terminal interface guide
        this.pages.set('terminal', {
            name: 'AMP-TERMINAL',
            section: '1',
            title: 'Amp Terminal Interface',
            content: this.createTerminalManPage()
        });
    }

    /**
     * Create the main Amp manual page
     */
    createAmpManPage() {
        return `
AMP(1)                          Amp Owners Manual                         AMP(1)

NAME
       amp - agentic coding tool built by Sourcegraph

SYNOPSIS
       amp [options] [command]

DESCRIPTION
       Amp is an agentic coding tool built by Sourcegraph that runs in VS Code 
       (and compatible forks like Cursor, Windsurf, and VSCodium) and as a 
       command-line tool. It's also multiplayer — you can share threads and 
       collaborate with your team.

PRINCIPLES
       Amp operates on four core principles:

       1. UNCONSTRAINED TOKEN USAGE
          Amp is unconstrained in token usage (and therefore cost). Our sole 
          incentive is to make it valuable, not to match the cost of a 
          subscription.

       2. NO MODEL SELECTOR, ALWAYS THE BEST MODELS
          You don't pick models, we do. Instead of offering selectors and 
          checkboxes and building for the lowest common denominator, Amp is 
          built to use the full capabilities of the best models.

       3. RAW POWER ACCESS
          We assume that you want to access the raw power these models have to 
          offer. In a sense, when you're using Amp, you aren't using Amp — 
          you're talking directly to a model and Amp is the shell around your 
          conversation with the model.

       4. BUILT TO CHANGE
          Products that are overfit on the capabilities of today's models will 
          be obsolete in a matter of months.

INSTALLATION
       VS Code Extension:
              Install from the VS Code Marketplace or compatible editors:
              https://marketplace.visualstudio.com/items?itemName=sourcegraph.amp

       Command Line:
              npm install -g @sourcegraph/amp

GETTING STARTED
       1. Install the Amp extension in your preferred editor
       2. Sign in with your Sourcegraph account
       3. Start a new conversation or thread
       4. Begin coding with AI assistance

FEATURES
       • Unlimited token usage and advanced model access
       • Multi-file editing and refactoring
       • Real-time collaboration and thread sharing
       • Context-aware code suggestions
       • Integration with existing development workflows

TERMINAL INTERFACE
       This documentation includes an interactive terminal interface. Use 
       standard Unix commands to navigate:

       ls             List directory contents
       cd <dir>       Change directory
       cat <file>     Display file contents
       help           Show available commands
       man <topic>    Display manual pages

DOCUMENTATION STRUCTURE
       /                      Root directory
       ├── introduction.md    Getting started guide
       ├── getting-started.md Installation and setup
       ├── using-amp/         Core usage documentation
       ├── core/              Advanced features
       ├── advanced/          Expert-level topics
       ├── account/           Account management
       └── reference/         API and technical reference

SEE ALSO
       man commands(1), man terminal(1)

       Online documentation: https://github.com/brettsmith212/amp-owners-manual
       VS Code Marketplace: https://marketplace.visualstudio.com/items?itemName=sourcegraph.amp
       Sourcegraph: https://sourcegraph.com

AUTHOR
       Built by Sourcegraph <https://sourcegraph.com>
       Documentation by Brett Smith

COPYRIGHT
       This documentation is maintained by the Amp community.

Amp Owners Manual              ${new Date().toISOString().split('T')[0]}                         AMP(1)
`;
    }

    /**
     * Create the commands reference manual
     */
    createCommandsManPage() {
        return `
AMP-COMMANDS(1)                 Amp Terminal Commands               AMP-COMMANDS(1)

NAME
       amp-commands - terminal command reference for Amp documentation

SYNOPSIS
       command [options] [arguments]

DESCRIPTION
       The Amp documentation terminal provides a Unix-like command interface 
       for exploring documentation. All standard navigation and file viewing 
       commands are supported.

NAVIGATION COMMANDS
       ls [path]
              List directory contents. Shows directories with trailing slash (/)
              and files with their names. Supports relative and absolute paths.

       cd <path>
              Change current directory. Special paths:
              .    Current directory
              ..   Parent directory  
              /    Root directory
              ~    Home directory (same as /)

       pwd    Print current working directory path.

       tree [path]
              Display directory structure as a tree with Unicode box characters.
              Shows hierarchical view of directories and files.

FILE VIEWING COMMANDS
       cat <file>
              Display entire file content. Shows raw markdown with formatting 
              preserved including headers (#), emphasis (**), and code blocks.

       head [-n lines] <file>
              Display first lines of a file (default: 10 lines).
              Use -n to specify number of lines.

       tail [-n lines] <file>  
              Display last lines of a file (default: 10 lines).
              Use -n to specify number of lines.

       less <file>
              Display file content with paging. Shows content followed by (END)
              marker. Future versions will support interactive paging.

SEARCH AND HELP COMMANDS
       find <term>
              Search for content across all documentation files. Shows matching
              files with line numbers and context. Supports multi-word searches
              with quotes: find "getting started"

       help [command]
              Show help information. Without arguments, displays all commands.
              With a command name, shows detailed help for that specific command.

       man <topic>
              Display manual page for the specified topic. Available topics:
              amp, commands, terminal

UTILITY COMMANDS
       clear  Clear the terminal screen completely.

       exit   Exit terminal mode and return to documentation view.

TAB COMPLETION
       The terminal supports intelligent tab completion:

       • Command completion: Type partial command and press Tab
       • File completion: Complete file and directory names
       • Multiple matches: Shows all options when ambiguous

COMMAND HISTORY
       Navigate command history with arrow keys:

       ↑      Previous command in history
       ↓      Next command in history

EXAMPLES
       Basic navigation:
              ls
              cd using-amp
              pwd
              tree

       File viewing:
              cat introduction.md
              head -n 5 getting-started.md
              tail introduction.md
              less using-amp/features.md

       Search and help:
              find "installation"
              find "VS Code"
              help cat
              man amp

       Tab completion:
              cat int<Tab>           → cat introduction.md
              cd us<Tab>             → cd using-amp/
              help c<Tab>            → shows: cat, cd, clear

NOTES
       • All file paths are relative to current directory unless absolute
       • Tab completion works for commands, files, and directories
       • Command history persists during terminal session
       • File content is fetched from GitHub raw files for latest content

SEE ALSO
       man amp(1), man terminal(1)

Amp Terminal Commands          ${new Date().toISOString().split('T')[0]}           AMP-COMMANDS(1)
`;
    }

    /**
     * Create the terminal interface manual
     */
    createTerminalManPage() {
        return `
AMP-TERMINAL(1)                 Amp Terminal Interface             AMP-TERMINAL(1)

NAME
       amp-terminal - interactive terminal interface for Amp documentation

SYNOPSIS
       Click "Terminal Mode" to enter the interactive documentation terminal.

DESCRIPTION
       The Amp documentation includes a full-featured terminal emulator that 
       provides a Unix-like command interface for exploring documentation. 
       This creates an immersive experience for developers familiar with 
       command-line interfaces.

FEATURES
       XTERM.JS TERMINAL EMULATOR
              Professional terminal emulation with proper keyboard handling,
              cursor positioning, and text rendering.

       VIRTUAL FILESYSTEM
              Documentation is mapped to a Unix-like filesystem structure
              with directories and files corresponding to documentation sections.

       TAB COMPLETION
              Intelligent completion for commands and file paths. Press Tab
              to complete or see available options.

       COMMAND HISTORY
              Navigate previous commands with up/down arrow keys. History
              persists throughout the terminal session.

       REAL CONTENT
              File content is fetched from the live documentation repository
              with markdown formatting preserved.

INTERFACE ELEMENTS
       TERMINAL HEADER
              Shows current mode and provides exit button to return to 
              documentation view.

       COMMAND PROMPT
              Format: root@amp:/current/path $ 
              Shows current directory and awaits command input.

       SCROLLABLE OUTPUT
              Terminal maintains fixed height with internal scrolling for
              long command output.

KEYBOARD SHORTCUTS
       Tab            Complete commands and file paths
       ↑ / ↓          Navigate command history  
       Ctrl+C         Interrupt current command / clear input
       Ctrl+L         Clear screen (same as 'clear' command)
       Enter          Execute command
       Backspace      Delete character

VISUAL DESIGN
       RETRO AESTHETIC
              Monochrome color scheme with green-on-black terminal colors
              reminiscent of classic computer terminals.

       TYPOGRAPHY  
              Monospace fonts (Courier New) for authentic terminal appearance
              with proper character spacing and alignment.

       RESPONSIVE LAYOUT
              Terminal adapts to window size while maintaining readability
              and proper text formatting.

NAVIGATION PATTERNS
       UNIX-LIKE COMMANDS
              Standard commands work as expected: ls, cd, pwd, cat, etc.
              Path resolution follows Unix conventions with / separator.

       RELATIVE PATHS
              Navigate with relative paths: cd ../core, ls using-amp/
              Use . for current and .. for parent directory.

       ABSOLUTE PATHS  
              Reference files from root: cat /introduction.md
              Use / for root directory navigation.

CONTENT ACCESS
       RAW MARKDOWN
              Files display with original markdown formatting including
              headers (#), emphasis (**), links, and code blocks.

       LIVE CONTENT
              Content fetched from GitHub repository ensures documentation
              is always current and accurate.

       SEARCH CAPABILITY
              Full-text search across all documentation with the find command.
              Results show context and line numbers.

TROUBLESHOOTING
       COMMAND NOT FOUND
              Use 'help' to see available commands or 'man commands' for
              detailed reference.

       FILE NOT FOUND  
              Use 'ls' to see available files or 'tree' to see full structure.
              Verify file path and spelling.

       COMPLETION ISSUES
              Ensure you're in correct directory. Use 'pwd' to check location
              and 'cd /' to return to root if needed.

EXAMPLES
       Enter terminal mode:
              Click "Terminal Mode" button in documentation interface

       Basic exploration:
              help                   # See all commands
              ls                     # List current directory
              tree                   # See full structure
              cd using-amp           # Enter subdirectory
              cat features.md        # Read file content

       Advanced usage:
              find "installation"    # Search documentation
              man amp                # Read main manual
              help cat               # Get command help

EXIT
       Use 'exit' command or click the exit button to return to normal
       documentation view.

SEE ALSO
       man amp(1), man commands(1)

Amp Terminal Interface         ${new Date().toISOString().split('T')[0]}          AMP-TERMINAL(1)
`;
    }

    /**
     * Get a formatted man page
     */
    getManPage(topic) {
        const page = this.pages.get(topic.toLowerCase());
        if (!page) {
            return null;
        }

        return {
            name: page.name,
            section: page.section,
            title: page.title,
            content: page.content.trim()
        };
    }

    /**
     * Get list of available man pages
     */
    getAvailablePages() {
        return Array.from(this.pages.keys()).sort();
    }

    /**
     * Format man page content for terminal display
     */
    formatManPage(page) {
        if (!page) return null;
        
        // Clean up the content and ensure proper spacing
        let content = page.content;
        
        // Ensure consistent line spacing
        content = content.replace(/\n{3,}/g, '\n\n');
        
        return content;
    }
}

// Export for use in other modules
window.ManPageSystem = ManPageSystem;
