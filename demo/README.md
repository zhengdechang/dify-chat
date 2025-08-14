# Dify Chat Tools Demo

这是一个展示 [@codedevin/dify-cchat](https://www.npmjs.com/package/@codedevin/dify-cchat) 包的演示项目，展示了三种不同的聊天机器人集成模式。

## 功能特性

### 🤖 三种聊天机器人模式

1. **嵌入式聊天机器人** - 直接嵌入到页面中的聊天界面
2. **浮动聊天机器人** - 页面右下角的浮动聊天按钮
3. **文本选择聊天机器人** - 选择文本时自动出现的聊天工具

### ✨ 主要特点

- 🎨 美观的 UI 设计，支持深色模式
- 🔧 高度可定制的主题和样式
- 📱 响应式设计，支持移动端
- ⚡ 基于 React 和 TypeScript 构建
- 🚀 与 Dify AI 平台无缝集成

## 快速开始

### 安装依赖

```bash
npm install
```

### 配置 Dify API

在 `src/app/page.tsx` 中更新 Dify 配置：

```typescript
const difyConfig = {
  baseUrl: "https://api.dify.ai/v1", // 你的 Dify API 地址
  apiKey: "app-xxx", // 你的 Dify App Token (格式: app-xxx)
  userId: "demo-user", // 用户标识
  inputs: {}, // 可选的输入参数
};
```

### 启动开发服务器

```bash
npm run dev
```

打开 [http://localhost:3000](http://localhost:3000) 查看演示效果。

## 使用说明

### 1. 嵌入式聊天机器人

```tsx
import { DifyChatbot } from "@codedevin/dify-cchat";
import "@codedevin/dify-cchat/dist/style.css";

<DifyChatbot
  apiUrl="https://api.dify.ai/v1"
  apiKey="your-api-key"
  user="user-id"
  className="h-96"
  theme={{
    primaryColor: "#3B82F6",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
  }}
/>;
```

### 2. 浮动聊天机器人

```tsx
import { DifyFloatingChatbot } from "@codedevin/dify-cchat";

<DifyFloatingChatbot
  apiUrl="https://api.dify.ai/v1"
  apiKey="your-api-key"
  user="user-id"
  position="bottom-right"
  theme={{
    primaryColor: "#10B981",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
  }}
/>;
```

### 3. 文本选择聊天机器人

```tsx
import { DifyTextSelectionChatbot } from "@codedevin/dify-cchat";

<DifyTextSelectionChatbot
  apiUrl="https://api.dify.ai/v1"
  apiKey="your-api-key"
  user="user-id"
  theme={{
    primaryColor: "#8B5CF6",
    backgroundColor: "#FFFFFF",
    textColor: "#1F2937",
  }}
/>;
```

## 技术栈

- **框架**: Next.js 15 with App Router
- **语言**: TypeScript
- **样式**: Tailwind CSS
- **聊天组件**: @codedevin/dify-cchat
- **AI 平台**: Dify

## 项目结构

```
dify-chat-demo/
├── src/
│   └── app/
│       ├── page.tsx          # 主页面，展示三种聊天模式
│       ├── layout.tsx        # 布局组件
│       └── globals.css       # 全局样式
├── public/                   # 静态资源
├── package.json             # 项目配置
└── README.md               # 项目说明
```

## 部署

### Vercel 部署

1. 将项目推送到 GitHub
2. 在 [Vercel](https://vercel.com) 中导入项目
3. 配置环境变量（如果需要）
4. 部署完成

### 其他平台

项目是标准的 Next.js 应用，可以部署到任何支持 Node.js 的平台：

```bash
npm run build
npm start
```

## 许可证

MIT License

## 相关链接

- [Dify Chat Tools NPM 包](https://www.npmjs.com/package/@codedevin/dify-cchat)
- [Dify AI 平台](https://dify.ai)
- [Next.js 文档](https://nextjs.org/docs)
