import React, { useState } from 'react';
import { DifyFloatingChatbot, DifyTextSelectionChatbot } from '../index';
import { Heart, Star, Zap, MessageSquare, Sparkles, Bot } from 'lucide-react';
import type { DifyConfig } from '../types';

const difyConfig: DifyConfig = {
  apiKey: "app-cKF6LdxKUb9dWxgX4hRby",
  baseUrl: "http://dify.com",
  userId: "custom-components-test-user",
  inputs: {},
};

// Custom trigger component example
const CustomTrigger: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-110"
  >
    <Sparkles className="h-6 w-6" />
  </div>
);

// Custom icon component
const CustomIcon: React.FC = () => (
  <div className="relative">
    <Bot className="h-6 w-6" />
    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse" />
  </div>
);

export const CustomComponentsTest: React.FC = () => {
  const [activeExample, setActiveExample] = useState<string>('none');

  const examples = [
    {
      id: 'custom-icon',
      title: 'Custom Icon',
      description: 'Floating chatbot with custom icon and text',
    },
    {
      id: 'custom-trigger',
      title: 'Custom Trigger',
      description: 'Completely custom trigger component',
    },
    {
      id: 'text-selection',
      title: 'Text Selection',
      description: 'Text selection chatbot with custom styling',
    },
    {
      id: 'multiple',
      title: 'Multiple Bots',
      description: 'Multiple chatbots with different customizations',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8">Custom Components Test</h1>
        
        {/* Example Selection */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Example to Test</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {examples.map((example) => (
              <button
                key={example.id}
                onClick={() => setActiveExample(activeExample === example.id ? 'none' : example.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  activeExample === example.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <h3 className="font-semibold">{example.title}</h3>
                <p className="text-sm text-gray-600 mt-1">{example.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Code Examples */}
        <div className="space-y-8">
          {/* Custom Icon Example */}
          {activeExample === 'custom-icon' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Custom Icon Example</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
{`import { Heart } from 'lucide-react';

<DifyFloatingChatbot
  config={config}
  triggerIcon={<Heart className="h-6 w-6" />}
  triggerText="Chat with us"
  position="bottom-right"
/>`}
              </pre>
              <p className="text-sm text-gray-600">
                Check the bottom-right corner for the floating chatbot with a heart icon.
              </p>
            </div>
          )}

          {/* Custom Trigger Example */}
          {activeExample === 'custom-trigger' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Custom Trigger Example</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
{`const CustomTrigger = ({ onClick }) => (
  <div 
    onClick={onClick}
    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:scale-110"
  >
    <Sparkles className="h-6 w-6" />
  </div>
);

<DifyFloatingChatbot
  config={config}
  trigger={<CustomTrigger />}
  position="bottom-left"
/>`}
              </pre>
              <p className="text-sm text-gray-600">
                Check the bottom-left corner for the floating chatbot with a custom gradient trigger.
              </p>
            </div>
          )}

          {/* Text Selection Example */}
          {activeExample === 'text-selection' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Text Selection Example</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
{`<DifyTextSelectionChatbot
  config={config}
  triggerIcon={<MessageSquare className="h-4 w-4" />}
  triggerText="Ask AI"
  enabled={true}
  minSelectionLength={3}
  maxSelectionLength={500}
/>`}
              </pre>
              <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                <p className="text-blue-800 font-medium mb-2">Try selecting this text:</p>
                <p className="text-gray-700">
                  React is a JavaScript library for building user interfaces. It was developed by Facebook 
                  and is now maintained by Meta and the community. React allows developers to create 
                  reusable UI components and manage application state efficiently. Select any part of 
                  this text to see the custom text selection chatbot in action!
                </p>
              </div>
            </div>
          )}

          {/* Multiple Bots Example */}
          {activeExample === 'multiple' && (
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Multiple Chatbots Example</h2>
              <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto text-sm mb-4">
{`// Support chatbot
<DifyFloatingChatbot
  config={config}
  triggerIcon={<Heart className="h-5 w-5" />}
  triggerText="Support"
  position="bottom-right"
/>

// Sales chatbot  
<DifyFloatingChatbot
  config={config}
  triggerIcon={<Star className="h-5 w-5" />}
  triggerText="Sales"
  position="bottom-left"
/>

// Text selection helper
<DifyTextSelectionChatbot
  config={config}
  triggerIcon={<Zap className="h-4 w-4" />}
  triggerText="Explain"
  enabled={true}
/>`}
              </pre>
              <p className="text-sm text-gray-600">
                Multiple chatbots are now active with different purposes and styling.
              </p>
            </div>
          )}
        </div>

        {/* General Instructions */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-8">
          <h2 className="text-xl font-semibold mb-4">Testing Instructions</h2>
          <div className="space-y-4 text-sm">
            <div className="p-4 bg-yellow-50 rounded-lg">
              <h3 className="font-semibold text-yellow-800 mb-2">Scroll Behavior Test:</h3>
              <ul className="list-disc list-inside space-y-1 text-yellow-700">
                <li>Ask for a long response to test streaming scroll behavior</li>
                <li>Try scrolling the page while chatbot is streaming</li>
                <li>Verify that page scroll is not affected by chatbot scroll</li>
                <li>Test on both desktop and mobile devices</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Conditional Chatbots based on active example */}
      {activeExample === 'custom-icon' && (
        <DifyFloatingChatbot
          config={difyConfig}
          triggerIcon={<Heart className="h-6 w-6" />}
          triggerText="Chat with us"
          position="bottom-right"
          title="Support Assistant"
          subtitle="How can we help you?"
        />
      )}

      {activeExample === 'custom-trigger' && (
        <DifyFloatingChatbot
          config={difyConfig}
          trigger={<CustomTrigger onClick={() => {}} />}
          position="bottom-left"
          title="Custom Assistant"
          subtitle="Powered by custom trigger"
        />
      )}

      {activeExample === 'text-selection' && (
        <DifyTextSelectionChatbot
          config={difyConfig}
          triggerIcon={<MessageSquare className="h-4 w-4" />}
          triggerText="Ask AI"
          enabled={true}
          minSelectionLength={3}
          maxSelectionLength={500}
          title="Text Helper"
          subtitle="Ask about selected text"
        />
      )}

      {activeExample === 'multiple' && (
        <>
          <DifyFloatingChatbot
            config={difyConfig}
            triggerIcon={<Heart className="h-5 w-5" />}
            triggerText="Support"
            position="bottom-right"
            title="Support Team"
            subtitle="We're here to help!"
          />
          
          <DifyFloatingChatbot
            config={difyConfig}
            triggerIcon={<Star className="h-5 w-5" />}
            triggerText="Sales"
            position="bottom-left"
            title="Sales Team"
            subtitle="Let's talk business!"
          />
          
          <DifyTextSelectionChatbot
            config={difyConfig}
            triggerIcon={<Zap className="h-4 w-4" />}
            triggerText="Explain"
            enabled={true}
            title="AI Explainer"
            subtitle="Get instant explanations"
          />
        </>
      )}
    </div>
  );
};
