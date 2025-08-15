const fs = require('fs');
const path = require('path');

function fixDuplicatePrefix(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 修复重复前缀问题
    const duplicatePrefix = /dify-dify-/g;
    if (duplicatePrefix.test(content)) {
      content = content.replace(duplicatePrefix, 'dify-');
      modified = true;
    }

    // 修复一些特殊情况
    const specialCases = [
      // 修复 variant 名称
      { from: /variant\?\:\s*"dify-outline"/g, to: 'variant?: "outline"' },
      { from: /"dify-outline"/g, to: '"outline"' },
      
      // 修复 hover 状态中的重复前缀
      { from: /hover:dify-dify-/g, to: 'hover:dify-' },
      { from: /focus-visible:dify-dify-/g, to: 'focus-visible:dify-' },
      { from: /disabled:dify-dify-/g, to: 'disabled:dify-' },
      { from: /dark:dify-dify-/g, to: 'dark:dify-' },
      { from: /md:dify-dify-/g, to: 'md:dify-' },
      { from: /lg:dify-dify-/g, to: 'lg:dify-' },
      { from: /first:dify-dify-/g, to: 'first:dify-' },
      { from: /placeholder:dify-dify-/g, to: 'placeholder:dify-' },
      
      // 修复复杂选择器
      { from: /group-data-\[role=user\]\/message:dify-dify-/g, to: 'group-data-[role=user]/message:dify-' },
    ];

    specialCases.forEach(({ from, to }) => {
      if (from.test(content)) {
        content = content.replace(from, to);
        modified = true;
      }
    });

    if (modified) {
      fs.writeFileSync(filePath, content);
      console.log(`🔧 Fixed: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message);
  }
}

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts')) {
      fixDuplicatePrefix(fullPath);
    }
  });
}

// 处理 src 目录
const srcPath = path.join(__dirname, '../src');
console.log('🔧 Fixing duplicate dify- prefixes...');
processDirectory(srcPath);
console.log('✨ Done!');
