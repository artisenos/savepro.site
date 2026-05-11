const fs = require('fs');
const path = require('path');

const replacements = [
  { regex: /\bbg-white\b/g, replacement: 'bg-white dark:bg-slate-950' },
  { regex: /\bbg-slate-50\b/g, replacement: 'bg-slate-50 dark:bg-slate-900' },
  { regex: /\btext-slate-900\b/g, replacement: 'text-slate-900 dark:text-white' },
  { regex: /\btext-slate-600\b/g, replacement: 'text-slate-600 dark:text-slate-300' },
  { regex: /\btext-slate-500\b/g, replacement: 'text-slate-500 dark:text-slate-400' },
  { regex: /\btext-slate-400\b/g, replacement: 'text-slate-400 dark:text-slate-500' },
  { regex: /\bborder-slate-200\b/g, replacement: 'border-slate-200 dark:border-slate-800' },
  { regex: /\bborder-slate-100\b/g, replacement: 'border-slate-100 dark:border-slate-800/50' },
  { regex: /\bring-slate-200\b/g, replacement: 'ring-slate-200 dark:ring-slate-800' },
  { regex: /\bshadow-blue-900\/5\b/g, replacement: 'shadow-blue-900/5 dark:shadow-none' }
];

function processFile(filePath) {
  if (!filePath.endsWith('.tsx')) return;
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;
  
  replacements.forEach(({ regex, replacement }) => {
    if (regex.test(content)) {
      content = content.replace(regex, replacement);
      changed = true;
    }
  });

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated ${filePath}`);
  }
}

function walk(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walk(filePath);
    } else {
      processFile(filePath);
    }
  }
}

walk('../src/app');
console.log("Done");