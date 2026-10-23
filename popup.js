let answers = {};
const $ = (id) => document.getElementById(id);

function uniqueSolutionCount() {
  return new Set(Object.values(answers).map((item) => item.file || item.slug).filter(Boolean)).size;
}

async function loadAnswers() {
  const response = await fetch(chrome.runtime.getURL('answers.json'));
  if (!response.ok) throw new Error('Could not load the bundled answer collection.');
  answers = await response.json();
}

function showAnswer(item) {
  if (!item) {
    $('answer').hidden = true;
    $('status').textContent = 'No matching Python solution found. Try a question number, title, or problem slug.';
    $('status').className = 'error';
    return;
  }
  $('status').textContent = 'Solution found. Unlimited lookups are enabled.';
  $('status').className = '';
  $('answerTitle').textContent = item.title || item.slug || `Question ${item.number}`;
  $('answerNumber').textContent = Number.isInteger(item.number) ? `#${item.number}` : 'Python';
  $('answerLink').href = item.url || `https://leetcode.com/problems/${item.slug}/`;
  $('solutionCode').textContent = item.code || '';
  $('answer').hidden = false;
  $('copyButton').textContent = 'Copy code';
}

function findAnswer(query) {
  const term = query.trim().toLowerCase();
  if (!term) return null;
  if (/^\d+$/.test(term)) {
    const numeric = answers[String(Number(term))];
    if (numeric) return numeric;
  }
  const all = Object.values(answers);
  const exactSlug = term.replace(/^https?:\/\/leetcode\.com\/problems\//, '').replace(/\/?(?:\?.*)?$/, '');
  return all.find((item) => (item.slug || '').toLowerCase() === exactSlug)
    || all.find((item) => (item.title || '').toLowerCase() === term)
    || all.find((item) => (item.slug || '').toLowerCase().includes(term))
    || all.find((item) => (item.title || '').toLowerCase().includes(term))
    || null;
}

async function detectCurrentProblem() {
  const [tab] = await chrome.tabs.query({active: true, currentWindow: true});
  if (!tab?.url || !tab.url.includes('leetcode.com/problems/')) {
    $('currentProblem').textContent = 'Open a LeetCode problem to detect it automatically, or search by number, title, or slug.';
    return;
  }
  const match = tab.url.match(/leetcode\.com\/problems\/([^/?#]+)/i);
  const slug = match?.[1];
  if (!slug) return;
  const found = Object.values(answers).find((entry) => entry.slug === slug);
  if (found) {
    $('currentProblem').textContent = `Current page: ${found.title}${Number.isInteger(found.number) ? ` (#${found.number})` : ''}`;
    $('questionNumber').value = Number.isInteger(found.number) ? String(found.number) : slug;
    showAnswer(found);
  } else {
    $('currentProblem').textContent = `Current page slug: ${slug}. No matching Python solution was found.`;
  }
}

$('lookupForm').addEventListener('submit', (event) => {
  event.preventDefault();
  const query = $('questionNumber').value;
  if (/^\d+$/.test(query.trim()) && Number(query) < 1) {
    $('status').textContent = 'Enter a positive question number, title, or problem slug.';
    $('status').className = 'error';
    return;
  }
  showAnswer(findAnswer(query));
});

$('copyButton').addEventListener('click', async () => {
  // Repository files often start with complexity notes such as '# Time: O(n)'
  // and '# Space: O(n)'. Keep these out of the copied LeetCode submission.
  const code = $('solutionCode').textContent.replace(/^(?:[ \t]*#\s*(?:time|space)\s*:[^\r\n]*(?:\r?\n|$))+[ \t]*\r?\n?/i, '').trimStart();
  try {
    await navigator.clipboard.writeText(code);
    $('copyButton').textContent = 'Copied!';
  } catch (error) {
    $('status').textContent = 'Clipboard access failed. Select the code and copy it manually.';
    $('status').className = 'error';
  }
});

(async () => {
  try {
    $('status').textContent = 'Loading Python solutions…';
    await loadAnswers();
    $('status').textContent = `Loaded ${uniqueSolutionCount().toLocaleString()} Python solution files. Unlimited lookups; no daily cap.`;
    await detectCurrentProblem();
  } catch (error) {
    $('status').textContent = error.message;
    $('status').className = 'error';
  }
})();
