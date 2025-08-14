"use client";

import { useState } from "react";
import {
  DifyChatbot,
  DifyFloatingChatbot,
  DifyTextSelectionChatbot,
  presetThemes,
} from "@codedevin/dify-cchat";
import "@codedevin/dify-cchat/dist/style.css";

export default function Home() {
  const [selectedDemo, setSelectedDemo] = useState<
    "embedded" | "floating" | "text-selection"
  >("embedded");
  const [currentTheme, setCurrentTheme] = useState<"light" | "dark">("light");

  // Dify API 配置
  const difyConfig = {
    baseUrl: "https://api.dify.ai/v1",
    apiKey: "app-xxx", // Replace with your actual Dify app token
    userId: "demo-user",
    inputs: {},
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div></div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
              Dify Chat Tools Demo
            </h1>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-gray-600 dark:text-gray-300">
                {currentTheme === "light" ? "🌞" : "🌙"}
              </span>
              <button
                onClick={() =>
                  setCurrentTheme(currentTheme === "light" ? "dark" : "light")
                }
                className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    currentTheme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            体验三种不同的聊天机器人集成模式
          </p>

          {/* Demo Selection */}
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setSelectedDemo("embedded")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedDemo === "embedded"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              嵌入式聊天
            </button>
            <button
              onClick={() => setSelectedDemo("floating")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedDemo === "floating"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              浮动聊天
            </button>
            <button
              onClick={() => setSelectedDemo("text-selection")}
              className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                selectedDemo === "text-selection"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
              }`}
            >
              文本选择聊天
            </button>
          </div>
        </div>

        {/* Demo Content */}
        <div className="max-w-6xl mx-auto">
          {selectedDemo === "embedded" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                嵌入式聊天机器人
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                直接嵌入到页面中的聊天界面，适合作为页面的主要交互组件。
              </p>
              <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                <DifyChatbot
                  config={difyConfig}
                  className="h-96"
                  theme={presetThemes[currentTheme]}
                />
              </div>
            </div>
          )}

          {selectedDemo === "floating" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                浮动聊天机器人
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                页面右下角的浮动聊天按钮，点击后展开聊天界面。适合作为网站的客服助手。
              </p>
              <div className="text-center py-12">
                <p className="text-lg text-gray-500 dark:text-gray-400">
                  查看页面右下角的浮动聊天按钮 →
                </p>
              </div>
              <DifyFloatingChatbot
                config={difyConfig}
                position="bottom-right"
                theme={presetThemes[currentTheme]}
              />
            </div>
          )}

          {selectedDemo === "text-selection" && (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
                文本选择聊天机器人
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                选择页面中的文本时自动出现的聊天工具，可以基于选中的内容进行对话。
              </p>
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                  试试选择下面的文本：
                </h3>
                <div className="space-y-4">
                  <div className="border-l-4 border-green-500 pl-4">
                    <h4 className="font-medium text-green-700 dark:text-green-300 mb-2">
                      ✅ 可以触发聊天的文本（带有 data-pfchat 属性）
                    </h4>
                    <div
                      className="prose dark:prose-invert max-w-none"
                      data-pfchat="true"
                    >
                      <p>
                        人工智能（Artificial
                        Intelligence，AI）是计算机科学的一个分支，
                        它企图了解智能的实质，并生产出一种新的能以人类智能相似的方式做出反应的智能机器。
                        该领域的研究包括机器人、语言识别、图像识别、自然语言处理和专家系统等。
                      </p>
                      <p>
                        机器学习是人工智能的一个重要分支，它使计算机能够在没有明确编程的情况下学习。
                        深度学习则是机器学习的一个子集，它模仿人脑的工作方式来处理数据并创建用于决策的模式。
                      </p>
                    </div>
                  </div>

                  <div className="border-l-4 border-red-500 pl-4">
                    <h4 className="font-medium text-red-700 dark:text-red-300 mb-2">
                      ❌ 不会触发聊天的文本（没有 data-pfchat 属性）
                    </h4>
                    <div className="prose dark:prose-invert max-w-none">
                      <p>
                        自然语言处理（NLP）是人工智能和语言学领域的分支学科，
                        它研究如何处理及运用自然语言。自然语言处理包括多个方面和步骤，
                        基本有认知、理解、生成等部分。选择这段文本不会触发聊天机器人。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <DifyTextSelectionChatbot
                config={difyConfig}
                theme={presetThemes[currentTheme]}
                targetAttribute="data-pfchat"
              />
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-12 space-y-6">
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              ⚠️ API 配置说明
            </h3>
            <p className="text-blue-700 dark:text-blue-300 mb-3">
              当前使用的是示例配置，请在代码中修改为你的实际 Dify API 配置：
            </p>
            <ul className="list-disc list-inside text-blue-700 dark:text-blue-300 space-y-1">
              <li>
                <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                  baseUrl
                </code>{" "}
                应该是你的 Dify API 地址（例如：https://api.dify.ai/v1）
              </li>
              <li>
                <code className="bg-blue-100 dark:bg-blue-800 px-1 rounded">
                  apiKey
                </code>{" "}
                应该是你的实际 API Key
              </li>
              <li>确保 API Key 有足够的权限进行聊天对话</li>
              <li>检查网络连接和 CORS 设置</li>
            </ul>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
              📚 使用指南
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  嵌入式聊天
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  适合集成到页面主体内容中，作为主要的交互界面。支持文件上传、全屏模式等功能。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  浮动聊天
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  以浮动按钮的形式出现在页面角落，点击后展开聊天窗口。适合作为客服助手。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  文本选择聊天
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  当用户选择页面文本时自动出现，可以基于选中内容进行智能对话。
                </p>
              </div>
              <div>
                <h4 className="font-medium text-blue-800 dark:text-blue-200 mb-2">
                  主题切换
                </h4>
                <p className="text-blue-700 dark:text-blue-300">
                  支持 Light 和 Dark
                  两种主题模式，点击右上角的切换按钮体验不同主题效果。
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
