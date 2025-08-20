import React, { useState } from "react";
import { clsx } from "clsx";
import { motion, AnimatePresence } from "framer-motion";
import { Clipboard, Check } from "lucide-react";
import { SparklesIcon } from "./icons/SparklesIcon";
import { Markdown } from "./ui/Markdown";
import type { MessageProps } from "../types";

export const Message: React.FC<MessageProps> = ({
  message,
  showAvatar = true,
  assistantAvatar,
  userAvatar: _userAvatar,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      // Failed to copy message
    }
  };
  return (
    <AnimatePresence>
      <motion.div
        data-testid={`message-${message.role}`}
        className="w-full mx-auto max-w-3xl px-4 group/message"
        initial={{ y: 5, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        data-role={message.role}
      >
        <div
          className={clsx(
            "flex gap-4 w-full group-data-[role=user]/message:ml-auto group-data-[role=user]/message:max-w-2xl",
            {
              "group-data-[role=user]/message:w-fit": true,
            }
          )}
        >
          {message.role === "assistant" && showAvatar && (
            <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
              <div className="translate-y-px">
                {assistantAvatar ? (
                  <img
                    src={assistantAvatar}
                    alt="Assistant"
                    className="h-4 w-4 rounded-full object-cover"
                  />
                ) : (
                  <SparklesIcon size={14} className="text-muted-foreground" />
                )}
              </div>
            </div>
          )}

          <div className="flex flex-col gap-4 w-full">
            {/* Attachments for user messages */}
            {message.attachments && message.attachments.length > 0 && (
              <div
                data-testid="message-attachments"
                className="flex flex-row justify-end gap-2"
              >
                {message.attachments.map((attachment, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-xs bg-muted rounded-lg px-3 py-2"
                  >
                    <span>📎</span>
                    <span className="truncate max-w-[120px]">
                      {attachment.name}
                    </span>
                    <span className="text-xs opacity-60">
                      ({Math.round(attachment.size / 1024)}KB)
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Message Content */}
            <div className="flex flex-row gap-2 items-start">
              <div
                data-testid="message-content"
                className={clsx("flex flex-col gap-4 message-text w-full", {
                  "bg-muted  px-3 py-2 rounded-xl": message.role === "user",
                  "": message.role === "assistant",
                })}
              >
                <Markdown>{message.content}</Markdown>

                {/* Message Actions - Only for assistant messages */}
                {message.role === "assistant" && (
                  <div className="flex flex-row gap-2 opacity-0 group-hover/message:opacity-100 transition-opacity duration-200 mt-2">
                    <button
                      className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground py-1 px-2 h-fit text-muted-foreground"
                      onClick={handleCopy}
                      title={copied ? "Copied!" : "Copy message"}
                      data-state="closed"
                    >
                      {copied ? (
                        <Check className="h-4 w-4 " />
                      ) : (
                        <Clipboard className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export const TypingIndicator: React.FC<{
  showAvatar?: boolean;
  assistantAvatar?: string;
}> = ({ showAvatar = true, assistantAvatar }) => {
  return (
    <motion.div
      data-testid="message-assistant-loading"
      className="w-full mx-auto max-w-3xl px-4 group/message"
      initial={{ y: 5, opacity: 0 }}
      animate={{ y: 0, opacity: 1, transition: { delay: 0.5 } }}
      data-role="assistant"
    >
      <div className="flex gap-4 w-full">
        {showAvatar && (
          <div className="size-8 flex items-center rounded-full justify-center ring-1 shrink-0 ring-border bg-background">
            <div className="translate-y-px">
              {assistantAvatar ? (
                <img
                  src={assistantAvatar}
                  alt="Assistant"
                  className="h-4 w-4 rounded-full object-cover"
                />
              ) : (
                <SparklesIcon size={14} className=" text-muted-foreground" />
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-4 w-full mt-[0.7rem]">
          <div className="flex flex-row gap-2 items-center">
            <div className="flex space-x-1 items-center">
              <div className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"></div>
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                style={{ animationDelay: "0.2s" }}
              ></div>
              <div
                className="w-2 h-2 bg-muted-foreground rounded-full animate-pulse"
                style={{ animationDelay: "0.4s" }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
