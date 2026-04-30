self.onmessage = async function(e) {
  if (e.data.action === 'fetchGitHubActivity') {
    try {
      let response = await fetch('https://api.github.com/orgs/PelleNybe/events');
      if (!response.ok) {
        response = await fetch('https://api.github.com/users/PelleNybe/events');
      }

      if (!response.ok) {
        throw new Error('Failed to fetch GitHub activity');
      }

      const events = await response.json();

      const relevantEvents = events.filter(e =>
        ['PushEvent', 'PullRequestEvent', 'IssuesEvent', 'CreateEvent'].includes(e.type)
      ).slice(0, 5);

      self.postMessage({ status: 'success', data: relevantEvents });
    } catch (error) {
      self.postMessage({ status: 'error', message: error.message });
    }
  }
};
