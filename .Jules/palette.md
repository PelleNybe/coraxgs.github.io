## 2024-05-14 - Empty Buttons and Search Inputs
**Learning:** Found several UX/accessibility patterns that are easy to miss during initial development:
1. Purely visual elements acting as buttons (like color swatches for a theme selector) that have no text content fail screen reader checks if they lack an `aria-label`.
2. Input fields that rely entirely on the `placeholder` attribute for context are not accessible. They require an explicit `aria-label` or an associated `<label>` (which can be visually hidden).
3. Decorative icons inside inputs (like a magnifying glass emoji `🔍`) should be marked `aria-hidden="true"` so screen readers don't awkwardly read them aloud when the user focuses the input.
4. "Close" buttons that just contain an 'x' or '✕' symbol need an `aria-label="Close"` to be properly understood by assistive technologies.
**Action:** Always ensure visually-empty interactive elements and standalone inputs have explicit ARIA labels. Mark decorative emojis and icons as hidden to screen readers.
