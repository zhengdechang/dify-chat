const fs = require('fs');
const path = require('path');

function replaceCssVars(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 替换所有 CSS 变量引用，添加 pfchat- 前缀
    const replacements = [
      { from: /var\(--background\)/g, to: 'var(--pfchat-background)' },
      { from: /var\(--foreground\)/g, to: 'var(--pfchat-foreground)' },
      { from: /var\(--card\)/g, to: 'var(--pfchat-card)' },
      { from: /var\(--card-foreground\)/g, to: 'var(--pfchat-card-foreground)' },
      { from: /var\(--popover\)/g, to: 'var(--pfchat-popover)' },
      { from: /var\(--popover-foreground\)/g, to: 'var(--pfchat-popover-foreground)' },
      { from: /var\(--primary\)/g, to: 'var(--pfchat-primary)' },
      { from: /var\(--primary-foreground\)/g, to: 'var(--pfchat-primary-foreground)' },
      { from: /var\(--secondary\)/g, to: 'var(--pfchat-secondary)' },
      { from: /var\(--secondary-foreground\)/g, to: 'var(--pfchat-secondary-foreground)' },
      { from: /var\(--muted\)/g, to: 'var(--pfchat-muted)' },
      { from: /var\(--muted-foreground\)/g, to: 'var(--pfchat-muted-foreground)' },
      { from: /var\(--accent\)/g, to: 'var(--pfchat-accent)' },
      { from: /var\(--accent-foreground\)/g, to: 'var(--pfchat-accent-foreground)' },
      { from: /var\(--destructive\)/g, to: 'var(--pfchat-destructive)' },
      { from: /var\(--destructive-foreground\)/g, to: 'var(--pfchat-destructive-foreground)' },
      { from: /var\(--border\)/g, to: 'var(--pfchat-border)' },
      { from: /var\(--input\)/g, to: 'var(--pfchat-input)' },
      { from: /var\(--ring\)/g, to: 'var(--pfchat-ring)' },
      { from: /var\(--radius\)/g, to: 'var(--pfchat-radius)' },
    ];

    replacements.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`✅ Updated: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
  }
}

function processFile(filePath) {
  const ext = path.extname(filePath);
  if (['.css', '.scss', '.less'].includes(ext)) {
    replaceCssVars(filePath);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(fullPath);
    } else if (stat.isFile()) {
      processFile(fullPath);
    }
  });
}

// 处理 src 目录
const srcPath = path.join(__dirname, '../src');
console.log('🚀 Replacing CSS variables with pfchat- prefixes...');
processDirectory(srcPath);
console.log('✨ Done!');
