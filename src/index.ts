// Import styles
import "./styles/globals.css";

// Export main components
export { DifyChatbot } from "./components/DifyChatbot";
export { DifyFloatingChatbot } from "./components/DifyFloatingChatbot";
export { DifyTextSelectionChatbot } from "./components/DifyTextSelectionChatbot";

// Export UI components
export { Message, TypingIndicator } from "./components/Message";
export { ChatInput } from "./components/ChatInput";
export { Button } from "./components/ui/Button";

// Export hooks
export { useDifyChat } from "./hooks/useDifyChat";
export {
  useTheme,
  applyThemeToElement,
  removeThemeFromElement,
} from "./hooks/useTheme";

// Export API
export { DifyApi } from "./api/dify";

// Export utilities
export { initDifyChat, cleanupDifyChat } from "./utils/init";

// Export themes
export {
  presetThemes,
  defaultTheme,
  lightTheme,
  darkTheme,
} from "./themes/presets";

// Export types
export type {
  DifyConfig,
  DifyMessage,
  DifyAttachment,
  DifyApiResponse,
  DifyStreamResponse,
  ChatTheme,
  DisplayMode,
  DifyChatbotProps,
  FloatingChatbotProps,
  TextSelectionChatbotProps,
  ChatInputProps,
  MessageProps,
  UseDifyChatOptions,
  UseDifyChatReturn,
} from "./types";

export type { PresetThemeName } from "./themes/presets";

// Default export for convenience
export { DifyChatbot as default } from "./components/DifyChatbot";
