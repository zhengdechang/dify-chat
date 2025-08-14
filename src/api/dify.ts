import type {
  DifyConfig,
  DifyApiResponse,
  DifyAttachment,
  DifyStreamResponse,
} from "../types";

export class DifyApi {
  private config: DifyConfig;
  private conversationId: string | null = null;
  private currentTaskId: string | null = null;

  constructor(config: DifyConfig) {
    this.config = config;
  }

  private getHeaders(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.config.apiKey}`,
      "Content-Type": "application/json",
    };
  }

  setConversationId(conversationId: string | null) {
    this.conversationId = conversationId;
  }

  getConversationId(): string | null {
    return this.conversationId;
  }

  async sendMessage(
    message: string,
    attachments?: DifyAttachment[]
  ): Promise<DifyApiResponse> {
    const body = {
      inputs: this.config.inputs || {},
      query: message,
      user: this.config.userId || "anonymous",
      conversation_id: this.conversationId,
      response_mode: "blocking",
      files:
        attachments?.map((att) => ({
          type: att.type,
          transfer_method: att.id ? "local_file" : "remote_url",
          upload_file_id: att.id,
          url: att.url,
        })) || [],
    };

    const response = await fetch(`${this.config.baseUrl}/chat-messages`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Failed to send message");
    }

    const data = await response.json();

    // Update conversation ID if this is a new conversation
    if (data.conversation_id && !this.conversationId) {
      this.conversationId = data.conversation_id;
    }

    return data;
  }

  async sendMessageStream(
    message: string,
    attachments?: DifyAttachment[],
    onChunk?: (chunk: DifyStreamResponse) => void
  ): Promise<void> {
    const body = {
      inputs: this.config.inputs || {},
      query: message,
      user: this.config.userId || "anonymous",
      conversation_id: this.conversationId,
      response_mode: "streaming",
      files:
        attachments?.map((att) => ({
          type: att.type,
          transfer_method: att.id ? "local_file" : "remote_url",
          upload_file_id: att.id,
          url: att.url,
        })) || [],
    };

    const response = await fetch(`${this.config.baseUrl}/chat-messages`, {
      method: "POST",
      headers: this.getHeaders(),
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Failed to send message");
    }

    const reader = response.body?.getReader();
    if (!reader) {
      throw new Error("Failed to get response stream");
    }

    const decoder = new TextDecoder();
    let buffer = "";

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.trim() === "") continue;

          if (line.startsWith("data: ")) {
            const payload = line.slice(6).trim();
            if (payload === "[DONE]") break;

            try {
              const data = JSON.parse(payload);

              // Update conversation ID if this is a new conversation
              if (data.conversation_id && !this.conversationId) {
                this.conversationId = data.conversation_id;
              }

              // Update task ID for stopping capability
              if (data.task_id) {
                this.currentTaskId = data.task_id;
              }

              onChunk?.(data);
            } catch (e) {
              // Failed to parse SSE data, skip this line
            }
          } else if (line.startsWith("event: ")) {
            // Handle event lines if needed
            continue;
          }
        }
      }
    } finally {
      reader.releaseLock();
    }
  }

  async uploadFile(file: File): Promise<DifyAttachment> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user", this.config.userId || "anonymous");

    const response = await fetch(`${this.config.baseUrl}/files/upload`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.config.apiKey}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Upload failed" }));
      throw new Error(error.message || "Failed to upload file");
    }

    const data = await response.json();

    return {
      id: data.id,
      type: this.getFileType(file.type),
      name: file.name,
      size: file.size,
    };
  }

  private getFileType(mimeType: string): DifyAttachment["type"] {
    if (mimeType.startsWith("image/")) return "image";
    if (mimeType.startsWith("audio/")) return "audio";
    if (mimeType.startsWith("video/")) return "video";
    return "document";
  }

  async stopMessage(): Promise<void> {
    if (!this.currentTaskId) {
      throw new Error("No active task to stop");
    }

    const body = {
      user: this.config.userId || "anonymous",
    };

    const response = await fetch(
      `${this.config.baseUrl}/chat-messages/${this.currentTaskId}/stop`,
      {
        method: "POST",
        headers: this.getHeaders(),
        body: JSON.stringify(body),
      }
    );

    if (!response.ok) {
      const error = await response
        .json()
        .catch(() => ({ message: "Failed to stop message" }));
      throw new Error(error.message || "Failed to stop message");
    }

    // Clear the current task ID after stopping
    this.currentTaskId = null;
  }

  getCurrentTaskId(): string | null {
    return this.currentTaskId;
  }

  resetConversation() {
    this.conversationId = null;
    this.currentTaskId = null;
  }
}
