import React, {
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import { useDifyChat } from "../hooks/useDifyChat";
import { Message, TypingIndicator } from "./Message";
import { ChatInput } from "./ChatInput";
import { Minimize2, Maximize2, RotateCcw, ArrowDown } from "lucide-react";
import { SparklesIcon } from "./icons/SparklesIcon";
import type { DifyChatbotProps, DifyChatbotScrollRef } from "../types";

export const DifyChatbot = forwardRef<DifyChatbotScrollRef, DifyChatbotProps>(
  (
    {
      config,
      theme,
      displayMode = "embedded",
      placeholder = "Type your message...",
      title = "Chat Assistant",
      subtitle,
      avatar,
      className,
      style,
      onMessage,
      onError,
      onFullscreenChange,
      maxHeight = 500,
      maxWidth = 400,
      showHeader = true,
      showAvatar = true,
      allowFileUpload = false,
      allowedFileTypes,
      maxFileSize = 15 * 1024 * 1024,
      autoFocus = false,
      disabled = false,
      initialMessage = "",
    },
    ref
  ) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const messagesContainerRef = useRef<HTMLDivElement>(null);

    // Set default file types if allowFileUpload is true but no types specified
    const finalAllowedFileTypes = allowFileUpload
      ? allowedFileTypes || ["image/png", "image/jpeg"]
      : [];
    const [showScrollButton, setShowScrollButton] = useState(false);
    const [isFullscreen, setIsFullscreen] = useState(false);

    const toggleFullscreen = () => setIsFullscreen((v) => !v);

    // 通知父组件全屏状态变化
    useEffect(() => {
      onFullscreenChange?.(isFullscreen);
    }, [isFullscreen, onFullscreenChange]);

    const {
      messages,
      isLoading,
      error,
      sendMessage,
      stopMessage,
      uploadFile,
      resetConversation,
    } = useDifyChat({
      config,
      onMessage,
      onError,
      enableStreaming: true,
    });

    const [lastMessageCount, setLastMessageCount] = useState(0);
    const [autoScrollEnabled, setAutoScrollEnabled] = useState(true);

    // 自动滚动到底部（新消息或流式更新时）
    useEffect(() => {
      const container = messagesContainerRef.current;
      if (!container || !autoScrollEnabled) return;

      const isNewMessage = messages.length > lastMessageCount;

      if (isLoading || isNewMessage) {
        requestAnimationFrame(() => {
          container.scrollTop = container.scrollHeight;
        });
      }

      setLastMessageCount(messages.length);
    }, [messages, isLoading, autoScrollEnabled]);

    // 显示“回到底部”按钮
    useEffect(() => {
      const container = messagesContainerRef.current;
      if (!container) return;

      const handleScroll = () => {
        const { scrollTop, scrollHeight, clientHeight } = container;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        setShowScrollButton(!isNearBottom && messages.length > 0);
      };

      container.addEventListener("scroll", handleScroll, { passive: true });
      return () => container.removeEventListener("scroll", handleScroll);
    }, [messages.length]);

    // 滚动控制方法
    const getScrollInfo = () => {
      const container = messagesContainerRef.current;
      if (!container) {
        return {
          scrollTop: 0,
          scrollHeight: 0,
          clientHeight: 0,
          isAtTop: true,
          isAtBottom: true,
          isNearBottom: true,
        };
      }

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtTop = scrollTop === 0;
      const isAtBottom = scrollTop + clientHeight >= scrollHeight;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;

      return {
        scrollTop,
        scrollHeight,
        clientHeight,
        isAtTop,
        isAtBottom,
        isNearBottom,
      };
    };

    const scrollToTop = () => {
      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;
        if (container) container.scrollTop = 0;
      });
    };

    const scrollToBottom = () => {
      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;
        if (container) container.scrollTop = container.scrollHeight;
      });
    };

    const scrollTo = (position: number) => {
      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;
        if (container) container.scrollTop = position;
      });
    };

    const scrollBy = (delta: number) => {
      requestAnimationFrame(() => {
        const container = messagesContainerRef.current;
        if (container) container.scrollTop += delta;
      });
    };

    const enableAutoScroll = () => {
      setAutoScrollEnabled(true);
    };

    const disableAutoScroll = () => {
      setAutoScrollEnabled(false);
    };

    const isAutoScrollEnabled = () => {
      return autoScrollEnabled;
    };

    useImperativeHandle(ref, () => ({
      getScrollInfo,
      scrollToTop,
      scrollToBottom,
      scrollTo,
      scrollBy,
      enableAutoScroll,
      disableAutoScroll,
      isAutoScrollEnabled,
    }));

    // 检测是否为 dark 主题
    const isDarkTheme =
      theme?.background &&
      (theme.background.includes("9%") ||
        theme.background.includes("4.9%") ||
        theme.background.includes("3.9%"));

    // 应用主题
    useEffect(() => {
      if (containerRef.current) {
        const container = containerRef.current;

        // 添加或移除 dark 类名
        if (isDarkTheme) {
          container.classList.add("dark");
        } else {
          container.classList.remove("dark");
        }

        // 只在有自定义主题时才应用 CSS 变量
        if (theme) {
          if (theme.primary)
            container.style.setProperty("--primary", theme.primary);
          if (theme.secondary)
            container.style.setProperty("--secondary", theme.secondary);
          if (theme.background)
            container.style.setProperty("--background", theme.background);
          if (theme.text)
            container.style.setProperty("--foreground", theme.text);
          if (theme.border)
            container.style.setProperty("--border", theme.border);
          if (theme.borderRadius)
            container.style.setProperty("--radius", theme.borderRadius);
          if (theme.fontFamily) container.style.fontFamily = theme.fontFamily;
        }
      }
    }, [theme, isDarkTheme]);

    // ESC 退出全屏
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === "Escape" && isFullscreen) {
          setIsFullscreen(false);
        }
      };
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
      };
    }, [isFullscreen]);

    const containerStyle: React.CSSProperties = {
      ...style,
      ...(isFullscreen
        ? {
            zIndex: 999999,
            width: "100vw",
            height: "100vh",
            maxHeight: "none",
            maxWidth: "none",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }
        : {
            maxHeight: maxHeight,
            maxWidth: maxWidth,
          }),
    };

    const chatbotContent = (
      <div
        ref={containerRef}
        className={clsx(
          "dify-chatbot dify-chatbot-container flex flex-col min-w-0 bg-background p-[2px]",
          {
            "h-full border border-border rounded-lg":
              !isFullscreen && displayMode === "embedded",
            dark: isDarkTheme,
          },
          className
        )}
        style={containerStyle}
      >
        {/* Header */}
        {showHeader && (
          <div className="flex items-center justify-between p-4 border-b bg-card">
            <div className="flex items-center gap-3">
              {showAvatar && avatar && (
                <img
                  src={avatar}
                  alt="Assistant"
                  className="h-8 w-8 rounded-full object-cover"
                />
              )}
              <div>
                <h3 className="font-semibold text-card-foreground">{title}</h3>
                {subtitle && (
                  <p className="text-sm text-muted-foreground">{subtitle}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={resetConversation}
                title="Reset conversation"
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground p-1 rounded-md"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
              <button
                onClick={toggleFullscreen}
                title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
                className="border border-input bg-background hover:bg-accent hover:text-accent-foreground p-1 rounded-md"
              >
                {isFullscreen ? (
                  <Minimize2 className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* Messages */}
        <div
          ref={messagesContainerRef}
          className="dify-chatbot-messages flex flex-col min-w-0 gap-6 flex-1 overflow-y-auto pt-4 relative"
          style={{
            overscrollBehavior: "contain",
            touchAction: "pan-y",
          }}
        >
          {messages.length === 0 && (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <div className="mb-4">
                  <SparklesIcon
                    size={48}
                    className="mx-auto text-muted-foreground/30"
                  />
                </div>
                <p className="text-lg font-medium text-foreground">
                  How can I help you today?
                </p>
                {subtitle && (
                  <p className="text-sm mt-2 text-muted-foreground">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          )}

          {messages.map((message) => (
            <Message
              key={message.id}
              message={message}
              showAvatar={showAvatar}
              assistantAvatar={avatar}
            />
          ))}

          {isLoading &&
            messages.length > 0 &&
            messages[messages.length - 1]?.role === "user" && (
              <TypingIndicator
                showAvatar={showAvatar}
                assistantAvatar={avatar}
              />
            )}

          {error && (
            <div className="w-full mx-auto max-w-3xl px-4">
              <div className="text-center text-destructive text-sm py-2 bg-destructive/10 rounded-md">
                Error: {error.message}
              </div>
            </div>
          )}

          <div
            ref={messagesEndRef}
            className="shrink-0 min-w-[24px] min-h-[24px]"
          />
        </div>

        {/* Input */}
        <form
          className="flex mx-auto px-4 bg-background pb-4 md:pb-6 gap-2 w-full md:max-w-3xl"
          onSubmit={(e) => e.preventDefault()}
        >
          <div className="relative w-full flex flex-col gap-4">
            {/* Scroll to bottom button */}
            {showScrollButton && (
              <div className="absolute left-1/2 bottom-28 -translate-x-1/2 z-50">
                <button
                  onClick={scrollToBottom}
                  className="inline-flex items-center justify-center border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 w-8 rounded-full"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            )}

            <ChatInput
              onSendMessage={sendMessage}
              onUploadFile={allowFileUpload ? uploadFile : undefined}
              placeholder={placeholder}
              disabled={disabled}
              allowFileUpload={allowFileUpload}
              allowedFileTypes={finalAllowedFileTypes}
              maxFileSize={maxFileSize}
              autoFocus={autoFocus}
              initialMessage={initialMessage}
              status={isLoading ? "streaming" : "ready"}
              onStop={stopMessage}
              showResetButton={!showHeader}
              onReset={resetConversation}
            />
          </div>
        </form>
      </div>
    );

    // 如果是全屏模式，使用 Portal 渲染到 body
    if (isFullscreen) {
      return createPortal(chatbotContent, document.body);
    }

    // 非全屏模式，正常渲染
    return chatbotContent;
  }
);

DifyChatbot.displayName = "DifyChatbot";
