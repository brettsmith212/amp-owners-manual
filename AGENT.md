# Amp Owners Manual - Agent Memory

## Project Overview

This is an mdbook documentation site for the Amp coding agent. It includes a custom "Terminal Mode" feature that transforms the documentation into a retro 80s terminal aesthetic.

## Development Commands

```bash
# Install mdbook
cargo install mdbook

# Serve locally with auto-reload
mdbook serve --open

# Serve on specific port
mdbook serve --port 3000

# Build static site
mdbook build
```

## Project Structure

```
├── book.toml           # mdbook configuration
├── theme/              # Custom theme overrides
│   ├── index.hbs      # HTML template
│   ├── book.js        # JavaScript functionality
│   └── css/           # Theme CSS files (only predefined files served)
│       ├── variables.css
│       ├── general.css
│       ├── chrome.css
│       └── print.css
├── src/               # Documentation source files
├── terminal.css       # Custom CSS (via additional-css)
└── AGENT.md          # This file
```

## Adding Custom CSS Files - CRITICAL KNOWLEDGE

**❌ WRONG WAY (doesn't work):**

- Adding CSS files to `theme/css/` directory
- mdbook only serves predefined CSS files from theme/css/

**✅ CORRECT WAY:**

1. Place custom CSS files in the root directory (not in theme/css/)
2. Add to `book.toml`:
   ```toml
   [output.html]
   additional-css = ["your-custom.css"]
   ```
3. mdbook will automatically include these via the `{{#each additional_css}}` block in index.hbs

**Why this matters:** We spent significant time debugging why custom CSS wasn't loading, only to discover mdbook has strict rules about which CSS files it serves from the theme directory.

## Terminal Mode Feature

### Implementation Details

**Files involved:**

- `terminal.css` - All terminal styling (retro 80s CRT aesthetic)
- `theme/book.js` - JavaScript toggle functionality
- `theme/index.hbs` - Terminal toggle button in menu bar

**How it works:**

1. Button toggles `terminal-mode` class on `<html>` element
2. CSS uses `html.terminal-mode` selectors for high specificity
3. State persisted in localStorage as `mdbook-terminal-mode`
4. Button text changes: "Terminal Mode" ↔ "Boring Mode"

**Key CSS techniques:**

- Use `html.terminal-mode` for maximum specificity to override general.css
- Terminal prompts added via `::before` pseudo-elements on headers
- CRT effects with scan lines and text glow
- Monospace fonts enforced throughout
- Retro green-on-black color scheme

### Terminal Mode Features

- **Retro Colors**: Classic green phosphor CRT terminal colors (#00ff00 on #001100)
- **Terminal Prompts**:
  - H1: `root@amp:~# `
  - H2: `$ `
  - H3: `> `
- **Boot Message**: Terminal initialization sequence at top of content
- **CRT Effects**: Subtle scan lines and text glow
- **Monospace Everything**: All text uses terminal fonts
- **Terminal Links**: Wrapped in brackets `[link text]`
- **Command Output Styling**: Code blocks styled as terminal output

## mdbook Theming System

**Theme file precedence:**

1. `variables.css` - CSS custom properties/variables
2. `general.css` - Base styles and content styling
3. `chrome.css` - UI elements (sidebar, menu bar, etc.)
4. Additional CSS files (via additional-css config)

**Custom themes available:**

- `amp-dark` (default)
- `amp-light`

## CSS Override Strategy

When extending existing styles:

1. **Use mdbook's additional-css system** (not theme/css/)
2. **Target high specificity** with `html.class-name` selectors
3. **Avoid !important** when possible - proper load order usually sufficient
4. **Test CSS loading** with curl: `curl -I http://localhost:3000/your-file.css`

## Common Gotchas

1. **CSS files in theme/css/ not loading**: Only predefined mdbook files are served from theme/css/
2. **Styles not applying**: Check CSS load order and specificity, not necessarily need !important
3. **JavaScript not working**: Ensure elements exist in DOM before accessing them
4. **Font loading**: mdbook serves fonts from theme/fonts/, custom fonts need special handling

## Testing

Always test terminal mode toggle functionality:

1. Click "Terminal Mode" button
2. Verify complete visual transformation
3. Check button text changes to "Boring Mode"
4. Toggle back to normal mode
5. Verify state persistence across page refreshes
