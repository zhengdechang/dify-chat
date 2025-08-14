# Dify Chat Tools

A beautiful and configurable chatbot widget library for Dify integration with multiple display modes.

## Features

- 🎨 **Multiple Display Modes**: Embedded, floating, and text-selection chatbots
- 🎯 **Easy Integration**: Simple React components with TypeScript support
- 🎨 **Customizable Themes**: Pre-built themes and custom styling options
- 📱 **Responsive Design**: Works on desktop and mobile devices
- 🔄 **Real-time Streaming**: Advanced SSE parsing with proper event handling
- 📎 **File Upload**: Support for file attachments with validation
- 🌐 **Text Selection**: Interactive text selection chatbot with context
- ⚡ **Lightweight**: Optimized bundle size (~40KB gzipped)
- 🚀 **Production Ready**: Comprehensive error handling and loading states
- 🎭 **Animations**: Smooth animations with Framer Motion
- 🔧 **Developer Friendly**: Full TypeScript support with detailed types

## Installation

```bash
npm install dify-chat-tools
```

## Quick Start

### Basic Embedded Chatbot

```tsx
import React from "react";
import { DifyChatbot } from "dify-chat-tools";

const config = {
  apiKey: "app-xxx", // Replace with your actual Dify app token
  baseUrl: "https://api.dify.ai/v1",
  userId: "user-id",
  inputs: {},
};

function App() {
  return (
    <div style={{ height: "500px", width: "400px" }}>
      <DifyChatbot
        config={config}
        title="AI Assistant"
        placeholder="Type your message..."
      />
    </div>
  );
}
```

### Floating Chatbot

```tsx
import React from "react";
import { DifyFloatingChatbot } from "dify-chat-tools";

function App() {
  return (
    <div>
      {/* Your app content */}
      <DifyFloatingChatbot
        config={config}
        position="bottom-right"
        title="Help Assistant"
      />
    </div>
  );
}
```

### Text Selection Chatbot

```tsx
import React from "react";
import { DifyTextSelectionChatbot } from "dify-chat-tools";

function App() {
  return (
    <div>
      {/* Your content with selectable text */}
      <p>Select any text to ask questions about it!</p>

      <DifyTextSelectionChatbot
        config={config}
        enabled={true}
        title="Text Assistant"
      />
    </div>
  );
}
```

## Configuration

### Dify Config

```tsx
interface DifyConfig {
  apiKey: string; // Your Dify app token (format: app-xxx)
  baseUrl: string; // Your Dify API base URL (default: https://api.dify.ai/v1)
  userId?: string; // Optional user ID
  inputs?: Record<string, any>; // Optional input variables
}
```

### Example Configuration

```tsx
const config = {
  apiKey: "app-xxx", // Replace with your actual Dify app token
  baseUrl: "https://api.dify.ai/v1",
  userId: "user-123",
  inputs: {
    language: "en",
    context: "customer-support",
  },
};
```

## Themes

### Using Preset Themes

```tsx
import { DifyChatbot, presetThemes } from "dify-chat-tools";

// Use light theme (default)
<DifyChatbot config={config} theme={presetThemes.light} />;

// Use dark theme
<DifyChatbot config={config} theme={presetThemes.dark} />;
```

Available preset themes:

- `light` - Light theme with blue accents (default)
- `dark` - Dark theme

### Custom Theme

```tsx
const customTheme = {
  primary: "220 100% 50%",
  secondary: "210 40% 96%",
  background: "0 0% 100%",
  text: "222.2 84% 4.9%",
  border: "214.3 31.8% 91.4%",
  borderRadius: "0.75rem",
  fontFamily: "Inter, sans-serif",
};

<DifyChatbot config={config} theme={customTheme} />;
```

## Components

### DifyChatbot

Main chatbot component for embedded use.

```tsx
<DifyChatbot
  config={config}
  theme={theme}
  title="AI Assistant"
  subtitle="How can I help you?"
  placeholder="Type your message..."
  showHeader={true}
  showAvatar={true}
  allowFileUpload={true}
  maxHeight={500}
  maxWidth={400}
/>
```

### DifyFloatingChatbot

Floating chatbot that appears as a button and expands into a chat window.

```tsx
<DifyFloatingChatbot
  config={config}
  position="bottom-right"
  offset={{ x: 20, y: 20 }}
  defaultOpen={false}
  onOpenChange={(open) => console.log("Chat is", open ? "open" : "closed")}
/>
```

### DifyTextSelectionChatbot

Chatbot that appears when users select text on the page.

```tsx
<DifyTextSelectionChatbot
  config={config}
  enabled={true}
  minSelectionLength={5}
  maxSelectionLength={1000}
  targetAttribute="pfchat"
  onSelectionChange={(text) => console.log("Selected:", text)}
/>
```

#### Target Attribute Usage

You can restrict text selection to specific elements by using the `targetAttribute` prop:

```tsx
// Only text within elements with 'pfchat' attribute can trigger the chatbot
<DifyTextSelectionChatbot
  config={config}
  targetAttribute="pfchat"
/>

// In your HTML/JSX:
<div pfchat>
  <p>This text can trigger the chatbot when selected.</p>
</div>

<div>
  <p>This text will NOT trigger the chatbot when selected.</p>
</div>
```

## API Reference

### Props

#### Common Props (all components)

| Prop              | Type         | Default                  | Description         |
| ----------------- | ------------ | ------------------------ | ------------------- |
| `config`          | `DifyConfig` | Required                 | Dify configuration  |
| `theme`           | `ChatTheme`  | `defaultTheme`           | Theme configuration |
| `title`           | `string`     | `"Chat Assistant"`       | Chatbot title       |
| `subtitle`        | `string`     | -                        | Chatbot subtitle    |
| `placeholder`     | `string`     | `"Type your message..."` | Input placeholder   |
| `showHeader`      | `boolean`    | `true`                   | Show header         |
| `showAvatar`      | `boolean`    | `true`                   | Show avatars        |
| `allowFileUpload` | `boolean`    | `true`                   | Allow file uploads  |
| `disabled`        | `boolean`    | `false`                  | Disable chatbot     |

#### DifyFloatingChatbot Specific

| Prop          | Type                                                           | Default          | Description          |
| ------------- | -------------------------------------------------------------- | ---------------- | -------------------- |
| `position`    | `'bottom-right' \| 'bottom-left' \| 'top-right' \| 'top-left'` | `'bottom-right'` | Position on screen   |
| `offset`      | `{ x: number; y: number }`                                     | `{ x: 0, y: 0 }` | Offset from position |
| `defaultOpen` | `boolean`                                                      | `false`          | Initially open       |

#### DifyTextSelectionChatbot Specific

| Prop                 | Type      | Default | Description                                  |
| -------------------- | --------- | ------- | -------------------------------------------- |
| `enabled`            | `boolean` | `true`  | Enable text selection                        |
| `minSelectionLength` | `number`  | `3`     | Minimum selection length                     |
| `maxSelectionLength` | `number`  | `1000`  | Maximum selection length                     |
| `targetAttribute`    | `string`  | -       | Only trigger on elements with this attribute |

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build library
npm run build:lib

# Type check
npm run type-check
```

## License

MIT
