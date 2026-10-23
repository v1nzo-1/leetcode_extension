# LeetCode Python Answer Finder — Chrome Extension

Chrome Manifest V3 extension that bundles every Python solution file found in the supplied LeetCode solutions archive. Lookup is entirely local; there is no AI API and no daily or per-query lookup cap.

## Install in Chrome

1. Extract `leetcode_chrome_extension.zip` to a folder.
2. Open `chrome://extensions` in Chrome.
3. Enable **Developer mode**.
4. Click **Load unpacked**.
5. Select the extracted `leetcode_chrome_extension` folder (the folder containing `manifest.json`).
6. Pin the extension from Chrome's Extensions menu.

## Use

- Open a LeetCode problem page and click the extension icon to try automatic slug detection.
- Or enter a question number, title, or problem slug (for example `1`, `Two Sum`, or `two-sum`).
- Click **Copy code** to copy the stored Python solution, then paste it into LeetCode's editor.
- There is no daily cap or limit on the number of lookups. Results are limited only by what exists in the bundled collection.

## Collection coverage

- Includes all 3,673 `.py` files from the archive's `Python/` directory.
- The archive maps 3,660 question IDs to solutions. Files without a reliable numeric mapping remain searchable by title or slug.
- Solutions are bundled for offline lookup; no runtime network request is made to retrieve code.
- Review solutions before use. Some repository answers may use older conventions or be unsuitable for current problem variants.
- Keep `LICENSE.md` and the repository's attribution/license terms when redistributing the collection.
