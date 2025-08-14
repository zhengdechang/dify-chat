import React, { useState, useEffect } from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { DifyChatbot } from "./DifyChatbot";
import { Button } from "./ui/Button";
import type { FloatingChatbotProps } from "../types";

export const DifyFloatingChatbot: React.FC<FloatingChatbotProps> = ({
  config,
  theme,
  placeholder = "Type your message...",
  title = "Chat Assistant",
  subtitle,
  avatar,
  className,
  style,
  onMessage,
  onError,
  maxHeight = 500,
  maxWidth = 400,
  showHeader = true,
  showAvatar = true,
  allowFileUpload = false,
  allowedFileTypes,
  maxFileSize = 15 * 1024 * 1024,
  autoFocus = false,
  disabled = false,
  position = "bottom-right",
  offset = { x: 0, y: 0 },
  trigger,
  defaultOpen = false,
  onOpenChange,
  triggerIcon,
  triggerText,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  useEffect(() => {
    onOpenChange?.(isOpen);
  }, [isOpen, onOpenChange]);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const getPositionClasses = () => {
    return "dify-floating-chatbot fixed z-[99999]";
  };

  const getPositionStyle = (): React.CSSProperties => {
    const offsetX = offset.x;
    const offsetY = offset.y;

    switch (position) {
      case "bottom-right":
        return {
          bottom: 20 + offsetY,
          right: 20 + offsetX,
        };
      case "bottom-left":
        return {
          bottom: 20 + offsetY,
          left: 20 + offsetX,
        };
      case "top-right":
        return {
          top: 20 + offsetY,
          right: 20 + offsetX,
        };
      case "top-left":
        return {
          top: 20 + offsetY,
          left: 20 + offsetX,
        };
      default:
        return {
          bottom: 20,
          right: 20,
        };
    }
  };

  const getAnimationDirection = () => {
    switch (position) {
      case "bottom-right":
      case "bottom-left":
        return { y: 20, opacity: 0 };
      case "top-right":
      case "top-left":
        return { y: -20, opacity: 0 };
      default:
        return { y: 20, opacity: 0 };
    }
  };

  return (
    <div className={getPositionClasses()} style={getPositionStyle()}>
      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={getAnimationDirection()}
            animate={{ y: 0, opacity: 1 }}
            exit={getAnimationDirection()}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className={clsx("mb-4", position.includes("top") && "mb-0 mt-4")}
            style={{
              width: maxWidth,
              height: maxHeight,
            }}
          >
            <DifyChatbot
              config={config}
              theme={theme}
              displayMode="embedded"
              placeholder={placeholder}
              title={title}
              subtitle={subtitle}
              avatar={avatar}
              className={className}
              style={style}
              onMessage={onMessage}
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
              preventExternalScroll={true} // Always prevent external scroll for floating chatbot
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Trigger Button */}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        {trigger ? (
          <div onClick={handleToggle} className="cursor-pointer">
            {trigger}
          </div>
        ) : (
          <Button
            onClick={handleToggle}
            size={triggerText ? "default" : "icon"}
            className={clsx(
              triggerText
                ? "h-auto px-4 py-2 rounded-full shadow-lg"
                : "h-10 w-10 rounded-full shadow-lg",
              "bg-primary hover:bg-primary/90 text-primary-foreground",
              "transition-all duration-200"
            )}
            title={isOpen ? "Close chat" : "Open chat"}
          >
            <AnimatePresence mode="wait">
              {isOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={triggerText ? "flex items-center gap-2" : ""}
                >
                  <X className="h-5 w-5" />
                  {triggerText && (
                    <span className="text-sm font-medium">Close</span>
                  )}
                </motion.div>
              ) : (
                <motion.div
                  key="open"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className={triggerText ? "flex items-center gap-2" : ""}
                >
                  {triggerIcon || <MessageCircle className="h-6 w-6" />}
                  {triggerText && (
                    <span className="text-sm font-medium">{triggerText}</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </Button>
        )}
      </motion.div>
    </div>
  );
};
