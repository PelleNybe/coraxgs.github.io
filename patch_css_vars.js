const fs = require('fs');
let css = fs.readFileSync('styles.css', 'utf8');

// Refactor CSS variables to use data-theme on html rather than overriding everything manually
// Although styles.css already has [data-theme="light"], we want to make it cleaner

let themeVars = `
/* T5: Robust CSS custom properties scoping */
html {
  /* Default dark theme */
  --primary-color: #00ffc2;
  --secondary-color: #1a73e8;
  --accent-color: #ff6b35;
  --success-color: #00d4aa;
  --warning-color: #ffb347;
  --error-color: #ff6b6b;
  --dark-bg: #050505;
  --card-bg: #111111;
  --glass-bg: rgba(17, 17, 17, 0.85);
  --text-primary: #f8f9fa;
  --text-secondary: #e8eaed;
  --text-muted: #9aa0a6;
  --gradient-primary: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  --gradient-secondary: linear-gradient(135deg, var(--accent-color), var(--warning-color));
  --gradient-dark: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
  --shadow-glow: 0 0 30px rgba(0, 255, 204, 0.3);
  --shadow-soft: 0 8px 32px rgba(0, 0, 0, 0.3);
  --border-radius: 16px;
  --border-radius-small: 8px;
  --transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --transition-slow: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
  --navbar-height: 100px;
  --max-width: 1200px;
  --spacing-xs: 0.5rem;
  --spacing-sm: 1rem;
  --spacing-md: 2rem;
  --spacing-lg: 3rem;
  --spacing-xl: 5rem;
}

html[data-theme="light"] {
  --primary-color: #007bb5;
  --secondary-color: #e81a73;
  --accent-color: #356bff;
  --success-color: #008f72;
  --warning-color: #d17c00;
  --error-color: #d32f2f;
  --dark-bg: #f8f9fa;
  --card-bg: #ffffff;
  --glass-bg: rgba(255, 255, 255, 0.85);
  --text-primary: #1a1a1a;
  --text-secondary: #4a4a4a;
  --text-muted: #6c757d;
  --gradient-primary: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
  --gradient-secondary: linear-gradient(135deg, var(--accent-color), var(--warning-color));
  --gradient-dark: linear-gradient(135deg, #e9ecef, #dee2e6, #ced4da);
  --shadow-glow: 0 0 30px rgba(0, 123, 181, 0.15);
  --shadow-soft: 0 8px 32px rgba(0, 0, 0, 0.08);
}
`;

// Remove the old :root definitions
css = css.replace(/:root\s*\{[^}]+\}/g, '');
css = themeVars + css;

fs.writeFileSync('styles.css', css);
console.log('CSS T5 patched.');
