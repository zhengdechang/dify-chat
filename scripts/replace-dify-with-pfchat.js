const fs = require('fs');
const path = require('path');

function replaceDifyWithPfchat(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 替换所有 dify- 前缀为 pfchat-
    const replacements = [
      { from: /dify-chatbot/g, to: 'pfchat-chatbot' },
      { from: /dify-floating-chatbot/g, to: 'pfchat-floating-chatbot' },
      { from: /dify-text-selection-chatbot/g, to: 'pfchat-text-selection-chatbot' },
      { from: /dify-chatbot-container/g, to: 'pfchat-chatbot-container' },
      { from: /dify-chatbot-messages/g, to: 'pfchat-chatbot-messages' },
      { from: /dify-fade-in/g, to: 'pfchat-fade-in' },
      { from: /dify-slide-up/g, to: 'pfchat-slide-up' },
      { from: /dify-typing/g, to: 'pfchat-typing' },
      { from: /dify-text-selection/g, to: 'pfchat-text-selection' },
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
    replaceDifyWithPfchat(filePath);
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
console.log('🚀 Replacing dify- prefixes with pfchat- prefixes...');
processDirectory(srcPath);
console.log('✨ Done!');
