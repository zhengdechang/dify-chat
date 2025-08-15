const fs = require('fs');
const path = require('path');

// 常用的 Tailwind 类名列表
const tailwindClasses = [
  // Layout
  'flex', 'items-center', 'justify-center', 'justify-between', 'justify-end', 'justify-start',
  'flex-col', 'flex-row', 'flex-wrap', 'items-start', 'items-end',
  
  // Spacing
  'gap-1', 'gap-2', 'gap-3', 'gap-4', 'gap-5', 'gap-6', 'gap-8',
  'p-1', 'p-2', 'p-3', 'p-4', 'p-6', 'p-8', 'p-\\[2px\\]',
  'px-2', 'px-3', 'px-4', 'px-8', 'px-\\[0\\.3rem\\]',
  'py-1', 'py-2', 'py-3', 'py-\\[0\\.2rem\\]',
  'm-0', 'mx-auto', 'my-0', 'my-4', 'my-6', 'my-8',
  'mb-0', 'mb-2', 'mb-4', 'mb-8', 'ml-6', 'mr-2', 'mt-1', 'mt-2', 'mt-4', 'mt-8', 'mt-\\[0\\.7rem\\]',
  'pb-2', 'pb-4', 'pb-10', 'pl-6', 'pt-4',
  
  // Sizing
  'w-full', 'w-fit', 'w-4', 'w-5', 'w-6', 'w-8', 'w-10', 'w-2', 'w-3', 'w-screen',
  'h-full', 'h-4', 'h-5', 'h-6', 'h-8', 'h-9', 'h-10', 'h-11', 'h-2', 'h-3', 'h-96', 'h-\\[400px\\]', 'h-auto', 'h-fit', 'h-screen',
  'min-w-0', 'min-w-\\[24px\\]', 'max-w-2xl', 'max-w-3xl', 'max-w-4xl', 'max-w-\\[120px\\]',
  'min-h-\\[24px\\]', 'min-h-\\[80px\\]', 'min-h-screen', 'max-h-\\[calc\\(75dvh\\)\\]',
  'size-8', 'size-0\\.5',
  
  // Typography
  'text-sm', 'text-xs', 'text-lg', 'text-xl', 'text-2xl', 'text-3xl', 'text-4xl', 'text-base',
  'font-medium', 'font-semibold', 'font-bold', 'leading-6', 'tracking-tight', 'italic',
  'text-left', 'text-center', 'font-mono',
  
  // Colors
  'bg-background', 'bg-card', 'bg-muted', 'bg-primary', 'bg-accent', 'bg-secondary', 'bg-destructive',
  'bg-white', 'bg-gray-50', 'bg-gray-100', 'bg-blue-50', 'bg-green-50', 'bg-yellow-50',
  'bg-green-500', 'bg-muted-foreground', 'bg-\\[\\#f9f9f9\\]',
  'bg-destructive\\/10', 'bg-gradient-to-b', 'bg-gradient-to-r',
  'from-blue-100', 'from-green-100', 'from-purple-100', 'from-purple-500', 'from-red-100',
  'to-blue-200', 'to-green-200', 'to-pink-500', 'to-purple-200', 'to-red-200',
  
  'text-foreground', 'text-muted-foreground', 'text-primary-foreground', 'text-card-foreground',
  'text-secondary-foreground', 'text-destructive-foreground', 'text-destructive',
  'text-primary', 'text-white', 'text-gray-600', 'text-gray-700',
  'text-blue-700', 'text-blue-800', 'text-green-700', 'text-green-800',
  'text-purple-800', 'text-red-800', 'text-yellow-700', 'text-yellow-800',
  'text-zinc-500', 'text-zinc-600', 'text-zinc-900', 'text-muted-foreground\\/30',
  
  // Borders
  'border', 'border-0', 'border-2', 'border-b', 'border-l-2', 'border-none',
  'border-input', 'border-border', 'border-gray-200', 'border-blue-500',
  'rounded', 'rounded-md', 'rounded-lg', 'rounded-xl', 'rounded-2xl', 'rounded-full',
  'rounded-t-xl', 'rounded-b-xl', 'rounded-bl-lg',
  
  // Effects
  'shadow-sm', 'shadow-lg', 'shadow-xl', 'ring-1', 'ring-border', 'ring-offset-background',
  'transition-colors', 'transition', 'transition-all', 'duration-200', 'duration-300', 'ease-in-out',
  'opacity-0', 'opacity-60', 'grayscale', 'filter',
  
  // Positioning
  'absolute', 'relative', 'fixed', 'inset-0', 'top-0', 'bottom-0', 'left-0', 'right-0',
  'bottom-28', 'left-1\\/2', '-left-4', '-right-1', '-top-1', '-top-4',
  'z-40', 'z-50', 'z-\\[99998\\]', 'z-\\[99999\\]', 'z-\\[99999999999\\]',
  
  // Transform
  'translate-y-px', '-translate-x-1\\/2', '-rotate-45', 'transform',
  
  // Display
  'block', 'inline-flex', 'table', 'grid', 'hidden',
  'flex-1', 'shrink-0', 'isolate',
  
  // Overflow
  'overflow-hidden', 'overflow-x-auto', 'overflow-y-auto', 'truncate',
  'whitespace-nowrap', 'whitespace-pre-wrap',
  
  // Lists
  'list-inside', 'list-decimal', 'list-disc', 'scroll-m-20',
  
  // Grid
  'grid-cols-1', 'space-x-1', 'space-y-1', 'space-y-4', 'space-y-8',
  
  // Cursor
  'cursor-pointer', 'resize-none', 'resize',
  
  // Animation
  'animate-pulse',
  
  // Object
  'object-cover',
  
  // Decoration
  'underline', 'underline-offset-4', 'antialiased',
  
  // Outline
  'outline',
  
  // Hover states
  'hover:bg-accent', 'hover:text-accent-foreground', 'hover:bg-primary\\/90',
  'hover:bg-secondary\\/80', 'hover:bg-destructive\\/90', 'hover:bg-zinc-200',
  'hover:text-foreground', 'hover:text-zinc-700', 'hover:underline',
  'hover:border-gray-300', 'hover:scale-110', 'hover:shadow-xl',
  
  // Focus states
  'focus-visible:outline-none', 'focus-visible:ring-2', 'focus-visible:ring-ring', 'focus-visible:ring-offset-2',
  
  // Disabled states
  'disabled:pointer-events-none', 'disabled:cursor-not-allowed', 'disabled:opacity-50',
  
  // Placeholder
  'placeholder:text-muted-foreground',
  
  // First child
  'first:mt-0',
  
  // Group states
  'group-data-\\[role\\=user\\]\\/message:ml-auto', 'group-data-\\[role\\=user\\]\\/message:w-fit', 'group-data-\\[role\\=user\\]\\/message:max-w-2xl',
  
  // Media queries
  'md:my-8', 'md:max-w-3xl', 'md:grid-cols-2', 'md:pb-6',
  'lg:grid-cols-2',
  
  // Dark mode
  'dark:border-zinc-600', 'dark:bg-zinc-950', 'dark:text-zinc-300', 'dark:text-zinc-400', 'dark:text-zinc-50',
  'dark:hover:bg-zinc-800', 'dark:hover:text-zinc-200',
  
  // Complex selectors
  '\\[\\&:not\\(:first-child\\)\\]:mt-4', '\\[\\&\\[align\\=center\\]\\]:text-center', '\\[\\&\\[align\\=right\\]\\]:text-right',
  '\\[\\&_svg\\]:pointer-events-none', '\\[\\&_svg\\]:size-4', '\\[\\&_svg\\]:shrink-0',
  
  // Container
  '\\!container', 'container',
  
  // Pointer events
  'pointer-events-none', 'pointer-events-auto'
];

function addDifyPrefix(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 为每个 Tailwind 类名添加 dify- 前缀
    tailwindClasses.forEach(className => {
      // 创建正则表达式来匹配类名
      const regex = new RegExp(`\\b${className}\\b`, 'g');
      
      if (regex.test(content)) {
        content = content.replace(regex, `dify-${className}`);
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

function processDirectory(dirPath) {
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
      processDirectory(fullPath);
    } else if (file.endsWith('.tsx') || file.endsWith('.jsx') || file.endsWith('.ts')) {
      addDifyPrefix(fullPath);
    }
  });
}

// 处理 src 目录
const srcPath = path.join(__dirname, '../src');
console.log('🚀 Adding dify- prefix to Tailwind classes...');
processDirectory(srcPath);
console.log('✨ Done!');
