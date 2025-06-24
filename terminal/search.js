/**
 * Search System - Content search functionality
 * 
 * This module provides search capabilities across all documentation content
 * with various search methods and result formatting.
 */

class SearchSystem {
    constructor(filesystem) {
        this.filesystem = filesystem;
        this.searchCache = new Map();
    }

    /**
     * Search for content across all files
     */
    async searchContent(searchTerm, options = {}) {
        const {
            caseSensitive = false,
            maxResults = 20,
            includeContent = true
        } = options;

        const results = [];
        const searchRegex = new RegExp(
            caseSensitive ? searchTerm : searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 
            caseSensitive ? 'g' : 'gi'
        );

        // Get all files from filesystem
        const allFiles = this.getAllFiles();
        
        for (const file of allFiles) {
            try {
                // Load file content
                const content = await this.filesystem.contentLoader.loadContent(file.sourcePath);
                const lines = content.split('\n');
                
                const fileMatches = [];
                lines.forEach((line, lineNumber) => {
                    const matches = [...line.matchAll(searchRegex)];
                    if (matches.length > 0) {
                        fileMatches.push({
                            lineNumber: lineNumber + 1,
                            line: line.trim(),
                            matches: matches.length
                        });
                    }
                });

                if (fileMatches.length > 0) {
                    results.push({
                        file: file.path,
                        sourcePath: file.sourcePath,
                        totalMatches: fileMatches.reduce((sum, match) => sum + match.matches, 0),
                        matches: fileMatches.slice(0, 5) // Limit matches per file
                    });
                }

                // Stop if we have enough results
                if (results.length >= maxResults) {
                    break;
                }
            } catch (error) {
                console.warn(`Error searching file ${file.path}:`, error);
            }
        }

        return results;
    }

    /**
     * Get all files from the filesystem recursively
     */
    getAllFiles(node = null, path = '/') {
        if (!node) {
            node = this.filesystem.getPathInfo('/');
        }

        const files = [];
        
        if (node.type === 'file' && node.sourcePath) {
            files.push({
                path: node.path,
                name: node.name,
                sourcePath: node.sourcePath
            });
        } else if (node.type === 'directory' && node.children) {
            for (const [childName, child] of Object.entries(node.children)) {
                files.push(...this.getAllFiles(child, `${path}${childName}`));
            }
        }

        return files;
    }

    /**
     * Format search results for terminal display
     */
    formatSearchResults(results, searchTerm) {
        if (results.length === 0) {
            return `No matches found for "${searchTerm}"`;
        }

        let output = `Found ${results.length} file(s) with matches for "${searchTerm}":\n\n`;

        results.forEach((result, index) => {
            const totalMatches = result.totalMatches;
            const matchText = totalMatches === 1 ? 'match' : 'matches';
            
            output += `${result.file} (${totalMatches} ${matchText})\n`;
            
            result.matches.forEach(match => {
                const linePreview = match.line.length > 80 
                    ? match.line.substring(0, 77) + '...'
                    : match.line;
                output += `  ${match.lineNumber}: ${linePreview}\n`;
            });
            
            if (index < results.length - 1) {
                output += '\n';
            }
        });

        return output;
    }

    /**
     * Search for files by name pattern
     */
    findFilesByName(pattern) {
        const files = this.getAllFiles();
        const regex = new RegExp(pattern, 'i');
        
        return files.filter(file => 
            regex.test(file.name) || regex.test(file.path)
        );
    }

    /**
     * Get search statistics
     */
    getSearchStats() {
        const allFiles = this.getAllFiles();
        return {
            totalFiles: allFiles.length,
            cacheSize: this.searchCache.size
        };
    }
}

// Export for use in other modules
window.SearchSystem = SearchSystem;
