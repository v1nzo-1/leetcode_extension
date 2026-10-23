# LeetCode Chrome Extension — Python Answer Finder

A lightweight Chrome extension that searches a bundled collection of LeetCode Python solutions. Enter a question number, problem title, or problem slug, or open a LeetCode problem page and let the extension try to detect it. Review the stored solution and copy it into the LeetCode editor when appropriate.

> **Important:** This extension is a local answer lookup tool, not an AI solver. It does not generate new solutions, guarantee that every LeetCode problem is covered, or automatically submit code. The collection is only as complete and accurate as the source files bundled with it.

## Contents

- [Features](#features)
- [How it works](#how-it-works)
- [Requirements](#requirements)
- [Install in Chrome](#install-in-chrome)
- [How to use it](#how-to-use-it)
- [Search examples](#search-examples)
- [How unlimited lookup works](#how-unlimited-lookup-works)
- [Project structure](#project-structure)
- [Troubleshooting and common mistakes](#troubleshooting-and-common-mistakes)
- [Development and testing](#development-and-testing)
- [Updating the answer collection](#updating-the-answer-collection)
- [Limitations and safety notes](#limitations-and-safety-notes)

## Features

- **Search by question number**, such as `1`.
- **Search by title**, such as `Two Sum`.
- **Search by problem slug**, such as `two-sum`.
- **Detect the current LeetCode problem** from its URL when a matching slug exists in the collection.
- **Copy code** to the clipboard. The copy action removes leading `# Time: ...` and `# Space: ...` notes when they appear at the start of the solution.
- **Local lookup:** answers are bundled in `answers.json`; the extension does not call an AI API or send lookup queries to a server.
- **No daily or per-search cap:** the extension does not implement an artificial usage quota. Results are limited by the answers available in the bundled collection and by the browser/device's resources.
- **Custom extension icon:** icon files are stored in `icons/` and configured in `manifest.json`.

## How it works

1. When the popup opens, `popup.js` loads `answers.json` using Chrome's extension URL.
2. The extension checks the active tab. If it is a LeetCode problem URL, it extracts the problem slug and searches for a matching entry.
3. You can also type a question number, title, or slug into the search field.
4. The extension searches the local data and displays the matched title, question number (when known), problem link, and Python code.
5. Click **Copy code** to copy the displayed solution. Paste it into LeetCode yourself and review it before running or submitting.

The extension uses Chrome **Manifest V3**. Its `tabs` permission is used to inspect the active tab URL, and its LeetCode host permission is limited to `https://leetcode.com/*`.

## Requirements

- Google Chrome or a Chromium-based browser that supports Chrome Manifest V3 extensions.
- The extracted project folder, including `manifest.json`, `popup.html`, `popup.css`, `popup.js`, `answers.json`, and `icons/`.
- No Python installation, package installation, API key, or build step is required to use the extension.

## Install in Chrome

### Option A — Install from a downloaded ZIP

1. Download the project ZIP from the repository using **Code → Download ZIP** (or download the ZIP release provided by the project maintainer).
2. Extract the ZIP to a normal folder. Do not try to load the ZIP file itself.
3. In Chrome, open `chrome://extensions`.
4. Turn on **Developer mode**.
5. Click **Load unpacked**.
6. Select the extracted extension folder that contains `manifest.json` directly.
7. Open Chrome's Extensions menu and optionally pin **LeetCode Chrome Extension** to the toolbar.
8. Open a LeetCode problem and click the extension icon to test it.

### Option B — Run from a Git clone

```bash
git clone <YOUR-REPOSITORY-URL>
cd leetcode-chrome-extension-repo
```

Then follow steps 3–8 above. Replace `<YOUR-REPOSITORY-URL>` with the URL of your actual GitHub repository.

### Updating after changing files

1. Save your changes in the same local folder.
2. Open `chrome://extensions`.
3. Click **Reload** on the extension card.
4. Close and reopen the extension popup to test the latest version.

If you downloaded a new ZIP into a different folder, load that new folder or remove the old extension first so you do not accidentally test an outdated copy.

## How to use it

### Search by question number

1. Open the extension popup.
2. Enter a positive question number, for example `1`.
3. Submit the search.
4. If a matching entry exists, check the displayed title and code.
5. Click **Copy code**, then paste it into the LeetCode editor.

### Search by title or slug

Enter a title such as `Two Sum` or a slug such as `two-sum`. Search is case-insensitive. Title and slug matching supports exact matches and partial matches; partial searches return the first matching entry in the collection, so use a full title or slug when multiple problems have similar names.

### Detect the current problem

1. Open a URL like `https://leetcode.com/problems/two-sum/` in the active tab.
2. Click the extension icon.
3. If the slug matches an entry in `answers.json`, the popup fills the search field and displays the answer.
4. If no matching slug exists, try the problem number, title, or slug manually.

### Copying code

The **Copy code** button copies the code shown in the popup. It attempts to remove leading complexity notes in the form `# Time: ...` and `# Space: ...`. This is a narrow cleanup rule, not a full code formatter: other comments or metadata may remain. Always inspect the copied code before submitting it.

## Search examples

| Input | Meaning |
|---|---|
| `1` | Look up the stored entry mapped to question number 1. |
| `Two Sum` | Search by problem title. |
| `two-sum` | Search by problem slug. |
| `https://leetcode.com/problems/two-sum/` | A LeetCode problem URL can be used as a slug-style search input. |

A result is only available if the collection contains a matching entry. A valid LeetCode problem may not have a stored answer in this collection.

## How unlimited lookup works

There is no daily counter or per-query quota in the extension code. You can search repeatedly without using up a daily allowance. “Unlimited” does **not** mean every LeetCode problem is included: lookups can only return answers present in `answers.json`. Large collections also use device memory and browser resources.

## Project structure

```text
leetcode-chrome-extension-repo/
├── manifest.json       # Chrome Manifest V3 configuration and permissions
├── popup.html          # Popup interface markup
├── popup.css           # Popup styling
├── popup.js            # Load, search, detect, display, and copy logic
├── answers.json        # Bundled local Python answer index and code
├── icons/
│   ├── icon16.png      # Small toolbar icon
│   ├── icon48.png      # Extensions management icon
│   └── icon128.png     # Larger extension/store-style icon
├── README.md           # This guide
├── CONTRIBUTING.md     # Contribution notes
└── .gitignore          # Files excluded from Git
```

## Troubleshooting and common mistakes

### 1. Chrome says “Manifest file is missing or unreadable”

**Likely cause:** The wrong folder was selected, or the ZIP was not extracted.

**Fix:** Extract the ZIP first, then choose the exact folder containing `manifest.json`. Do not select the ZIP file, a parent folder, or a nested folder that does not contain the manifest.

### 2. The extension loads, but no answer collection is loaded

**Likely cause:** `answers.json` is missing, renamed, malformed, or not in the same root folder as `popup.js`.

**Fix:** Confirm that `answers.json` exists next to `popup.js`. If you edited it, validate that it is valid JSON (quotes, commas, braces, and brackets must be correct). Restore the original file if necessary, then click **Reload** at `chrome://extensions`.

### 3. “No matching Python solution found”

**Possible causes:**

- The question is not included in this collection.
- The question number is not mapped correctly in the source data.
- The title or slug is spelled differently in the collection.
- The current page's slug differs from the stored slug.

**Fix:** Try the numeric question ID, full title, or exact problem slug. If none works, the solution may not be present or may not have a reliable question-number mapping. Do not assume a missing result means the LeetCode problem itself is invalid.

### 4. The extension detects the wrong problem or a similar title

**Likely cause:** Partial title or slug searches can match the first entry containing the search text.

**Fix:** Search using the exact question number or full slug. Verify the displayed title and problem link before copying.

### 5. The extension icon is missing or still looks old

**Possible causes:** Chrome has cached the icon, the old folder is still loaded, or the icon paths in `manifest.json` do not match the files on disk.

**Fix:** Confirm `icons/icon16.png`, `icons/icon48.png`, and `icons/icon128.png` exist. Check the `default_icon` and `icons` paths in `manifest.json`. Click **Reload** on `chrome://extensions`; if necessary, remove the old unpacked extension and load the correct new folder. Make sure you are not editing one folder while Chrome loads another.

### 6. “Copy code” does not work

**Likely cause:** Clipboard access was denied or unavailable in the current browser context.

**Fix:** Open the popup from the extension icon and try again. If it still fails, select the displayed code and copy it manually. The popup should show a clipboard error message when the copy attempt fails.

### 7. Complexity comments still appear in copied code

**Likely cause:** The cleanup removes only leading comments matching `# Time: ...` and `# Space: ...` at the beginning of the code. Variants such as `# Time Complexity - O(n)` or notes placed after other lines may not be removed.

**Fix:** Review the code and remove unwanted notes manually, or update the cleanup logic in `popup.js` and test the variations in your collection. Do not blindly remove all comments: some comments may be useful or part of a solution explanation.

### 8. The solution does not run on LeetCode

**Possible causes:**

- The stored answer uses an older Python version or outdated syntax.
- The solution targets a different version or variant of the problem.
- The source file contains explanation text, formatting artifacts, or unsupported imports.
- The code expects a different function signature or class structure.

**Fix:** Compare the code with the current problem statement and expected function signature. Test it against examples and edge cases. The extension retrieves stored code; it does not compile, execute, or automatically repair solutions.

### 9. The popup is blank or shows a JavaScript error

**Fix:** Open `chrome://extensions`, find the extension, and inspect its error details if Chrome shows an **Errors** button. Verify `popup.html`, `popup.js`, and `popup.css` are present and their names match the references. Reload the extension after correcting the issue.

### 10. Changes do not appear after editing

**Likely cause:** The extension has not been reloaded, or a different folder is loaded.

**Fix:** Save the files, click **Reload** on the extension card, close the popup, and open it again. Check the extension's folder path in Chrome if changes still do not appear.

### 11. GitHub upload or repository size issues

**Likely cause:** The answer collection is much larger than the extension source files, and some hosting platforms impose file-size or repository-size limits.

**Fix:** Check the size of `answers.json` before committing. If you intentionally keep the collection outside the repository, update the setup instructions so users know how to obtain it and where to place it. Do not accidentally commit API keys, personal data, or unrelated files.

### 12. The extension does not automatically submit answers

This is expected behavior. The current extension displays and copies a stored solution. It does not automatically insert code into the editor, run tests, or submit to LeetCode.

## Development and testing

This is a static browser extension; there is no build step or package installation.

1. Edit the relevant HTML, CSS, JavaScript, JSON, or icon file.
2. Open `chrome://extensions` and enable **Developer mode**.
3. Load the project folder with **Load unpacked**, or click **Reload** if it is already loaded.
4. Test number search, title search, slug search, current-page detection, missing-answer behavior, and clipboard copying.
5. Check the extension's error panel if anything fails.

Before contributing, verify:

- The extension still loads as Manifest V3.
- Search results display the correct problem title and code.
- Missing results show a clear message.
- Copying does not unexpectedly change the solution.
- The project does not contain secrets or personal data.

See [`CONTRIBUTING.md`](CONTRIBUTING.md) for contribution basics.

## Updating the answer collection

`answers.json` is the local data source. Keep its structure consistent with what `popup.js` expects: each entry should include the relevant fields such as `title`, `slug`, `number`, `url`, and `code` when available. The lookup logic uses numeric keys for direct question-number searches and searches entry titles and slugs for text queries.

If you rebuild the collection from another archive:

1. Keep Python solutions only if that is the intended scope.
2. Preserve reliable question-number, title, and slug metadata.
3. Avoid overwriting a correct solution mapping with an unrelated file.
4. Validate the generated JSON before packaging.
5. Test a selection of known question numbers, titles, slugs, and missing entries.

The extension does not currently fetch updated solutions automatically. To change its bundled collection, update `answers.json` and reload the extension.

## Limitations and safety notes

- This is a lookup utility, not an AI solver.
- It only returns solutions available in the bundled data.
- Partial title/slug matches may be ambiguous; verify the result before use.
- Stored solutions may be incorrect, incomplete, outdated, or incompatible with the current problem.
- The extension does not run code, validate correctness, edit the LeetCode editor automatically, or submit solutions.
- The extension performs local answer lookup and does not require an AI API key.
- Use the extension in accordance with LeetCode's rules and your school/workplace requirements.

---

If you encounter a bug, include the Chrome version, the exact steps to reproduce it, what you expected to happen, what happened instead, and any error shown by Chrome. Do not include passwords, tokens, or other private information in an issue.
