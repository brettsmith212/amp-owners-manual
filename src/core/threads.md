# Threads

Threads are conversations with the agent, containing all your messages, context, and tool calls. Your threads are synced to ampcode.com. If you're on a team, your threads are also shared with your team by default, just like Git branches on a shared remote repository.

Including links to Amp threads with your changes when submitting for code review helps provide context. Reading and searching your team's threads can help you see what's going on and how other people are using Amp.

## Privacy & Permissions

Threads can be public (visible to anyone on the internet with the link), team-shared (visible to your team members), or private (visible only to you).

If you're on a team, your threads are shared by default with your team members.

If you are not on a team, your threads are only visible to you by default.

You can change a thread's visibility at any time through the sharing menu at the top of the thread.

## Managing Context

As you work with Amp, your thread accumulates context within the model's context window. Amp shows your context window usage and warns when approaching limits.

When approaching the thread context limit, you can hover over the context window indicator and use the following:

* **Compact Thread** — Summarizes the existing conversation to reduce context usage while preserving important information
* **New Thread with Summary** — Creates a new thread that starts with a summary of the current conversation

## File Changes

Amp tracks changes that the agent makes to files during your conversation, which you can track and revert:

* Hover over the files changed indicator (located just above the message input) to see which files were modified and by how much
* Revert individual file changes, or all changes made by the agent

Editing a message in a thread automatically reverts any changes the agent made after that message.
