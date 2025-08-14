export interface DifyConfig {
  apiKey: string;
  baseUrl: string;
  userId?: string;
  inputs?: Record<string, any>;
}

export interface DifyMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  attachments?: DifyAttachment[];
}

export interface DifyAttachment {
  id?: string;
  url?: string;
  type: "image" | "document" | "audio" | "video";
  name: string;
  size: number;
}

export interface DifyApiResponse {
  answer: string;
  conversation_id: string;
  message_id: string;
  metadata?: {
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
  };
}

export interface DifyStreamResponse {
  event:
    | "message"
    | "agent_message"
    | "message_end"
    | "workflow_started"
    | "workflow_finished"
    | "node_started"
    | "node_finished"
    | "error"
    | string;
  answer?: string;
  conversation_id?: string;
  message_id?: string;
  task_id?: string;
  workflow_run_id?: string;
  created_at?: number;
  data?: {
    id?: string;
    node_id?: string;
    node_type?: string;
    workflow_id?: string;
    total_tokens?: number;
    created_at?: number;
    [key: string]: any;
  };
  metadata?: {
    usage?: {
      prompt_tokens: number;
      completion_tokens: number;
      total_tokens: number;
    };
    [key: string]: any;
  };
  message?: string;
  files?: any[];
}

export interface ChatTheme {
  primary?: string;
  secondary?: string;
  background?: string;
  text?: string;
  border?: string;
  borderRadius?: string;
  fontFamily?: string;
}

export type DisplayMode =
  | "embedded"
  | "fullscreen"
  | "floating"
  | "text-selection";

export interface DifyChatbotProps {
  config: DifyConfig;
  theme?: ChatTheme;
  displayMode?: DisplayMode;
  placeholder?: string;
  title?: string;
  subtitle?: string;
  avatar?: string;
  className?: string;
  style?: React.CSSProperties;
  onMessage?: (message: DifyMessage) => void;
  onError?: (error: Error) => void;
  onFullscreenChange?: (isFullscreen: boolean) => void;
  maxHeight?: number;
  maxWidth?: number;
  showHeader?: boolean;
  showAvatar?: boolean;
  allowFileUpload?: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  initialMessage?: string;
  // Scroll behavior control
  preventExternalScroll?: boolean; // Whether to prevent external page scroll when at boundaries
  isolateScroll?: boolean; // Whether to use fixed positioning to completely isolate from page scroll
}

export interface FloatingChatbotProps
  extends Omit<DifyChatbotProps, "displayMode"> {
  position?: "bottom-right" | "bottom-left" | "top-right" | "top-left";
  offset?: { x: number; y: number };
  trigger?: React.ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  // Custom icon and text
  triggerIcon?: React.ReactNode;
  triggerText?: string;
}

export interface TextSelectionChatbotProps
  extends Omit<DifyChatbotProps, "displayMode"> {
  enabled?: boolean;
  minSelectionLength?: number;
  maxSelectionLength?: number;
  onSelectionChange?: (selectedText: string) => void;
  // Target selector - only elements with this attribute can trigger text selection
  targetAttribute?: string;
  // Custom icon and text
  triggerIcon?: React.ReactNode;
  triggerText?: string;
}

export interface ChatInputProps {
  onSendMessage: (message: string, attachments?: DifyAttachment[]) => void;
  onUploadFile?: (file: File) => Promise<DifyAttachment>;
  placeholder?: string;
  disabled?: boolean;
  allowFileUpload?: boolean;
  allowedFileTypes?: string[];
  maxFileSize?: number;
  initialMessage?: string;
}

export interface MessageProps {
  message: DifyMessage;
  showAvatar?: boolean;
  assistantAvatar?: string;
  userAvatar?: string;
}

export interface UseDifyChatOptions {
  config: DifyConfig;
  onMessage?: (message: DifyMessage) => void;
  onError?: (error: Error) => void;
  enableStreaming?: boolean;
}

export interface UseDifyChatReturn {
  messages: DifyMessage[];
  isLoading: boolean;
  error: Error | null;
  isStopping: boolean;
  sendMessage: (
    content: string,
    attachments?: DifyAttachment[]
  ) => Promise<void>;
  stopMessage: () => Promise<void>;
  uploadFile: (file: File) => Promise<DifyAttachment>;
  clearMessages: () => void;
  resetConversation: () => void;
}

// Scroll control interface for DifyChatbot ref
export interface DifyChatbotScrollRef {
  // Scroll information
  getScrollInfo: () => {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
    isAtTop: boolean;
    isAtBottom: boolean;
    isNearBottom: boolean;
  };
  // Scroll control methods
  scrollToTop: () => void;
  scrollToBottom: () => void;
  scrollTo: (position: number) => void;
  scrollBy: (delta: number) => void;
  // Auto-scroll control
  enableAutoScroll: () => void;
  disableAutoScroll: () => void;
  isAutoScrollEnabled: () => boolean;
}
