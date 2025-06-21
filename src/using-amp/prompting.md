# How to Prompt

Amp currently uses Claude Sonnet 4 for most tasks. For the best results, follow these guidelines:

* Be explicit with what you want. Don't try to make the model guess.
* In Amp, you need to press Cmd/Ctrl+Enter to submit a message, not just Enter, to remind you to be deliberate with your requests.
* Break very large tasks up into smaller sub-tasks, one per thread.
* Use a project `AGENT.md` file to guide Amp on how to run your tests and build steps and to avoid doing inappropriate things.

## Example Prompts

Here are some examples of prompts we've used with Amp:

* "Look at src/my/file.ext and extend it so that it sends the requests only every 200ms. Add tests in the existing test file."
* "Run `<build command>` and fix all the errors"
* "Look at `<local development server url>` to see this UI component. Then change it so that it looks more minimal. Frequently check your work by screenshotting the URL."
* "Run git blame on the file I have open and figure out who added that new title"
* "Run `git diff` to see the code someone else wrote; review the code thoroughly and point out any potential edge cases that were missed"
* "Run `git diff` to see the current changes, remove debug statements"
* "Find the commit that added this using git log, look at the whole commit, then help me change this feature"
* "Explain the relationship between class AutoScroller and ViewUpdater using a diagram"
* "Use `psql` to connect to my local database, then rewire all uploads in the image uploads table to be owned by my user, bob@example.com"

Also see Thorsten Ball's [How I Use Amp](https://ampcode.com/how-i-use-amp).

If you're on a team, use Amp's [thread sharing](../core/teams.md) to learn from each other.
