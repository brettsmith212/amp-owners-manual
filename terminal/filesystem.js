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
        this.contentLoader = null; // Will be initialized later
    }

    /**
     * Initialize filesystem structure from documentation
     */
    async initialize() {
        console.log('Initializing virtual filesystem...');
        
        // Initialize content loader if available
        if (typeof ContentLoader !== 'undefined') {
            this.contentLoader = new ContentLoader();
            console.log('ContentLoader initialized');
        } else {
            console.warn('ContentLoader not available, file content loading disabled');
        }
        
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
        // Handle special cases
        if (path === '~' || path === '$HOME') {
            this.currentPath = '/';
            return { success: true, message: '' };
        }
        
        const targetPath = this.resolvePath(path);
        const pathInfo = this.getPathInfo(targetPath);
        
        if (!pathInfo) {
            return { success: false, message: `cd: ${path}: No such file or directory` };
        }
        
        if (pathInfo.type !== 'directory') {
            return { success: false, message: `cd: ${path}: Not a directory` };
        }
        
        this.currentPath = targetPath;
        return { success: true, message: '' };
    }

    /**
     * List directory contents
     */
    listDirectory(path = null) {
        const targetPath = path ? this.resolvePath(path) : this.currentPath;
        const dirInfo = this.getPathInfo(targetPath);
        
        if (!dirInfo) {
            return { success: false, message: `ls: ${path || 'current directory'}: No such file or directory`, items: [] };
        }
        
        if (dirInfo.type !== 'directory') {
            return { success: false, message: `ls: ${path || 'current directory'}: Not a directory`, items: [] };
        }
        
        const items = [];
        for (const [name, info] of Object.entries(dirInfo.children)) {
            items.push({
                name: name,
                type: info.type,
                path: info.path,
                isDirectory: info.type === 'directory'
            });
        }
        
        // Sort directories first, then files, both alphabetically
        items.sort((a, b) => {
            if (a.isDirectory && !b.isDirectory) return -1;
            if (!a.isDirectory && b.isDirectory) return 1;
            return a.name.localeCompare(b.name);
        });
        
        return { success: true, message: '', items: items };
    }

    /**
     * Get file content
     */
    async getFileContent(path) {
        const fileInfo = this.getPathInfo(path);
        if (!fileInfo || fileInfo.type !== 'file') {
            return null;
        }

        if (fileInfo.sourcePath && this.contentLoader) {
            return await this.contentLoader.loadContent(fileInfo.sourcePath);
        }

        return fileInfo.content || `Content for ${fileInfo.name} (content loading not yet implemented)`;
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
        if (!path || path === '.') {
            return this.currentPath;
        }
        
        if (path === '..') {
            if (this.currentPath === '/') {
                return '/';
            }
            const parts = this.currentPath.split('/').filter(p => p);
            parts.pop();
            return '/' + parts.join('/');
        }
        
        if (path.startsWith('/')) {
            return this.normalizePath(path);
        }
        
        // Handle relative paths
        const current = this.currentPath === '/' ? '' : this.currentPath;
        const fullPath = `${current}/${path}`;
        return this.normalizePath(fullPath);
    }
    
    /**
     * Normalize path by resolving . and .. components
     */
    normalizePath(path) {
        const parts = path.split('/').filter(p => p);
        const resolved = [];
        
        for (const part of parts) {
            if (part === '.') {
                continue;
            } else if (part === '..') {
                if (resolved.length > 0) {
                    resolved.pop();
                }
            } else {
                resolved.push(part);
            }
        }
        
        return '/' + resolved.join('/');
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
