const fs = require('fs');

const path = 'app.js';
let content = fs.readFileSync(path, 'utf8');

const oldFetchCode = `      let response = await fetch('https://api.github.com/orgs/PelleNybe/events');
      if (!response.ok) {
        response = await fetch('https://api.github.com/users/PelleNybe/events');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub activity');
      }

      const events = await response.json();
      localStorage.setItem('corax_gh_feed', JSON.stringify({ data: events, timestamp: Date.now() }));
      this.renderEvents(events);
    } catch (error) {
      console.error('Error fetching GitHub activity:', error);
      this.container.innerHTML = '<div style="text-align: center; color: var(--error-color);">Unable to load activity feed.</div>';
    }`;

const newFetchCode = `      // Web Worker Implementation
      if (window.Worker) {
        const worker = new Worker('worker_github.js');
        worker.postMessage({ action: 'fetchGitHubActivity' });

        worker.onmessage = (e) => {
          if (e.data.status === 'success') {
            const relevantEvents = e.data.data;
            localStorage.setItem('corax_gh_feed', JSON.stringify({ data: relevantEvents, timestamp: Date.now() }));
            this.renderEvents(relevantEvents);
          } else {
            console.error('Worker error:', e.data.message);
            this.container.innerHTML = '<div style="text-align: center; color: var(--error-color);">Unable to load activity feed.</div>';
          }
        };
      } else {
        // Fallback
        let response = await fetch('https://api.github.com/orgs/PelleNybe/events');
        if (!response.ok) response = await fetch('https://api.github.com/users/PelleNybe/events');
        if (!response.ok) throw new Error('Failed to fetch GitHub activity');
        const events = await response.json();
        const relevantEvents = events.filter(e => ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(e.type)).slice(0, 5);
        localStorage.setItem('corax_gh_feed', JSON.stringify({ data: relevantEvents, timestamp: Date.now() }));
        this.renderEvents(relevantEvents);
      }
    } catch (error) {
      console.error('Error fetching GitHub activity:', error);
      this.container.innerHTML = '<div style="text-align: center; color: var(--error-color);">Unable to load activity feed.</div>';
    }`;

content = content.replace(oldFetchCode, newFetchCode);

const oldRenderCode = `    const relevantEvents = events.filter(e =>
      ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(e.type)
    ).slice(0, 5);

    if (relevantEvents.length === 0) {`;

const newRenderCode = `    const relevantEvents = events;

    if (relevantEvents.length === 0) {`;

content = content.replace(oldRenderCode, newRenderCode);

fs.writeFileSync(path, content, 'utf8');
console.log('worker patch done');
