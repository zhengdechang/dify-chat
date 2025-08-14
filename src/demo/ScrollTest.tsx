import React, { useState } from "react";
import { DifyChatbot, DifyFloatingChatbot } from "../index";
import type { DifyConfig } from "../types";

const difyConfig: DifyConfig = {
  apiKey: "app-xxx", // Replace with your actual Dify app token
  baseUrl: "https://api.dify.ai/v1",
  userId: "scroll-test-user",
  inputs: {},
};

export const ScrollTest: React.FC = () => {
  const [showFloating, setShowFloating] = useState(false);
  const [preventExternalScroll, setPreventExternalScroll] = useState(false);
  const [isolateScroll, setIsolateScroll] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Long content to test external scroll */}
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Scroll Behavior Test</h1>

        <div className="mb-8 space-y-4">
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
              checked={preventExternalScroll}
              onChange={(e) => setPreventExternalScroll(e.target.checked)}
              className="mr-2"
            />
            Prevent External Scroll (for embedded chatbot)
          </label>

          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isolateScroll}
              onChange={(e) => setIsolateScroll(e.target.checked)}
              className="mr-2"
            />
            Isolate Scroll (use fixed positioning like floating chatbot)
          </label>

          <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
            <p>
              <strong>Test Instructions:</strong>
            </p>
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>
                <strong>Default:</strong> Embedded chatbot allows page scroll
                (best UX)
              </li>
              <li>
                <strong>Prevent External Scroll:</strong> Prevents page scroll
                at boundaries
              </li>
              <li>
                <strong>Isolate Scroll:</strong> Uses fixed positioning to
                completely isolate from page scroll (like floating chatbot)
              </li>
              <li>
                <strong>Floating chatbot:</strong> Always isolated regardless of
                settings
              </li>
            </ul>
          </div>
        </div>

        {/* Long content to create external scroll */}
        <div className="space-y-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Test Content Section 1
            </h2>
            <p className="mb-4">
              This is a long section of content to test external scrolling
              behavior. When the chatbot is embedded or floating, it should not
              interfere with the page's natural scroll behavior.
            </p>
            <div className="h-96 bg-gradient-to-b from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
              <p className="text-blue-800 font-medium">Tall content block 1</p>
            </div>
          </div>

          {/* Embedded Chatbot */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Embedded Chatbot - Scroll Test
            </h2>
            <p className="mb-4 text-sm text-gray-600">
              Test streaming scroll behavior: The chatbot should auto-scroll to
              follow streaming content without affecting the page scroll.
            </p>
            <div className={isolateScroll ? "" : "h-[400px] border rounded-lg"}>
              <DifyChatbot
                config={difyConfig}
                title="Scroll Test Assistant"
                subtitle="Testing streaming scroll behavior"
                placeholder="Ask me to write a long response to test streaming scroll..."
                showHeader={true}
                showAvatar={true}
                allowFileUpload={false}
                maxHeight={400}
                preventExternalScroll={preventExternalScroll}
                isolateScroll={isolateScroll}
              />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Test Content Section 2
            </h2>
            <div className="h-96 bg-gradient-to-b from-green-100 to-green-200 rounded-lg flex items-center justify-center">
              <p className="text-green-800 font-medium">Tall content block 2</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Test Content Section 3
            </h2>
            <div className="h-96 bg-gradient-to-b from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
              <p className="text-purple-800 font-medium">
                Tall content block 3
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">Test Instructions</h2>
            <div className="space-y-4 text-sm">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2">
                  Streaming Scroll Test:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-blue-700">
                  <li>
                    Ask the chatbot to write a very long response (e.g., "Write
                    a detailed explanation about React hooks")
                  </li>
                  <li>
                    Observe that the chat auto-scrolls to follow the streaming
                    content
                  </li>
                  <li>
                    Try scrolling up in the chat while streaming - it should
                    stop auto-scroll
                  </li>
                  <li>Scroll back to bottom - auto-scroll should resume</li>
                </ol>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2">
                  External Scroll Test:
                </h3>
                <ol className="list-decimal list-inside space-y-1 text-green-700">
                  <li>Scroll the page up and down - should work normally</li>
                  <li>
                    When chatbot is at scroll boundaries, page scroll should not
                    be affected
                  </li>
                  <li>Enable floating chatbot and test the same behavior</li>
                  <li>On mobile, test touch scrolling behavior</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">
              Test Content Section 4
            </h2>
            <div className="h-96 bg-gradient-to-b from-red-100 to-red-200 rounded-lg flex items-center justify-center">
              <p className="text-red-800 font-medium">Tall content block 4</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold mb-4">End of Test Content</h2>
            <p className="text-gray-600">
              This is the end of the test content. You should be able to scroll
              back to the top without any interference from the chatbot
              components.
            </p>
          </div>
        </div>
      </div>

      {/* Floating Chatbot */}
      {showFloating && (
        <DifyFloatingChatbot
          config={difyConfig}
          title="Floating Scroll Test"
          subtitle="Testing floating scroll behavior"
          position="bottom-right"
          maxHeight={400}
          maxWidth={350}
        />
      )}
    </div>
  );
};
