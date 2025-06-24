/**
 * Content Loader - Dynamic markdown content loading and caching
 * 
 * This module handles loading markdown content from the mdbook source files
 * and caching it for terminal display.
 */

class ContentLoader {
    constructor() {
        this.cache = new Map();
        this.loading = new Set(); // Track files currently being loaded
    }

    /**
     * Load markdown content from a source file
     * @param {string} sourcePath - The source path relative to the project root (e.g., 'src/introduction.md')
     * @returns {Promise<string>} The content of the file
     */
    async loadContent(sourcePath) {
        // Check if already cached
        if (this.cache.has(sourcePath)) {
            return this.cache.get(sourcePath);
        }

        // Check if already loading to prevent duplicate requests
        if (this.loading.has(sourcePath)) {
            // Wait for the other request to complete
            return new Promise((resolve) => {
                const checkLoading = () => {
                    if (!this.loading.has(sourcePath)) {
                        resolve(this.cache.get(sourcePath) || 'Error: Content not found');
                    } else {
                        setTimeout(checkLoading, 50);
                    }
                };
                checkLoading();
            });
        }

        this.loading.add(sourcePath);

        try {
            // mdbook only serves rendered HTML, so we fetch the HTML page and extract content
            const htmlPath = sourcePath.replace('src/', '').replace('.md', '.html');
            const response = await fetch(`/${htmlPath}`);

            if (!response.ok) {
                throw new Error(`Failed to load ${htmlPath}: ${response.status}`);
            }

            const content = await response.text();
            
            // If we got HTML, we need to extract the markdown-like content
            // For now, we'll store the raw content and handle formatting in display
            const processedContent = this.processContent(content, sourcePath);
            
            this.cache.set(sourcePath, processedContent);
            return processedContent;

        } catch (error) {
            console.error('Error loading content:', error);
            const errorContent = `Error loading ${sourcePath}: ${error.message}`;
            this.cache.set(sourcePath, errorContent);
            return errorContent;
        } finally {
            this.loading.delete(sourcePath);
        }
    }

    /**
     * Process and format content for terminal display
     * @param {string} content - Raw content from file
     * @param {string} sourcePath - Source path for context
     * @returns {string} Processed content
     */
    processContent(content, sourcePath) {
        // Basic markdown-to-terminal formatting
        let processed = content;
        
        // Extract content from mdbook HTML
        if (content.includes('<html>') || content.includes('<!DOCTYPE')) {
            // Extract content from HTML (mdbook structure)
            const parser = new DOMParser();
            const doc = parser.parseFromString(content, 'text/html');
            // mdbook uses #content as the main content area
            const mainContent = doc.querySelector('#content') || doc.querySelector('main') || doc.querySelector('.content') || doc.body;
            processed = mainContent ? mainContent.textContent || mainContent.innerText : content;
        }
        
        // Basic markdown cleanup for terminal display
        processed = processed
            // Remove markdown headers formatting but keep content
            .replace(/^#{1,6}\s+(.+)$/gm, '$1')
            // Remove markdown emphasis but keep content
            .replace(/\*\*(.+?)\*\*/g, '$1')
            .replace(/\*(.+?)\*/g, '$1')
            .replace(/_(.+?)_/g, '$1')
            // Remove markdown links but keep text
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // Remove code block markers but keep content
            .replace(/```[\s\S]*?\n([\s\S]*?)\n```/g, '$1')
            .replace(/`([^`]+)`/g, '$1')
            // Clean up extra whitespace
            .replace(/\n{3,}/g, '\n\n')
            .trim();
            
        return processed;
    }

    /**
     * Clear the content cache
     */
    clearCache() {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys())
        };
    }

    /**
     * Preload content for common files
     * @param {Array<string>} sourcePaths - Array of source paths to preload
     */
    async preloadContent(sourcePaths) {
        const loadPromises = sourcePaths.map(path => this.loadContent(path));
        try {
            await Promise.all(loadPromises);
            console.log(`Preloaded ${sourcePaths.length} files`);
        } catch (error) {
            console.error('Error during preloading:', error);
        }
    }
}

// Export for use in other modules
window.ContentLoader = ContentLoader;
