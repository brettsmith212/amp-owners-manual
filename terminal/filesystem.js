/**
 * Virtual Filesystem - Documentation structure mapping
 * 
 * This module creates a virtual filesystem that maps the mdbook documentation
 * structure to a Unix-like directory tree for terminal navigation.
 */

class VirtualFilesystem {
    constructor() {
        this.root = {
            type: 'directory',
            name: '/',
            children: {},
            content: null,
            path: '/'
        };
        this.currentPath = '/';
        this.contentLoader = new ContentLoader();
    }

    /**
     * Initialize filesystem structure from documentation
     */
    async initialize() {
        console.log('Initializing virtual filesystem...');
        this.createDocumentationStructure();
    }

    /**
     * Create the actual documentation structure based on mdbook organization
     */
    createDocumentationStructure() {
        this.root.children = {
            'introduction.md': {
                type: 'file',
                name: 'introduction.md',
                content: null, // Will be loaded dynamically
                path: '/introduction.md',
                sourcePath: 'src/introduction.md'
            },
            'getting-started.md': {
                type: 'file',
                name: 'getting-started.md',
                content: null,
                path: '/getting-started.md',
                sourcePath: 'src/getting-started.md'
            },
            'using-amp': {
                type: 'directory',
                name: 'using-amp',
                children: {
                    'prompting.md': {
                        type: 'file',
                        name: 'prompting.md',
                        content: null,
                        path: '/using-amp/prompting.md',
                        sourcePath: 'src/using-amp/prompting.md'
                    },
                    'agent-md.md': {
                        type: 'file',
                        name: 'agent-md.md',
                        content: null,
                        path: '/using-amp/agent-md.md',
                        sourcePath: 'src/using-amp/agent-md.md'
                    },
                    'images.md': {
                        type: 'file',
                        name: 'images.md',
                        content: null,
                        path: '/using-amp/images.md',
                        sourcePath: 'src/using-amp/images.md'
                    },
                    'files.md': {
                        type: 'file',
                        name: 'files.md',
                        content: null,
                        path: '/using-amp/files.md',
                        sourcePath: 'src/using-amp/files.md'
                    },
                    'shortcuts.md': {
                        type: 'file',
                        name: 'shortcuts.md',
                        content: null,
                        path: '/using-amp/shortcuts.md',
                        sourcePath: 'src/using-amp/shortcuts.md'
                    }
                },
                path: '/using-amp'
            },
            'core': {
                type: 'directory',
                name: 'core',
                children: {
                    'threads.md': {
                        type: 'file',
                        name: 'threads.md',
                        content: null,
                        path: '/core/threads.md',
                        sourcePath: 'src/core/threads.md'
                    },
                    'amp-tab.md': {
                        type: 'file',
                        name: 'amp-tab.md',
                        content: null,
                        path: '/core/amp-tab.md',
                        sourcePath: 'src/core/amp-tab.md'
                    },
                    'teams.md': {
                        type: 'file',
                        name: 'teams.md',
                        content: null,
                        path: '/core/teams.md',
                        sourcePath: 'src/core/teams.md'
                    }
                },
                path: '/core'
            },
            'advanced': {
                type: 'directory',
                name: 'advanced',
                children: {
                    'tools.md': {
                        type: 'file',
                        name: 'tools.md',
                        content: null,
                        path: '/advanced/tools.md',
                        sourcePath: 'src/advanced/tools.md'
                    },
                    'configuration.md': {
                        type: 'file',
                        name: 'configuration.md',
                        content: null,
                        path: '/advanced/configuration.md',
                        sourcePath: 'src/advanced/configuration.md'
                    }
                },
                path: '/advanced'
            },
            'account': {
                type: 'directory',
                name: 'account',
                children: {
                    'account.md': {
                        type: 'file',
                        name: 'account.md',
                        content: null,
                        path: '/account/account.md',
                        sourcePath: 'src/account/account.md'
                    },
                    'pricing.md': {
                        type: 'file',
                        name: 'pricing.md',
                        content: null,
                        path: '/account/pricing.md',
                        sourcePath: 'src/account/pricing.md'
                    },
                    'support.md': {
                        type: 'file',
                        name: 'support.md',
                        content: null,
                        path: '/account/support.md',
                        sourcePath: 'src/account/support.md'
                    }
                },
                path: '/account'
            },
            'reference': {
                type: 'directory',
                name: 'reference',
                children: {
                    'appendix.md': {
                        type: 'file',
                        name: 'appendix.md',
                        content: null,
                        path: '/reference/appendix.md',
                        sourcePath: 'src/reference/appendix.md'
                    }
                },
                path: '/reference'
            }
        };
    }

    /**
     * Navigate to a directory
     */
    changeDirectory(path) {
        // Will be implemented in Step 7
        console.log('Directory change placeholder:', path);
        return { success: false, message: 'Not implemented yet' };
    }

    /**
     * List directory contents
     */
    listDirectory(path = null) {
        // Will be implemented in Step 7
        console.log('Directory listing placeholder:', path);
        return [];
    }

    /**
     * Get file content
     */
    async getFileContent(path) {
        const fileInfo = this.getPathInfo(path);
        if (!fileInfo || fileInfo.type !== 'file') {
            return null;
        }

        if (fileInfo.sourcePath) {
            return await this.contentLoader.loadContent(fileInfo.sourcePath);
        }

        return fileInfo.content || 'No content available';
    }

    /**
     * Check if path exists and get its type
     */
    getPathInfo(path) {
        const absolutePath = this.resolvePath(path);
        const parts = absolutePath.split('/').filter(p => p);
        
        let current = this.root;
        
        // If asking for root directory
        if (parts.length === 0) {
            return current;
        }
        
        // Navigate through the path
        for (const part of parts) {
            if (!current.children || !current.children[part]) {
                return null;
            }
            current = current.children[part];
        }
        
        return current;
    }

    /**
     * Resolve relative path to absolute path
     */
    resolvePath(path) {
        // Will be implemented in Step 7
        if (path.startsWith('/')) {
            return path;
        }
        
        // Handle relative paths
        const current = this.currentPath === '/' ? '' : this.currentPath;
        return `${current}/${path}`.replace(/\/+/g, '/');
    }

    /**
     * Get current working directory
     */
    getCurrentDirectory() {
        return this.currentPath;
    }

    /**
     * Set current working directory
     */
    setCurrentDirectory(path) {
        this.currentPath = path;
    }
}

// Export for use in other modules
window.VirtualFilesystem = VirtualFilesystem;
