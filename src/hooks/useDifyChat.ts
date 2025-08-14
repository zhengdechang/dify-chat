import { useState, useCallback, useRef } from "react";
import { DifyApi } from "../api/dify";
import type {
  DifyMessage,
  DifyAttachment,
  UseDifyChatOptions,
  UseDifyChatReturn,
  DifyStreamResponse,
} from "../types";

export const useDifyChat = ({
  config,
  onMessage,
  onError,
  enableStreaming = true,
}: UseDifyChatOptions): UseDifyChatReturn => {
  const [messages, setMessages] = useState<DifyMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [isStopping, setIsStopping] = useState(false);

  const apiRef = useRef<DifyApi>(new DifyApi(config));

  const generateId = () => Math.random().toString(36).substring(2, 15);

  // Extract user-friendly error message from Dify error response
  const extractErrorMessage = (errorMessage: string): string => {
    try {
      // Try to parse the nested error structure
      // Format: [models] Bad Request Error, Error code: 400 - {'error': {'message': "actual message", ...}}
      const match = errorMessage.match(
        /'error':\s*\{\s*'message':\s*"([^"]+)"/
      );
      if (match && match[1]) {
        return match[1];
      }

      // Fallback: try to extract message after "message":
      const messageMatch = errorMessage.match(/"message":\s*"([^"]+)"/);
      if (messageMatch && messageMatch[1]) {
        return messageMatch[1];
      }

      // If no specific message found, return the original
      return errorMessage;
    } catch {
      return errorMessage;
    }
  };

  const addMessage = useCallback(
    (message: DifyMessage) => {
      setMessages((prev) => [...prev, message]);
      onMessage?.(message);
    },
    [onMessage]
  );

  const updateLastMessage = useCallback(
    (content: string) => {
      setMessages((prev) => {
        const newMessages = [...prev];
        const lastMessage = newMessages[newMessages.length - 1];
        if (lastMessage && lastMessage.role === "assistant") {
          // Create a new message object to ensure React detects the change
          const updatedMessage = {
            ...lastMessage,
            content,
            timestamp: Date.now(), // Update timestamp to ensure change detection
          };
          newMessages[newMessages.length - 1] = updatedMessage;

          // Trigger onMessage callback for streaming updates
          onMessage?.(updatedMessage);
        }
        return newMessages;
      });
    },
    [onMessage]
  );

  const sendMessage = useCallback(
    async (content: string, attachments?: DifyAttachment[]) => {
      if (!content.trim() && !attachments?.length) return;

      setError(null);
      setIsLoading(true);

      // Add user message
      const userMessage: DifyMessage = {
        id: generateId(),
        role: "user",
        content: content.trim(),
        timestamp: Date.now(),
        attachments,
      };
      addMessage(userMessage);

      try {
        if (enableStreaming) {
          let fullContent = "";
          let hasStartedStreaming = false;

          await apiRef.current.sendMessageStream(
            content,
            attachments,
            (chunk: DifyStreamResponse) => {
              // Handle different event types based on Dify's streaming format
              switch (chunk.event) {
                case "message":
                  // Incremental message content
                  if (chunk.answer) {
                    // Add assistant message on first chunk
                    if (!hasStartedStreaming) {
                      const assistantMessage: DifyMessage = {
                        id: generateId(),
                        role: "assistant",
                        content: "",
                        timestamp: Date.now(),
                      };
                      addMessage(assistantMessage);
                      hasStartedStreaming = true;
                    }
                    fullContent += chunk.answer;
                    updateLastMessage(fullContent);
                  }
                  break;
                case "agent_message":
                  // Agent message content
                  if (chunk.answer) {
                    // Add assistant message on first chunk
                    if (!hasStartedStreaming) {
                      const assistantMessage: DifyMessage = {
                        id: generateId(),
                        role: "assistant",
                        content: "",
                        timestamp: Date.now(),
                      };
                      addMessage(assistantMessage);
                      hasStartedStreaming = true;
                    }
                    fullContent += chunk.answer;
                    updateLastMessage(fullContent);
                  }
                  break;
                case "message_end":
                  // Final message with complete content
                  if (chunk.metadata?.usage) {
                    // Could store usage information if needed
                  }
                  break;
                case "workflow_started":
                  break;
                case "workflow_finished":
                  break;
                case "node_started":
                  break;
                case "node_finished":
                  break;
                case "error":
                  // Set loading to false and error state before throwing
                  setIsLoading(false);
                  const friendlyMessage = extractErrorMessage(
                    chunk.message || "Stream error occurred"
                  );
                  const streamError = new Error(friendlyMessage);
                  setError(streamError);
                  onError?.(streamError);
                  throw streamError;
                default:
                  // Handle other event types
                  break;
              }
            }
          );

          // Ensure loading is set to false after streaming completes
          setIsLoading(false);
        } else {
          const response = await apiRef.current.sendMessage(
            content,
            attachments
          );

          const assistantMessage: DifyMessage = {
            id: generateId(),
            role: "assistant",
            content: response.answer,
            timestamp: Date.now(),
          };
          addMessage(assistantMessage);
          setIsLoading(false);
        }
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Unknown error");
        setError(error);
        onError?.(error);
        setIsLoading(false);

        // If we started streaming but got an error, remove the empty assistant message
        setMessages((prev) => {
          const lastMessage = prev[prev.length - 1];
          if (
            lastMessage &&
            lastMessage.role === "assistant" &&
            !lastMessage.content.trim()
          ) {
            return prev.slice(0, -1);
          }
          return prev;
        });
      }
    },
    [enableStreaming, addMessage, updateLastMessage, onError]
  );

  const uploadFile = useCallback(
    async (file: File): Promise<DifyAttachment> => {
      try {
        return await apiRef.current.uploadFile(file);
      } catch (err) {
        const error = err instanceof Error ? err : new Error("Upload failed");
        setError(error);
        onError?.(error);
        throw error;
      }
    },
    [onError]
  );

  const clearMessages = useCallback(() => {
    setMessages([]);
    setError(null);
  }, []);

  const resetConversation = useCallback(() => {
    apiRef.current.resetConversation();
    clearMessages();
  }, [clearMessages]);

  const stopMessage = useCallback(async () => {
    if (!isLoading || isStopping) return;

    setIsStopping(true);
    try {
      await apiRef.current.stopMessage();
      setIsLoading(false);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Failed to stop message");
      setError(error);
      onError?.(error);
    } finally {
      setIsStopping(false);
    }
  }, [isLoading, isStopping, onError]);

  return {
    messages,
    isLoading,
    error,
    isStopping,
    sendMessage,
    stopMessage,
    uploadFile,
    clearMessages,
    resetConversation,
  };
};
