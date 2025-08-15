import type { DifyConfig, ChatTheme } from "../types";

export interface InitDifyChatOptions {
  config: DifyConfig;
  theme?: ChatTheme;
  container?: string | HTMLElement;
}

/**
 * Initialize Dify Chat Tools with global styles
 */
export const initDifyChat = (options: InitDifyChatOptions) => {
  const { config, theme, container } = options;

  // Validate config
  if (!config.apiKey) {
    throw new Error("Dify API key is required");
  }
  if (!config.baseUrl) {
    throw new Error("Dify base URL is required");
  }

  // Inject global styles if not already present
  if (!document.getElementById("dify-chat-tools-styles")) {
    const styleElement = document.createElement("style");
    styleElement.id = "dify-chat-tools-styles";
    styleElement.textContent = `
      /* Dify Chat Tools Global Styles */
      .dify-chatbot {
        font-family: Arial,Helvetica,sans-serif, 'Roboto', 'Oxygen',
          'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
          sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .dify-chatbot-container {
        /* 完整的 pfchat CSS 变量定义 - 与 globals.css 保持一致 */
        --pfchat-background: 0 0% 100%;
        --pfchat-foreground: 240 10% 3.9%;
        --pfchat-card: 0 0% 100%;
        --pfchat-card-foreground: 240 10% 3.9%;
        --pfchat-popover: 0 0% 100%;
        --pfchat-popover-foreground: 240 10% 3.9%;
        --pfchat-primary: 240 5.9% 10%;
        --pfchat-primary-foreground: 0 0% 98%;
        --pfchat-secondary: 240 4.8% 95.9%;
        --pfchat-secondary-foreground: 240 5.9% 10%;
        --pfchat-muted: 240 4.8% 95.9%;
        --pfchat-muted-foreground: 240 3.8% 46.1%;
        --pfchat-accent: 240 4.8% 95.9%;
        --pfchat-accent-foreground: 240 5.9% 10%;
        --pfchat-destructive: 0 84.2% 60.2%;
        --pfchat-destructive-foreground: 0 0% 98%;
        --pfchat-border: 240 5.9% 90%;
        --pfchat-input: 240 5.9% 90%;
        --pfchat-ring: 240 10% 3.9%;
        --pfchat-radius: 0.75rem;
      }

      .dify-chatbot-container.dark {
        /* 暗色主题的 pfchat CSS 变量定义 */
        --pfchat-background: 220 13% 9%;
        --pfchat-foreground: 210 40% 98%;
        --pfchat-card: 220 13% 9%;
        --pfchat-card-foreground: 210 40% 98%;
        --pfchat-popover: 220 13% 9%;
        --pfchat-popover-foreground: 210 40% 98%;
        --pfchat-primary: 210 100% 70%;
        --pfchat-primary-foreground: 220 13% 9%;
        --pfchat-secondary: 215 25% 15%;
        --pfchat-secondary-foreground: 210 40% 98%;
        --pfchat-muted: 215 25% 15%;
        --pfchat-muted-foreground: 215 20% 65%;
        --pfchat-accent: 215 25% 15%;
        --pfchat-accent-foreground: 210 40% 98%;
        --pfchat-destructive: 0 62.8% 30.6%;
        --pfchat-destructive-foreground: 210 40% 98%;
        --pfchat-border: 215 25% 20%;
        --pfchat-input: 215 25% 15%;
        --pfchat-ring: 210 100% 70%;
      }

      .dify-chatbot-messages {
        scrollbar-width: thin;
        scrollbar-color: hsl(var(--pfchat-muted)) transparent;
      }

      .dify-chatbot-messages::-webkit-scrollbar {
        width: 6px;
      }

      .dify-chatbot-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .dify-chatbot-messages::-webkit-scrollbar-thumb {
        background-color: hsl(var(--pfchat-muted));
        border-radius: 3px;
      }

      .dify-chatbot-messages::-webkit-scrollbar-thumb:hover {
        background-color: hsl(var(--pfchat-muted-foreground));
      }

      @keyframes dify-fade-in {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }

      @keyframes dify-slide-up {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }

      @keyframes dify-typing {
        0%, 60% { opacity: 1; }
        30% { opacity: 0.5; }
      }

      .dify-fade-in {
        animation: dify-fade-in 0.2s ease-out;
      }

      .dify-slide-up {
        animation: dify-slide-up 0.3s ease-out;
      }

      .dify-typing {
        animation: dify-typing 1.5s ease-in-out infinite;
      }

      .dify-text-selection {
        background-color: rgba(59, 130, 246, 0.2);
        border-radius: 2px;
        padding: 1px 2px;
      }

      .dify-floating-chatbot {
        position: fixed;
        z-index: 9999;
      }

      .dify-floating-chatbot.bottom-right {
        bottom: 20px;
        right: 20px;
      }

      .dify-floating-chatbot.bottom-left {
        bottom: 20px;
        left: 20px;
      }

      .dify-floating-chatbot.top-right {
        top: 20px;
        right: 20px;
      }

      .dify-floating-chatbot.top-left {
        top: 20px;
        left: 20px;
      }
    `;
    document.head.appendChild(styleElement);
  }

  // Apply theme to container if provided
  if (theme && container) {
    const targetElement =
      typeof container === "string"
        ? (document.querySelector(container) as HTMLElement)
        : container;

    if (targetElement) {
      if (theme.primary) {
        targetElement.style.setProperty("--pfchat-primary", theme.primary);
      }
      if (theme.secondary) {
        targetElement.style.setProperty("--pfchat-secondary", theme.secondary);
      }
      if (theme.background) {
        targetElement.style.setProperty(
          "--pfchat-background",
          theme.background
        );
      }
      if (theme.text) {
        targetElement.style.setProperty("--pfchat-foreground", theme.text);
      }
      if (theme.border) {
        targetElement.style.setProperty("--pfchat-border", theme.border);
      }
      if (theme.borderRadius) {
        targetElement.style.setProperty("--pfchat-radius", theme.borderRadius);
      }
      if (theme.fontFamily) {
        targetElement.style.fontFamily = theme.fontFamily;
      }
    }
  }

  return {
    config,
    theme,
    container,
  };
};

/**
 * Cleanup Dify Chat Tools global styles
 */
export const cleanupDifyChat = () => {
  const styleElement = document.getElementById("dify-chat-tools-styles");
  if (styleElement) {
    styleElement.remove();
  }
};
