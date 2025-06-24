/**
 * Pager System - Interactive content viewer with scrolling
 * 
 * This module provides a less-like pager for viewing long content
 * with keyboard navigation (j/k, arrows, q to quit).
 */

class PagerSystem {
    constructor(terminal) {
        this.terminal = terminal;
        this.content = '';
        this.lines = [];
        this.currentLine = 0;
        this.terminalRows = 24; // Will be updated dynamically
        this.isActive = false;
        this.statusLine = '';
    }

    /**
     * Enter pager mode with content
     */
    enterPager(content, title = '') {
        this.content = content;
        this.lines = content.split('\n');
        this.currentLine = 0;
        this.isActive = true;
        this.statusLine = title;
        
        // Update terminal rows (leave room for status line)
        this.terminalRows = this.terminal.terminal.rows - 1;
        
        // Clear screen and display content
        this.terminal.terminal.clear();
        this.displayPage();
    }

    /**
     * Exit pager mode
     */
    exitPager() {
        this.isActive = false;
        this.content = '';
        this.lines = [];
        this.currentLine = 0;
        
        // Clear screen and return to normal prompt
        this.terminal.terminal.clear();
        this.terminal.showPrompt();
    }

    /**
     * Handle pager input
     */
    handleInput(data) {
        if (!this.isActive) return false;
        
        const char = data.toLowerCase();
        const code = data.charCodeAt(0);
        
        if (char === 'q') {
            // Quit pager
            this.exitPager();
            return true;
        } else if (char === 'j' || code === 27) {
            // Handle j or arrow down (escape sequence)
            if (code === 27 && data.length >= 3 && data.substring(1) === '[B') {
                this.scrollDown();
                return true;
            } else if (char === 'j') {
                this.scrollDown();
                return true;
            }
        } else if (char === 'k' || code === 27) {
            // Handle k or arrow up (escape sequence)
            if (code === 27 && data.length >= 3 && data.substring(1) === '[A') {
                this.scrollUp();
                return true;
            } else if (char === 'k') {
                this.scrollUp();
                return true;
            }
        } else if (char === ' ') {
            // Space for page down
            this.pageDown();
            return true;
        } else if (char === 'b') {
            // b for page up
            this.pageUp();
            return true;
        } else if (char === 'g') {
            // g for go to top
            this.goToTop();
            return true;
        } else if (char === 'G') {
            // G for go to bottom
            this.goToBottom();
            return true;
        }
        
        return false; // Input not handled
    }

    /**
     * Scroll down one line
     */
    scrollDown() {
        if (this.currentLine + this.terminalRows < this.lines.length) {
            this.currentLine++;
            this.displayPage();
        }
    }

    /**
     * Scroll up one line
     */
    scrollUp() {
        if (this.currentLine > 0) {
            this.currentLine--;
            this.displayPage();
        }
    }

    /**
     * Scroll down one page
     */
    pageDown() {
        const newLine = Math.min(
            this.currentLine + this.terminalRows - 1,
            this.lines.length - this.terminalRows
        );
        if (newLine !== this.currentLine) {
            this.currentLine = newLine;
            this.displayPage();
        }
    }

    /**
     * Scroll up one page
     */
    pageUp() {
        const newLine = Math.max(this.currentLine - this.terminalRows + 1, 0);
        if (newLine !== this.currentLine) {
            this.currentLine = newLine;
            this.displayPage();
        }
    }

    /**
     * Go to top of content
     */
    goToTop() {
        if (this.currentLine !== 0) {
            this.currentLine = 0;
            this.displayPage();
        }
    }

    /**
     * Go to bottom of content
     */
    goToBottom() {
        const newLine = Math.max(this.lines.length - this.terminalRows, 0);
        if (newLine !== this.currentLine) {
            this.currentLine = newLine;
            this.displayPage();
        }
    }

    /**
     * Display current page
     */
    displayPage() {
        // Clear terminal
        this.terminal.terminal.clear();
        
        // Calculate visible lines (leave space for status)
        const maxContentLines = this.terminalRows - 2; // Extra space for status
        const endLine = Math.min(this.currentLine + maxContentLines, this.lines.length);
        const visibleLines = this.lines.slice(this.currentLine, endLine);
        
        // Display content
        visibleLines.forEach(line => {
            this.terminal.terminal.writeln(line);
        });
        
        // Add blank line before status
        this.terminal.terminal.writeln('');
        
        // Simple status without escape sequences
        this.displaySimpleStatus();
    }

    /**
     * Display status line with navigation info
     */
    displayStatusLine() {
        const totalLines = this.lines.length;
        const maxContentLines = this.terminalRows - 1;
        const viewEnd = Math.min(this.currentLine + maxContentLines, totalLines);
        
        let status = '';
        
        if (totalLines <= maxContentLines) {
            // All content fits on screen
            status = `(END)`;
        } else if (this.currentLine === 0) {
            // At the top
            const percentage = Math.round((viewEnd / totalLines) * 100);
            status = `${this.statusLine} (${percentage}%)`;
        } else if (viewEnd >= totalLines) {
            // At the bottom
            status = `(END)`;
        } else {
            // In the middle
            const percentage = Math.round((viewEnd / totalLines) * 100);
            status = `${this.statusLine} (${percentage}%)`;
        }
        
        // Add navigation hints for first view
        if (this.currentLine === 0 && totalLines > maxContentLines) {
            status += ' - j/k or ↑/↓ to scroll, q to quit';
        }
        
        // Write status line with white bar (reverse video)
        const termWidth = this.terminal.terminal.cols || 80;
        const paddedStatus = status.padEnd(termWidth).substring(0, termWidth);
        this.terminal.terminal.write(`\x1b[7m${paddedStatus}\x1b[0m`);
    }

    /**
     * Display simple status with white background
     */
    displaySimpleStatus() {
        const totalLines = this.lines.length;
        const maxContentLines = this.terminalRows - 2;
        const viewEnd = Math.min(this.currentLine + maxContentLines, totalLines);
        
        let status = '';
        
        if (totalLines <= maxContentLines) {
            status = `--- (END) ---`;
        } else if (viewEnd >= totalLines) {
            status = `--- (END) ---`;
        } else {
            const percentage = Math.round((viewEnd / totalLines) * 100);
            status = `--- ${this.statusLine} (${percentage}%) ---`;
        }
        
        if (totalLines > maxContentLines) {
            status += ' j/k ↑/↓ to scroll, q to quit';
        }
        
        // Write status with white background (reverse video)
        const termWidth = this.terminal.terminal.cols || 80;
        const paddedStatus = status.padEnd(termWidth).substring(0, termWidth);
        this.terminal.terminal.write(`\x1b[7m${paddedStatus}\x1b[0m\r\n`);
    }

    /**
     * Check if pager is currently active
     */
    isActivePager() {
        return this.isActive;
    }
}

// Export for use in other modules
window.PagerSystem = PagerSystem;
