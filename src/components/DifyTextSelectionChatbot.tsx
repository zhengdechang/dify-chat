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
  maxHeight = 400,
  maxWidth = 350,
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
}) => {
  const [selectedText, setSelectedText] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState<SelectionPosition>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [showChatbot, setShowChatbot] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Track showChatbot changes
  useEffect(() => {
    // showChatbot state changed
  }, [showChatbot]);
  const chatbotRef = useRef<HTMLDivElement>(null);

  const handleSelection = useCallback(() => {
    if (!enabled) return;

    // Add a small delay to ensure selection is complete
    setTimeout(() => {
      const selection = window.getSelection();
      const text = selection?.toString().trim() || "";

      // Handle text selection // Debug log

      // Since we only listen to selection events when chatbot is closed,
      // we don't need to check if selection is within chatbot

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
          setIsVisible(true);
          onSelectionChange?.(text);
        }
      } else {
        // Clear selection if it doesn't meet criteria
        setIsVisible(false);
        setSelectedText("");
      }
    }, 10);
  }, [
    enabled,
    minSelectionLength,
    maxSelectionLength,
    onSelectionChange,
    targetAttribute,
    showChatbot,
  ]);

  const handleClickOutside = useCallback(
    (event: MouseEvent) => {
      const target = event.target as Node;

      // Don't close if in fullscreen mode
      if (isFullscreen) {
        return;
      }

      // Don't close if clicking on the chatbot or the "Ask AI" button
      if (
        (chatbotRef.current && chatbotRef.current.contains(target)) ||
        (target as Element)?.closest('[data-testid="ask-ai-button"]')
      ) {
        return;
      }
      setIsVisible(false);
      setShowChatbot(false);
    },
    [isFullscreen]
  );

  useEffect(() => {
    if (enabled && !showChatbot) {
      document.addEventListener("selectionchange", handleSelection);
      document.addEventListener("mouseup", handleSelection);

      return () => {
        document.removeEventListener("selectionchange", handleSelection);
        document.removeEventListener("mouseup", handleSelection);
      };
    }
  }, [enabled, handleSelection, showChatbot]);

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
    // Use setTimeout to ensure this happens after any other event handlers
    setTimeout(() => {
      setShowChatbot(true);
    }, 0);
  };

  const getChatbotPosition = () => {
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    const margin = 20;

    // Calculate initial position
    let x = position.x - maxWidth / 2;
    let y = position.y + position.height + 10;

    // Ensure horizontal position is within viewport
    x = Math.max(margin, Math.min(x, viewportWidth - maxWidth - margin));

    // Check if there's enough space below
    if (y + maxHeight > viewportHeight - margin) {
      // Try positioning above the selection
      const yAbove = position.y - maxHeight - 10;
      if (yAbove >= margin) {
        y = yAbove;
      } else {
        // If neither above nor below works, center vertically
        y = Math.max(margin, (viewportHeight - maxHeight) / 2);
      }
    }

    // Final safety check - ensure position is within viewport
    y = Math.max(margin, Math.min(y, viewportHeight - maxHeight - margin));

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
      context: selectedText,
    };
    onMessage?.(enhancedMessage);
  };

  if (!enabled) {
    return null;
  }

  return (
    <>
      {/* Selection Trigger Button */}
      <AnimatePresence>
        {isVisible && !showChatbot && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: -10 }}
            transition={{ duration: 0.15 }}
            className="fixed z-[99998] pointer-events-none"
            style={{
              left: position.x - 25,
              top: position.y + position.height + 5,
            }}
          >
            <button
              onClick={handleOpenChatbot}
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md py-2 px-4 h-fit pointer-events-auto shadow-lg"
              title="Ask about selected text"
              data-testid="ask-ai-button"
              data-state="closed"
            >
              {triggerIcon || <MessageCircle className="h-4 w-4" />}
              <span className="text-xs">{triggerText}</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chatbot Window */}
      <AnimatePresence>
        {showChatbot && (
          <motion.div
            ref={chatbotRef}
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.2 }}
            className={clsx("dify-chatbot fixed shadow-xl", {
              "z-[99999]": !isFullscreen,
              "z-40": isFullscreen, // Lower z-index when fullscreen to let DifyChatbot's z-50 take precedence
            })}
            style={{
              left: isFullscreen ? 0 : chatbotPosition.x,
              top: isFullscreen ? 0 : chatbotPosition.y,
              width: isFullscreen ? "100vw" : maxWidth,
              height: isFullscreen ? "100vh" : maxHeight,
              zIndex: 999999,
            }}
          >
            <div className="relative h-full">
              {/* Chatbot */}
              <div className={clsx("h-full")}>
                <DifyChatbot
                  config={{
                    ...config,
                    inputs: {
                      ...config.inputs,
                      selected_text: selectedText,
                    },
                  }}
                  theme={theme}
                  displayMode="embedded"
                  placeholder={`Ask about: "${selectedText?.substring(0, 50)}${
                    selectedText && selectedText.length > 50 ? "..." : ""
                  }"`}
                  title={title}
                  subtitle={subtitle}
                  avatar={avatar}
                  className={className}
                  style={style}
                  onMessage={handleMessageWithContext}
                  onError={onError}
                  maxHeight={maxHeight}
                  maxWidth={maxWidth}
                  showHeader={showHeader}
                  showAvatar={showAvatar}
                  allowFileUpload={allowFileUpload}
                  allowedFileTypes={allowedFileTypes}
                  maxFileSize={maxFileSize}
                  autoFocus={autoFocus}
                  disabled={disabled}
                  initialMessage={`Please explain this text: "${selectedText}"`}
                  onFullscreenChange={setIsFullscreen}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
