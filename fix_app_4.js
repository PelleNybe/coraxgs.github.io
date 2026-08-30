const fs = require('fs');
let appJs = fs.readFileSync('app.js', 'utf8');

appJs = appJs.replace(
  /await this\.typeLine\(\`Packet latency: \$\{Math\.floor\(sysRand\(\)\*20\)\}ms\. Status: SECURE\.\`\);/,
  `await this.typeLine(\`Packet latency: \${window.coraxLastLatency ? window.coraxLastLatency.toFixed(1) : 16}ms. Status: SECURE.\`);`
);

appJs = appJs.replace(
  /await this\.typeLine\("Node-1: Online \(Uptime 45d\)"\);\s+await this\.typeLine\("Node-2: Online \(Uptime 23d\)"\);\s+await this\.typeLine\("Database Shard A: Synced"\);/,
  `const connectionInfo = navigator.connection ? navigator.connection.effectiveType : 'unknown';
        const cores = navigator.hardwareConcurrency || 'unknown';
        await this.typeLine(\`Local Node: Online (Cores: \${cores})\`);
        await this.typeLine(\`Network Link: \${connectionInfo}\`);
        await this.typeLine(\`Web Worker: \${window.coraxWorkerLoad ? 'Active' : 'Standby'}\`);`
);

appJs = appJs.replace(
  /this\.lines = \[[\s\S]*?\];/,
  `this.lines = [
      "Initializing Corax OS environment...",
      "Mounting local execution context...",
      \`[OK] Client hardware concurrency detected.\`,
      "[OK] Live sensor stream configured.",
      "Awaiting instructions. Type 'help' to begin."
    ];`
);


fs.writeFileSync('app.js', appJs, 'utf8');
