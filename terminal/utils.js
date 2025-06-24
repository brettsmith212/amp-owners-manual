/**
 * Terminal Utilities - Helper functions and utilities
 * 
 * This module provides utility functions for text formatting, path manipulation,
 * content processing, and other common terminal operations.
 */

class TerminalUtils {
    /**
     * Format text with ANSI color codes
     */
    static colorize(text, color) {
        const colors = {
            black: '\x1b[30m',
            red: '\x1b[31m',
            green: '\x1b[32m',
            yellow: '\x1b[33m',
            blue: '\x1b[34m',
            magenta: '\x1b[35m',
            cyan: '\x1b[36m',
            white: '\x1b[37m',
            gray: '\x1b[90m',
            brightRed: '\x1b[91m',
            brightGreen: '\x1b[92m',
            brightYellow: '\x1b[93m',
            brightBlue: '\x1b[94m',
            brightMagenta: '\x1b[95m',
            brightCyan: '\x1b[96m',
            brightWhite: '\x1b[97m',
            reset: '\x1b[0m'
        };

        if (colors[color]) {
            return colors[color] + text + colors.reset;
        }
        return text;
    }

    /**
     * Format text with bold styling
     */
    static bold(text) {
        return '\x1b[1m' + text + '\x1b[0m';
    }

    /**
     * Format text with underline styling
     */
    static underline(text) {
        return '\x1b[4m' + text + '\x1b[0m';
    }

    /**
     * Format text with italic styling (not widely supported)
     */
    static italic(text) {
        return '\x1b[3m' + text + '\x1b[0m';
    }

    /**
     * Normalize path by resolving . and .. components
     */
    static normalizePath(path) {
        const parts = path.split('/').filter(part => part !== '');
        const normalized = [];

        for (const part of parts) {
            if (part === '.') {
                continue; // Skip current directory
            } else if (part === '..') {
                normalized.pop(); // Go up one directory
            } else {
                normalized.push(part);
            }
        }

        return '/' + normalized.join('/');
    }

    /**
     * Join path components correctly
     */
    static joinPath(...parts) {
        return parts
            .filter(part => part && part !== '')
            .join('/')
            .replace(/\/+/g, '/')
            .replace(/\/$/, '') || '/';
    }

    /**
     * Get the parent directory of a path
     */
    static getParentPath(path) {
        if (path === '/') return '/';
        const normalized = this.normalizePath(path);
        const lastSlash = normalized.lastIndexOf('/');
        return lastSlash <= 0 ? '/' : normalized.substring(0, lastSlash);
    }

    /**
     * Get the filename from a path
     */
    static getFileName(path) {
        const lastSlash = path.lastIndexOf('/');
        return lastSlash >= 0 ? path.substring(lastSlash + 1) : path;
    }

    /**
     * Check if a path is absolute
     */
    static isAbsolutePath(path) {
        return path.startsWith('/');
    }

    /**
     * Escape HTML characters in text
     */
    static escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * Format file size in human readable format
     */
    static formatFileSize(bytes) {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${Math.round(size * 10) / 10}${units[unitIndex]}`;
    }

    /**
     * Format timestamp in human readable format
     */
    static formatTimestamp(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    }

    /**
     * Wrap text to specified width
     */
    static wrapText(text, width = 80) {
        const words = text.split(' ');
        const lines = [];
        let currentLine = '';

        for (const word of words) {
            if ((currentLine + word).length > width) {
                if (currentLine) {
                    lines.push(currentLine.trim());
                    currentLine = word + ' ';
                } else {
                    // Word is longer than width, just add it
                    lines.push(word);
                }
            } else {
                currentLine += word + ' ';
            }
        }

        if (currentLine) {
            lines.push(currentLine.trim());
        }

        return lines.join('\n');
    }

    /**
     * Convert markdown to terminal-friendly text
     */
    static markdownToTerminal(markdown) {
        // Will be enhanced in Step 8
        // Basic conversion for now
        let text = markdown
            // Remove markdown links but keep text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // Convert headers
            .replace(/^#{1,6}\s+(.+)$/gm, (match, title) => this.bold(title))
            // Convert bold
            .replace(/\*\*([^*]+)\*\*/g, (match, text) => this.bold(text))
            // Convert italic
            .replace(/\*([^*]+)\*/g, (match, text) => this.italic(text))
            // Convert inline code
            .replace(/`([^`]+)`/g, (match, code) => this.colorize(code, 'cyan'));

        return text;
    }

    /**
     * Paginate text for display
     */
    static paginateText(text, linesPerPage = 20) {
        const lines = text.split('\n');
        const pages = [];
        
        for (let i = 0; i < lines.length; i += linesPerPage) {
            pages.push(lines.slice(i, i + linesPerPage).join('\n'));
        }

        return pages;
    }

    /**
     * Generate a simple loading spinner
     */
    static createSpinner() {
        const frames = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
        let index = 0;
        
        return {
            next: () => frames[index++ % frames.length],
            reset: () => { index = 0; }
        };
    }

    /**
     * Debounce function for performance optimization
     */
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Throttle function for performance optimization
     */
    static throttle(func, limit) {
        let lastFunc;
        let lastRan;
        return function(...args) {
            if (!lastRan) {
                func(...args);
                lastRan = Date.now();
            } else {
                clearTimeout(lastFunc);
                lastFunc = setTimeout(() => {
                    if ((Date.now() - lastRan) >= limit) {
                        func(...args);
                        lastRan = Date.now();
                    }
                }, limit - (Date.now() - lastRan));
            }
        };
    }
}

// Export for use in other modules
window.TerminalUtils = TerminalUtils;
