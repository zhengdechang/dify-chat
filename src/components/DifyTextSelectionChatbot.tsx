import React, { useState, useEffect, useRef, useCallback } from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { DifyChatbot } from "./DifyChatbot";
import type { TextSelectionChatbotProps } from "../types";

interface SelectionPosition {
  x: number;
  y: number;
  width: number;
  height: number;
}

export const DifyTextSelectionChatbot: React.FC<TextSelectionChatbotProps> = ({
  config,
  theme,
  placeholder: _placeholder = "Ask about the selected text...",
  title = "Chat Assistant",
  subtitle,
  avatar,
  className,
  style,
  onMessage,
  onError,
  maxHeight = 500,
  maxWidth = 450,
  showHeader = true,
  showAvatar = true,
  allowFileUpload = false, // Usually disabled for text selection
  allowedFileTypes = [],
  maxFileSize = 15 * 1024 * 1024,
  autoFocus = true,
  disabled = false,
  enabled = true,
  minSelectionLength = 3,
  maxSelectionLength = 1000,
  onSelectionChange,
  targetAttribute,
  triggerIcon,
  triggerText = "Ask AI",
  initialMessage,
  hoverInitialMessage,
}) => {
  const [selectedText, setSelectedText] = useState("");
  const [originalSelectedText, setOriginalSelectedText] = useState(""); // 保存原始选中文本
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<SelectionPosition>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [showChatbot, setShowChatbot] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isTransitioningFullscreen, setIsTransitioningFullscreen] =
    useState(false);
  const [hoveredKeyword, setHoveredKeyword] = useState("");
  const [isHoverMode, setIsHoverMode] = useState(false);
  const [hoverCustomMessage, setHoverCustomMessage] = useState("");
  const hideTimeoutRef = useRef<number | null>(null);

  // Track showChatbot changes
  useEffect(() => {
    // showChatbot state changed
  }, [showChatbot]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);
  const chatbotRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    if (!enabled) return;

    // Add a small delay to ensure selection is complete
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";

      // Handle text selection // Debug log

      // Check if selection is within the chatbot - if so, ignore it
      if (chatbotRef.current && selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (chatbotRef.current.contains(range.commonAncestorContainer)) {
          return;
        }
      }

      if (
        text.length >= minSelectionLength &&
        text.length <= maxSelectionLength
      ) {
        const range = selection?.getRangeAt(0);
        if (range) {
          // Check if selection is within an element with the target attribute
          if (targetAttribute) {
            const container = range.commonAncestorContainer;
            const element =
              container.nodeType === Node.TEXT_NODE
                ? container.parentElement
                : (container as Element);

            // Check if the element or any of its ancestors has the target attribute
            const targetElement = element?.closest(`[${targetAttribute}]`);
            if (!targetElement) {
              // Selection is not within a target element, ignore it
              setIsVisible(false);
              setSelectedText("");
              setOriginalSelectedText("");
              return;
            }
          }

          const rect = range.getBoundingClientRect();
          setPosition({
            x: rect.left + rect.width / 2,
            y: rect.top,
            width: rect.width,
            height: rect.height,
          });
          setSelectedText(text);
          setOriginalSelectedText(text); // 保存原始文本
          setIsVisible(true);

          onSelectionChange?.(text);
        }
      } else if (text.length === 0) {
        // Clear if no selection detected
        setIsVisible(false);
        setSelectedText("");
        setOriginalSelectedText("");
      }
    }, 50); // Increased delay to prevent rapid firing
  }, [
    enabled,
    minSelectionLength,
    maxSelectionLength,
    onSelectionChange,
    targetAttribute,
  ]);

  const handleMouseEnter = useCallback(
    (event: MouseEvent) => {
      if (!enabled || showChatbot) return;

      // Clear any pending hide timeout
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }

      const target = event.target as Element;
      const keywordElement = target.closest("[data-pageflux-keyword]");
      const askAiButton = target.closest('[data-testid="ask-ai-button"]');

      // If hovering over the Ask AI button, keep it visible
      if (askAiButton && isHoverMode) {
        return;
      }

      if (keywordElement) {
        const keyword =
          keywordElement.getAttribute("data-pageflux-keyword") ||
          keywordElement.textContent?.trim() ||
          "";
        const customHoverMessage =
          keywordElement.getAttribute("hover-initmessage");
        const rect = keywordElement.getBoundingClientRect();

        setPosition({
          x: rect.left + rect.width / 2,
          y: rect.top,
          width: rect.width,
          height: rect.height,
        });
        setHoveredKeyword(keyword);
        setSelectedText(keyword);
        setOriginalSelectedText(keyword); // 保存原始文本
        setIsHoverMode(true);
        setIsVisible(true);

        // Store the custom hover message for later use
        setHoverCustomMessage(customHoverMessage || "");

        onSelectionChange?.(keyword);
      }
    },
    [enabled, showChatbot, onSelectionChange, isHoverMode]
  );

  const handleMouseLeave = useCallback(
    (event: MouseEvent) => {
      if (!enabled || showChatbot || !isHoverMode) return;

      const target = event.target as Element;
      const relatedTarget = (event as any).relatedTarget as Element;

      // If moving to the Ask AI button, don't hide
      if (relatedTarget?.closest('[data-testid="ask-ai-button"]')) {
        return;
      }

      // If leaving a keyword element, set a delay before hiding
      if (target.closest("[data-pageflux-keyword]")) {
        hideTimeoutRef.current = window.setTimeout(() => {
          setIsVisible(false);
          setIsHoverMode(false);
          setHoveredKeyword("");
          setSelectedText("");
          setHoverCustomMessage("");
          // Don't clear originalSelectedText - preserve it for potential chatbot use
        }, 100); // 100ms delay to allow moving to button
      }
    },
    [enabled, showChatbot, isHoverMode]
  );

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;

      // Don't close if in fullscreen mode or transitioning
      if (isFullscreen || isTransitioningFullscreen) {
        return;
      }

      // Don't close if clicking on the chatbot or the "Ask AI" button
      const isAskAiButton = (target as Element)?.closest(
        '[data-testid="ask-ai-button"]'
      );
      const isChatbot =
        chatbotRef.current && chatbotRef.current.contains(target);

      if (isChatbot || isAskAiButton) {
        return;
      }

      // Clear UI states when clicking outside, but preserve selected text
      setIsVisible(false);

      // Don't close chatbot if in fullscreen mode
      if (!isFullscreen) {
        setShowChatbot(false);
      }

      // Only clear hover-related states, but preserve original selected text
      if (isHoverMode) {
        setIsHoverMode(false);
        setHoveredKeyword("");
        setHoverCustomMessage("");
        // Only clear current selected text if it was from hover mode, keep original
        setSelectedText("");
        // Don't clear originalSelectedText - keep it for potential reuse
      }

      // Clear any pending timeouts
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
        hideTimeoutRef.current = null;
      }
    },
    [isFullscreen, isTransitioningFullscreen, isHoverMode]
  );

  // Handle fullscreen change from DifyChatbot
  const handleFullscreenChange = useCallback((fullscreen: boolean) => {
    setIsTransitioningFullscreen(true);
    setIsFullscreen(fullscreen);

    // Always ensure chatbot is open when in fullscreen mode
    setShowChatbot(true);

    // Clear transition state after a short delay
    setTimeout(() => {
      setIsTransitioningFullscreen(false);
    }, 100);
  }, []);

  useEffect(() => {
    if (enabled && !showChatbot && !isFullscreen) {
      // Only listen for text selection when chatbot is closed
      document.addEventListener("mouseup", handleSelection);

      return () => {
        document.removeEventListener("mouseup", handleSelection);
      };
    }
  }, [enabled, handleSelection, showChatbot, isFullscreen]);

  // Add hover event listeners for data-pageflux-keyword elements
  useEffect(() => {
    if (enabled && !showChatbot && !isFullscreen) {
      // Only listen for hover events when chatbot is closed
      document.addEventListener("mouseover", handleMouseEnter);
      document.addEventListener("mouseout", handleMouseLeave);

      return () => {
        document.removeEventListener("mouseover", handleMouseEnter);
        document.removeEventListener("mouseout", handleMouseLeave);
      };
    }
  }, [enabled, showChatbot, isFullscreen, handleMouseEnter, handleMouseLeave]);

  // Separate effect for click outside to avoid conflicts
  useEffect(() => {
    if (enabled) {
      document.addEventListener("click", handleClickOutside);
      return () => {
        document.removeEventListener("click", handleClickOutside);
      };
    }
  }, [enabled, handleClickOutside]);

  const handleOpenChatbot = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Preserve the current originalSelectedText before opening chatbot
    const currentOriginalText = originalSelectedText || selectedText;

    // Use setTimeout to ensure this happens after any other event handlers
    setTimeout(() => {
      setShowChatbot(true);
      // Keep the current text when opening chatbot from hover mode
      if (isHoverMode && hoveredKeyword) {
        setSelectedText(hoveredKeyword);
        setOriginalSelectedText(hoveredKeyword);
      } else {
        // Ensure originalSelectedText is preserved
        setOriginalSelectedText(currentOriginalText);
      }
    }, 0);
  };

  const getChatbotPosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20;

    // Ensure we have valid values
    const safeMaxWidth = maxWidth || 350;
    const safeMaxHeight = maxHeight || 400;
    const safePosition = {
      x: position.x || 0,
      y: position.y || 0,
      height: position.height || 0,
    };

    // Calculate initial position
    let x = safePosition.x - safeMaxWidth / 2;
    let y = safePosition.y + safePosition.height + 10;

    // Ensure horizontal position is within viewport
    x = Math.max(margin, Math.min(x, viewportWidth - safeMaxWidth - margin));

    // Check if there's enough space below
    if (y + safeMaxHeight > viewportHeight - margin) {
      // Try positioning above the selection
      const yAbove = safePosition.y - safeMaxHeight - 10;
      if (yAbove >= margin) {
        y = yAbove;
      } else {
        // If neither above nor below works, center vertically
        y = Math.max(margin, (viewportHeight - safeMaxHeight) / 2);
      }
    }

    // Final safety check - ensure position is within viewport
    y = Math.max(margin, Math.min(y, viewportHeight - safeMaxHeight - margin));

    // Chatbot position calculated
    return { x, y };
  };

  const [chatbotPosition, setChatbotPosition] = useState({ x: 0, y: 0 });

  // Update chatbot position when needed
  useEffect(() => {
    if (showChatbot && position) {
      const newPosition = getChatbotPosition();
      setChatbotPosition(newPosition);
    }
  }, [showChatbot, position, maxWidth, maxHeight]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (showChatbot && position) {
        const newPosition = getChatbotPosition();
        setChatbotPosition(newPosition);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [showChatbot, position, maxWidth, maxHeight]);

  // Enhanced message handler to include selected text context
  const handleMessageWithContext = (message: any) => {
    // Add selected text as context to the message
    const enhancedMessage = {
      ...message,
      context: originalSelectedText || selectedText,
    };
    onMessage?.(enhancedMessage);
  };

  if (!enabled) {
    return null;
  }

  return (
    <div className="dify-chatbot dify-text-selection-chatbot">
      {/* Selection Trigger Button */}
      <AnimatePresence>
        {isVisible && !showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed pointer-events-none"
            style={{
              left: position.x - 25,
              top: position.y + position.height + 5,
            }}
          >
            <button
              onClick={handleOpenChatbot}
              onMouseEnter={() => {
                // Clear any pending hide timeout when hovering over button
                if (hideTimeoutRef.current) {
                  clearTimeout(hideTimeoutRef.current);
                  hideTimeoutRef.current = null;
                }
              }}
              onMouseLeave={() => {
                // Hide after a short delay when leaving the button
                hideTimeoutRef.current = window.setTimeout(() => {
                  setIsVisible(false);
                  setIsHoverMode(false);
                  setHoveredKeyword("");
                  setHoverCustomMessage("");
                  // Only clear selectedText if it was from hover mode, keep originalSelectedText
                  if (isHoverMode) {
                    setSelectedText("");
                  }
                  // Don't clear originalSelectedText - preserve it for chatbot
                }, 100);
              }}
              className="inline-flex items-center justify-center gap-1.5 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md py-2 px-3 h-fit pointer-events-auto shadow-lg"
              title="Ask about selected text"
              data-testid="ask-ai-button"
              data-state="closed"
              style={{ fontFamily: "auto" }}
            >
              {triggerIcon || (
                <MessageCircle className="h-4 w-4 flex-shrink-0" />
              )}
              <span className="text-sm leading-none">{triggerText}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {(showChatbot || isFullscreen) && (
          <motion.div
            ref={chatbotRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className={clsx("dify-chatbot", {
              "fixed shadow-xl": !isFullscreen,
            })}
            style={
              isFullscreen
                ? {
                    // 在全屏模式下，让 DifyChatbot 内部处理所有样式
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    zIndex: 999999,
                  }
                : {
                    left: chatbotPosition.x,
                    top: chatbotPosition.y,
                    width: maxWidth,
                    height: maxHeight,
                    zIndex: 999999,
                  }
            }
          >
            <div className="relative h-full">
              {/* Chatbot */}
              <div className={clsx("h-full")}>
                <DifyChatbot
                  config={{
                    ...config,
                    inputs: {
                      ...config.inputs,
                      selected_text: originalSelectedText || selectedText,
                    },
                  }}
                  theme={theme}
                  displayMode="embedded"
                  placeholder={`Ask about: "${(
                    originalSelectedText || selectedText
                  )?.substring(0, 50)}${
                    (originalSelectedText || selectedText) &&
                    (originalSelectedText || selectedText).length > 50
                      ? "..."
                      : ""
                  }"`}
                  title={title}
                  subtitle={subtitle}
                  avatar={avatar}
                  className={className}
                  style={style}
                  onMessage={handleMessageWithContext}
                  onError={onError}
                  maxHeight={isFullscreen ? undefined : maxHeight}
                  maxWidth={isFullscreen ? undefined : maxWidth}
                  showHeader={showHeader}
                  showAvatar={showAvatar}
                  allowFileUpload={allowFileUpload}
                  allowedFileTypes={allowedFileTypes}
                  maxFileSize={maxFileSize}
                  autoFocus={autoFocus}
                  disabled={disabled}
                  initialMessage={
                    isHoverMode && hoverCustomMessage
                      ? `${hoverCustomMessage} "${
                          originalSelectedText || selectedText
                        }"`
                      : isHoverMode && hoverInitialMessage
                      ? `${hoverInitialMessage} "${
                          originalSelectedText || selectedText
                        }"`
                      : initialMessage
                      ? `${initialMessage} "${
                          originalSelectedText || selectedText
                        }"`
                      : `Please explain this text: "${
                          originalSelectedText || selectedText
                        }"`
                  }
                  onFullscreenChange={handleFullscreenChange}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
