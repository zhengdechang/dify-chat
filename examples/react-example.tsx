import React, { useState } from "react";
import {
  DifyChatbot,
  DifyFloatingChatbot,
  DifyTextSelectionChatbot,
  presetThemes,
  type DifyConfig,
  type PresetThemeName,
  type DifyMessage,
} from "dify-chat-tools";

// Your Dify configuration
const difyConfig: DifyConfig = {
  apiKey: "app-xxx", // Replace with your actual Dify app token
  baseUrl: "https://api.dify.ai/v1",
  userId: "user-123",
  inputs: {
    language: "en",
    context: "customer-support",
  },
};

export const ChatbotExample: React.FC = () => {
  const [selectedTheme, setSelectedTheme] =
    useState<PresetThemeName>("default");
  const [showFloating, setShowFloating] = useState(true);
  const [showTextSelection, setShowTextSelection] = useState(true);

  const handleMessage = (message: DifyMessage) => {
    console.log("New message:", message);
    // Handle message events (e.g., analytics, logging)
  };

  const handleError = (error: Error) => {
    console.error("Chat error:", error);
    // Handle errors (e.g., show notification)
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Dify Chat Tools Example
        </h1>

        {/* Theme Selector */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Theme Selector</h2>
          <select
            value={selectedTheme}
            onChange={(e) =>
              setSelectedTheme(e.target.value as PresetThemeName)
            }
            className="w-full max-w-xs p-2 border border-gray-300 rounded-md"
          >
            {Object.keys(presetThemes).map((theme) => (
              <option key={theme} value={theme}>
                {theme.charAt(0).toUpperCase() + theme.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Embedded Chatbot */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Embedded Chatbot</h2>
            <div className="h-[500px]">
              <DifyChatbot
                config={difyConfig}
                theme={presetThemes[selectedTheme]}
                title="Customer Support"
                subtitle="How can we help you today?"
                placeholder="Describe your issue..."
                showHeader={true}
                showAvatar={true}
                allowFileUpload={true}
                allowedFileTypes={[
                  "image/png",
                  "image/jpeg",
                  "application/pdf",
                  ".txt",
                ]}
                maxFileSize={10 * 1024 * 1024} // 10MB
                onMessage={handleMessage}
                onError={handleError}
              />
            </div>
          </div>

          {/* Text Selection Demo */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Text Selection Demo</h2>
            <div className="prose max-w-none">
              <p className="mb-4">
                Select any text in this area to see the text selection chatbot
                in action. This feature is perfect for documentation, articles,
                or any content where users might want to ask questions about
                specific sections.
              </p>
              <h3>Product Features</h3>
              <ul>
                <li>Real-time streaming responses</li>
                <li>File upload support</li>
                <li>Customizable themes</li>
                <li>Multiple display modes</li>
                <li>TypeScript support</li>
              </ul>
              <p>
                The text selection chatbot automatically includes the selected
                text as context in the conversation, making it easy for users to
                get specific answers about the content they're reading.
              </p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Controls</h2>
          <div className="flex gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showFloating}
                onChange={(e) => setShowFloating(e.target.checked)}
                className="mr-2"
              />
              Show Floating Chatbot
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={showTextSelection}
                onChange={(e) => setShowTextSelection(e.target.checked)}
                className="mr-2"
              />
              Enable Text Selection Chat
            </label>
          </div>
        </div>

        {/* Code Example */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Code Example</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm">
            {`import { DifyChatbot, presetThemes } from 'dify-chat-tools';

const config = {
  apiKey: 'your-api-key',
  baseUrl: 'your-base-url',
  userId: 'user-123'
};

<DifyChatbot
  config={config}
  theme={presetThemes.${selectedTheme}}
  title="Customer Support"
  onMessage={(message) => console.log(message)}
  onError={(error) => console.error(error)}
/>`}
          </pre>
        </div>
      </div>

      {/* Floating Chatbot */}
      {showFloating && (
        <DifyFloatingChatbot
          config={difyConfig}
          theme={presetThemes[selectedTheme]}
          title="Help Assistant"
          subtitle="Need help? Just ask!"
          position="bottom-right"
          offset={{ x: 20, y: 20 }}
          maxHeight={500}
          maxWidth={400}
          onMessage={handleMessage}
          onError={handleError}
        />
      )}

      {/* Text Selection Chatbot */}
      {showTextSelection && (
        <DifyTextSelectionChatbot
          config={difyConfig}
          theme={presetThemes[selectedTheme]}
          title="Text Assistant"
          subtitle="Ask about selected text"
          enabled={true}
          minSelectionLength={5}
          maxSelectionLength={1000}
          onMessage={handleMessage}
          onError={handleError}
          onSelectionChange={(text) => console.log("Selected text:", text)}
        />
      )}
    </div>
  );
};

export default ChatbotExample;
