# Appendix

## Share Thread with Support

We may ask you to share your thread with authorized Sourcegraph staff members to help diagnose quality issues:

1. In the Amp sidebar in VS Code or when viewing the thread on ampcode.com, open the sharing menu.
2. Select Share Thread with Support.

You can also share your thread via the CLI:

```bash
amp threads share --support <thread-id>
```

This will allow authorized Sourcegraph staff members to view your thread for debugging purposes.

## Support Bundles

We may ask you to generate a support bundle and share it directly with authorized Sourcegraph staff members to help diagnose quality issues. You can email support bundles to amp-devs@sourcegraph.com.

To generate a support bundle:

1. Open your terminal
2. Run `npx @sourcegraph/amp doctor`
3. The bundle will be saved as a timestamped `.json.gz` file in your current directory

What's included in a support bundle:

* **System Information**: Operating system, hardware specs, Node.js version, available memory and disk space
* **Amp Installation**: Version detection, installation method (npm/pnpm/yarn), package manager, recent logs (last 1000 entries)
* **Network Diagnostics**: Connectivity tests to Amp services, DNS resolution, proxy configuration detection
* **SSL Analysis**: Certificate chains, trusted root certificates, TLS configuration for corporate environments
* **Environment Variables**: Only variables with the `AMP_` prefix

Support bundles are automatically redacted using Amp's built-in secret detection patterns but we recommend manually reviewing the information before sharing support bundles as log files gathered may contain sensitive information.

## Visual Studio Code Developer Console

We may ask you to share information from your Visual Studio Code Developer Console.

To open the Developer Console:

**macOS:**
* Press `Cmd+Shift+P` to open the Command Palette
* Type "Developer: Toggle Developer Tools" and press Enter
* Or use the keyboard shortcut: `Cmd+Option+I`

**Windows:**
* Press `Ctrl+Shift+P` to open the Command Palette
* Type "Developer: Toggle Developer Tools" and press Enter
* Or use the keyboard shortcut: `Ctrl+Shift+I`

**Linux:**
* Press `Ctrl+Shift+P` to open the Command Palette
* Type "Developer: Toggle Developer Tools" and press Enter
* Or use the keyboard shortcut: `Ctrl+Shift+I`

The Developer Console will open as a separate window or panel, showing the Console, Network, and other debugging tabs that can help authorized Sourcegraph staff members diagnose quality issues.

## Service Status

Check ampcodestatus.com for service status and to sign up for alerts via email, RSS, Slack. Alternatively, follow @ampcodestatus on X.

## News

Follow Amp's News for the changelog and other updates from the Amp team.

## API

Amp provides REST APIs for programmatic access to team data and metrics. See the dedicated API documentation for complete details on available endpoints, authentication, and examples.

## Frequently Ignored Feedback

See Amp's Frequently Ignored Feedback for the most common valid feedback that we've chosen to not address.
