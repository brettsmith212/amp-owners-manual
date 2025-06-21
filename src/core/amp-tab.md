# Amp Tab

Amp Tab is our new in-editor completion engine, designed to anticipate your next actions and reduce the time spent manually writing code.

It uses a custom model that was trained to understand what you are trying to do next, based on your recent changes, your language server's diagnostics, and what we call semantic context.

Amp Tab can suggest regular single or multi-line edits to change entire code blocks, next to your cursor or farther away, somewhere else in your current document.

## Enabling Amp Tab

Enable Amp Tab by adding the following to your VS Code settings:

```json
{
  "amp.tab.enabled": true
}
```

## How to Use

* Begin typing in your editor. Amp Tab automatically presents relevant suggestions.
* Press the **Tab** key to accept and apply the suggested edits.
* Press the **Tab** key again to instantly jump to additional edits further from your cursor.
* To ignore suggestions, simply continue typing or press **Esc**.

Currently, Amp Tab is free to use as a research preview for all Amp users.
