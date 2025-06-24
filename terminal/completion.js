/**
 * Completion System - Tab completion for commands and file paths
 * 
 * This module provides intelligent tab completion for terminal commands,
 * file paths, and directory navigation.
 */

class CompletionSystem {
    constructor(filesystem, commandProcessor) {
        this.filesystem = filesystem;
        this.commandProcessor = commandProcessor;
    }

    /**
     * Get completions for the current input
     */
    getCompletions(input) {
        const trimmed = input.trim();
        
        if (!trimmed) {
            // No input - return available commands
            return this.getCommandCompletions('');
        }

        const parts = this.parseInput(trimmed);
        
        if (parts.length === 1) {
            // Single word - could be command completion
            return this.getCommandCompletions(parts[0]);
        } else {
            // Multiple words - complete file/directory paths for the last argument
            const command = parts[0];
            const lastArg = parts[parts.length - 1];
            
            return this.getPathCompletions(lastArg, command);
        }
    }

    /**
     * Parse input into command parts
     */
    parseInput(input) {
        // Simple parsing - split on whitespace but preserve quoted strings
        const parts = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < input.length; i++) {
            const char = input[i];
            
            if (char === '"' || char === "'") {
                inQuotes = !inQuotes;
                current += char;
            } else if (char === ' ' && !inQuotes) {
                if (current) {
                    parts.push(current);
                    current = '';
                }
            } else {
                current += char;
            }
        }
        
        if (current) {
            parts.push(current);
        }
        
        return parts;
    }

    /**
     * Get command completions
     */
    getCommandCompletions(prefix) {
        const commands = this.commandProcessor.getAvailableCommands();
        const matches = commands.filter(cmd => cmd.startsWith(prefix));
        
        return {
            type: 'command',
            prefix: prefix,
            matches: matches,
            commonPrefix: this.findCommonPrefix(matches)
        };
    }

    /**
     * Get file/directory path completions
     */
    getPathCompletions(prefix, command) {
        // Handle quoted paths
        const cleanPrefix = prefix.replace(/^["']|["']$/g, '');
        const isQuoted = prefix !== cleanPrefix;
        
        // Resolve the directory to search in
        const lastSlash = cleanPrefix.lastIndexOf('/');
        let searchDir, filePrefix;
        
        if (lastSlash >= 0) {
            searchDir = cleanPrefix.substring(0, lastSlash + 1);
            filePrefix = cleanPrefix.substring(lastSlash + 1);
        } else {
            searchDir = '';
            filePrefix = cleanPrefix;
        }
        
        // Get directory listing
        const currentDir = this.filesystem.getCurrentDirectory();
        const targetDir = searchDir ? this.filesystem.resolvePath(searchDir) : currentDir;
        const dirInfo = this.filesystem.getPathInfo(targetDir);
        
        if (!dirInfo || dirInfo.type !== 'directory') {
            return {
                type: 'path',
                prefix: prefix,
                matches: [],
                commonPrefix: prefix
            };
        }

        // Find matching files/directories
        const matches = [];
        if (dirInfo.children) {
            for (const [name, child] of Object.entries(dirInfo.children)) {
                if (name.startsWith(filePrefix)) {
                    let matchName = searchDir + name;
                    
                    // Add trailing slash for directories
                    if (child.type === 'directory') {
                        matchName += '/';
                    }
                    
                    // Add quotes if needed
                    if (isQuoted || matchName.includes(' ')) {
                        matchName = `"${matchName}"`;
                    }
                    
                    matches.push(matchName);
                }
            }
        }

        return {
            type: 'path',
            prefix: prefix,
            matches: matches,
            commonPrefix: this.findCommonPrefix(matches) || prefix
        };
    }

    /**
     * Find the longest common prefix among matches
     */
    findCommonPrefix(matches) {
        if (matches.length === 0) return '';
        if (matches.length === 1) return matches[0];
        
        let prefix = matches[0];
        for (let i = 1; i < matches.length; i++) {
            while (prefix && !matches[i].startsWith(prefix)) {
                prefix = prefix.slice(0, -1);
            }
        }
        
        return prefix;
    }

    /**
     * Complete the input with the best match
     */
    completeInput(input, completions) {
        if (completions.matches.length === 0) {
            return { completed: input, hasMore: false };
        }

        if (completions.matches.length === 1) {
            // Single match - complete it fully
            const match = completions.matches[0];
            const parts = this.parseInput(input.trim());
            
            if (parts.length <= 1) {
                // Completing command
                return { 
                    completed: match + ' ', 
                    hasMore: false 
                };
            } else {
                // Completing file path - replace last argument
                parts[parts.length - 1] = match;
                return { 
                    completed: parts.join(' ') + (match.endsWith('/') ? '' : ' '), 
                    hasMore: false 
                };
            }
        } else {
            // Multiple matches - complete to common prefix
            const commonPrefix = completions.commonPrefix;
            const parts = this.parseInput(input.trim());
            
            if (parts.length <= 1) {
                // Completing command
                return { 
                    completed: commonPrefix, 
                    hasMore: true,
                    matches: completions.matches
                };
            } else {
                // Completing file path
                parts[parts.length - 1] = commonPrefix;
                return { 
                    completed: parts.join(' '), 
                    hasMore: true,
                    matches: completions.matches
                };
            }
        }
    }

    /**
     * Format completion matches for display
     */
    formatMatches(matches, maxColumns = 4) {
        if (matches.length === 0) return '';
        
        // Calculate column width
        const maxWidth = Math.max(...matches.map(m => m.length));
        const terminalWidth = 80; // Assume 80 character terminal
        const columnWidth = Math.min(maxWidth + 2, Math.floor(terminalWidth / maxColumns));
        const actualColumns = Math.floor(terminalWidth / columnWidth);
        
        let result = '\n';
        for (let i = 0; i < matches.length; i += actualColumns) {
            const row = matches.slice(i, i + actualColumns);
            result += row.join('  ') + '\n';
        }
        
        return result;
    }
}

// Export for use in other modules
window.CompletionSystem = CompletionSystem;
