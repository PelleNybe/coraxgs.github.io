## 2024-05-14 - Fix DOM-based XSS in app.js
**Vulnerability:** User-controlled data (GitHub repository names, blog titles/excerpts, etc) were directly interpolated into DOM nodes using \`.innerHTML\` without sanitization. This allowed execution of malicious code.
**Learning:** External data from APIs or configuration files should always be properly sanitized or escaped when assigning into \`.innerHTML\`, or alternatively text updates should use \`.textContent\`. In JS components relying on template literals for HTML structure, a custom \`escapeHTML\` helper should be deployed to prevent XSS.
**Prevention:** Implement \`escapeHTML(string)\` function and apply it consistently when concatenating strings destined for HTML parsing.
