import React from 'react';
import { Markdown, MarkdownContent } from '../components/ui/Markdown';

const testMarkdown = `# Markdown Test

This is a test of the new Markdown component with **bold text** and *italic text*.

## Code Highlighting Test

Here's some JavaScript code:

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return \`Welcome to Dify Chat Tools!\`;
}

const user = "Developer";
greet(user);
\`\`\`

Here's some Python code:

\`\`\`python
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# Generate first 10 fibonacci numbers
for i in range(10):
    print(f"F({i}) = {fibonacci(i)}")
\`\`\`

## Lists and Other Elements

### Unordered List
- Item 1
- Item 2
  - Nested item
  - Another nested item
- Item 3

### Ordered List
1. First item
2. Second item
3. Third item

### Blockquote
> This is a blockquote with some important information.
> It can span multiple lines.

### Table
| Feature | Status | Notes |
|---------|--------|-------|
| Code Highlighting | ✅ | Using Shiki |
| Block Rendering | ✅ | Optimized performance |
| Markdown Support | ✅ | Full GFM support |

### Inline Code
Use \`npm install dify-chat-tools\` to install the package.

That's it! The new Markdown component is working great.`;

export const MarkdownTest: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">Markdown Component Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Simple Markdown Component</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            <Markdown>{testMarkdown}</Markdown>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold mb-4">Block-based MarkdownContent</h2>
          <div className="border rounded-lg p-4 bg-gray-50">
            <MarkdownContent 
              content={testMarkdown} 
              id="test-markdown" 
              className="markdown-test"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
