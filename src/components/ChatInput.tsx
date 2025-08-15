import React, { useState, useRef, KeyboardEvent, useCallback } from "react";
import { clsx } from "clsx";
import { ArrowUp, Paperclip, X, RotateCcw, CirclePause } from "lucide-react";
import type { ChatInputProps, DifyAttachment } from "../types";

interface ExtendedChatInputProps extends ChatInputProps {
  status?: "ready" | "submitted" | "streaming";
  onStop?: () => void;
  autoFocus?: boolean;
}

export const ChatInput: React.FC<ExtendedChatInputProps> = ({
  onSendMessage,
  onUploadFile,
  placeholder = "Type your message...",
  disabled = false,
  allowFileUpload = false,
  allowedFileTypes,
  maxFileSize = 15 * 1024 * 1024, // 15MB
  status = "ready",
  onStop,
  autoFocus = false,
  initialMessage = "",
  showResetButton = false,
  onReset,
}) => {
  // Set default file types if allowFileUpload is true but no types specified
  const finalAllowedFileTypes = allowFileUpload
    ? allowedFileTypes || ["image/png", "image/jpeg"]
    : [];
  const [message, setMessage] = useState(initialMessage);
  const [attachments, setAttachments] = useState<DifyAttachment[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const submitForm = useCallback(async () => {
    if (
      (!message.trim() && attachments.length === 0) ||
      disabled ||
      status !== "ready"
    )
      return;

    onSendMessage(message.trim(), attachments);
    setMessage("");
    setAttachments([]);

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [message, attachments, disabled, status, onSendMessage]);

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
      e.preventDefault();
      if (status !== "ready") {
        // Please wait for the model to finish its response
      } else {
        submitForm();
      }
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length || !onUploadFile) return;

    setIsUploading(true);
    try {
      for (const file of files) {
        // Validate file size
        if (file.size > maxFileSize) {
          throw new Error(
            `File ${file.name} is too large. Maximum size is ${Math.round(
              maxFileSize / 1024 / 1024
            )}MB`
          );
        }

        // Validate file type
        const isValidType = finalAllowedFileTypes.some((type) => {
          if (type.startsWith(".")) {
            return file.name.toLowerCase().endsWith(type.toLowerCase());
          }
          return file.type.match(type.replace("*", ".*"));
        });

        if (!isValidType) {
          throw new Error(`File type ${file.type} is not allowed`);
        }

        const attachment = await onUploadFile(file);
        setAttachments((prev) => [...prev, attachment]);
      }
    } catch (error) {
      // File upload error - you might want to show a toast notification here
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    const textarea = e.target;
    textarea.style.height = "auto";
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + "px";
  };

  return (
    <div className="relative w-full flex flex-col gap-4">
      {/* Hidden file input */}
      <input
        type="file"
        className="fixed -top-4 -left-4 size-0.5 opacity-0 pointer-events-none"
        ref={fileInputRef}
        multiple
        accept={finalAllowedFileTypes.join(",")}
        onChange={handleFileSelect}
        tabIndex={-1}
      />

      {/* Attachments */}
      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 px-4">
          {attachments.map((attachment, index) => (
            <div
              key={index}
              className="flex items-center gap-2 bg-muted rounded-lg px-3 py-2 text-sm"
            >
              <span>📎</span>
              <span className="truncate max-w-[120px]">{attachment.name}</span>
              <button
                onClick={() => removeAttachment(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="relative">
        <textarea
          data-testid="multimodal-input"
          ref={textareaRef}
          placeholder={placeholder}
          value={message}
          onChange={handleTextareaChange}
          onKeyDown={handleKeyPress}
          className={clsx(
            "flex w-full border border-input px-3 py-2 ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 min-h-[24px] max-h-[calc(75dvh)] overflow-hidden resize-none rounded-2xl bg-muted pb-10 text-sm text-foreground input-text"
          )}
          rows={2}
          autoFocus={autoFocus}
          disabled={disabled}
        />

        {/* File Upload Button and Reset Button */}
        <div className="absolute bottom-0 p-2 w-fit flex flex-row justify-start gap-1">
          {showResetButton && onReset && (
            <button
              data-testid="reset-button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground py-1 px-2 h-fit text-muted-foreground rounded-md button-text"
              disabled={status !== "ready" || disabled}
              onClick={onReset}
              title="Reset conversation"
              data-state="closed"
            >
              <RotateCcw size={14} />
            </button>
          )}
          {allowFileUpload && onUploadFile && (
            <button
              data-testid="attachments-button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 hover:bg-accent hover:text-accent-foreground py-1 px-2 h-fit text-muted-foreground rounded-md rounded-bl-lg button-text"
              disabled={status !== "ready" || disabled}
              onClick={() => fileInputRef.current?.click()}
              title="Attach file"
              data-state="closed"
            >
              <Paperclip size={14} className="-rotate-45" />
            </button>
          )}
        </div>

        {/* Send/Stop Button */}
        <div className="absolute bottom-0 right-0 p-2 w-fit flex flex-row justify-end">
          {status === "submitted" || status === "streaming" ? (
            <button
              data-testid="stop-button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 border border-input bg-background hover:bg-accent hover:text-accent-foreground py-1 px-2 h-fit text-muted-foreground rounded-full button-text"
              onClick={onStop}
              title="Stop generation"
              data-state="closed"
            >
              <CirclePause />
            </button>
          ) : (
            <button
              data-testid="send-button"
              className="inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full p-1.5 h-fit border dark:border-zinc-600 button-text"
              onClick={submitForm}
              disabled={
                disabled ||
                (!message.trim() && attachments.length === 0) ||
                isUploading
              }
              title="Send message"
              data-state="closed"
            >
              <ArrowUp size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Upload Status */}
      {isUploading && (
        <div className="px-4 text-sm text-muted-foreground">
          Uploading files...
        </div>
      )}
    </div>
  );
};
