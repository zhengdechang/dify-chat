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
        --primary: 59 130 246;
        --secondary: 156 163 175;
        --background: 255 255 255;
        --foreground: 17 24 39;
        --border: 229 231 235;
        --radius: 0.5rem;
      }

      .dify-chatbot-messages {
        scrollbar-width: thin;
        scrollbar-color: hsl(var(--muted)) transparent;
      }

      .dify-chatbot-messages::-webkit-scrollbar {
        width: 6px;
      }

      .dify-chatbot-messages::-webkit-scrollbar-track {
        background: transparent;
      }

      .dify-chatbot-messages::-webkit-scrollbar-thumb {
        background-color: hsl(var(--muted));
        border-radius: 3px;
      }

      .dify-chatbot-messages::-webkit-scrollbar-thumb:hover {
        background-color: hsl(var(--muted-foreground));
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
        targetElement.style.setProperty("--primary", theme.primary);
      }
      if (theme.secondary) {
        targetElement.style.setProperty("--secondary", theme.secondary);
      }
      if (theme.background) {
        targetElement.style.setProperty("--background", theme.background);
      }
      if (theme.text) {
        targetElement.style.setProperty("--foreground", theme.text);
      }
      if (theme.border) {
        targetElement.style.setProperty("--border", theme.border);
      }
      if (theme.borderRadius) {
        targetElement.style.setProperty("--radius", theme.borderRadius);
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
