# Master Journal - Corax CoLAB / Pelle Nyberg
## Critical Learnings
- Project is a PWA using vanilla Web Components.
- Computational tasks should use Web Workers.
- High performance standard: speed is a feature, millisecond count.
- Accessibility is crucial.
- Security vulnerabilities must be addressed.
- Optimization should be precise and measured.
- No placeholders, mock-ups, or guessing.
Checked code changes. Tests pass. Ready for commit.
- Implemented frontend performance improvements: Added `IntersectionObserver` to pause `requestAnimationFrame` loops when `CyberGlobe` and `DepthMap` components are off-screen.
- Added `{ passive: true }` to intensive event listeners (`scroll`, `resize`, `mousemove`) in `app.js` to unblock the main thread.
- Implemented Web Worker optimization for the LiDAR depth map simulation in `worker.js`, transferring ArrayBuffers back and forth to avoid frequent garbage collection and memory allocations.
- Resolved accessibility issues in `index.html` and `styles.css` by fixing duplicate visually hidden classes, and adding a proper focusable `.skip-link` for keyboard navigation.
- Verified XSS mitigation with robust use of `escapeHTML()` and security attributes for outbound links (`rel="noopener noreferrer"`).
- Implemented further performance optimizations: Added conditions to `setInterval` callbacks for AI simulation logs, preventing execution when the component is not visible on screen.
- Stopped Telemetry Chart background updates when the telemetry panel is hidden, significantly reducing CPU usage when tracking is inactive.
- Enhanced `sw.js` with dynamic runtime caching to properly store new assets offline for full PWA robustness.
- Optimized `GitHubActivityFeed` to utilize the existing `GitHubAPI.fetchWithCache` class instead of raw `fetch()`. This provides a global memory cache (TTL) and critical exponential backoff/rate-limiting logic when contacting the GitHub API.
