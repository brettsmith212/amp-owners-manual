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
            // Try to fetch from GitHub raw files first
            const githubRawUrl = `https://raw.githubusercontent.com/brettsmith212/amp-owners-manual/main/${sourcePath}`;
            let response = await fetch(githubRawUrl);
            let isRawMarkdown = false;
            
            if (response.ok) {
                isRawMarkdown = true;
            } else {
                // Fallback: fetch rendered HTML and extract content
                const htmlPath = sourcePath.replace('src/', '').replace('.md', '.html');
                response = await fetch(`/${htmlPath}`);
                
                if (!response.ok) {
                    throw new Error(`Failed to load ${htmlPath}: ${response.status}`);
                }
            }

            const content = await response.text();
            
            // Process content based on type
            const processedContent = this.processContent(content, sourcePath, isRawMarkdown);
            
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
     * @param {boolean} isRawMarkdown - Whether content is raw markdown or HTML
     * @returns {string} Processed content
     */
    processContent(content, sourcePath, isRawMarkdown = false) {
        let processed = content;
        
        if (isRawMarkdown) {
            // Raw markdown - keep as-is, just clean up excessive whitespace
            processed = content
                .replace(/\r\n/g, '\n') // Normalize line endings
                .replace(/\n{4,}/g, '\n\n\n'); // Limit to max 3 consecutive newlines
        } else {
            // Extract content from mdbook HTML
            if (content.includes('<html>') || content.includes('<!DOCTYPE')) {
                // Extract content from HTML (mdbook structure)
                const parser = new DOMParser();
                const doc = parser.parseFromString(content, 'text/html');
                // mdbook uses #content as the main content area
                const mainContent = doc.querySelector('#content') || doc.querySelector('main') || doc.querySelector('.content') || doc.body;
                processed = mainContent ? mainContent.textContent || mainContent.innerText : content;
                
                // Since we extracted from HTML, we lost original markdown formatting
                // Keep the text as-is without aggressive cleanup
                processed = processed
                    .replace(/\r\n/g, '\n') // Normalize line endings
                    .replace(/\n{4,}/g, '\n\n\n') // Limit excessive newlines
                    .trim();
            }
        }
            
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
