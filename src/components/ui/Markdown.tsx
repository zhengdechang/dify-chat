import { cn } from "../../lib/utils";
import { marked } from "marked";
import * as React from "react";
import {
  Suspense,
  isValidElement,
  memo,
  useMemo,
  useState,
  useEffect,
} from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

// Copy icon component
const CopyIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
    <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
  </svg>
);

// Check icon component
const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const extractTextContent = (node: React.ReactNode): string => {
  if (typeof node === "string") {
    return node;
  }
  if (Array.isArray(node)) {
    return node.map(extractTextContent).join("");
  }
  if (isValidElement(node)) {
    return extractTextContent(node.props.children);
  }
  return "";
};

interface HighlightedPreProps extends React.HTMLAttributes<HTMLPreElement> {
  language: string;
}

const HighlightedPre = memo(
  ({ children, className, language, ...props }: HighlightedPreProps) => {
    const [highlightedCode, setHighlightedCode] =
      useState<React.ReactNode>(null);
    const [copied, setCopied] = useState(false);
    const codeContent = extractTextContent(children);

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(codeContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy code:", err);
      }
    };

    useEffect(() => {
      const highlightCode = async () => {
        try {
          const { codeToTokens, bundledLanguages } = await import("shiki");
          const code = extractTextContent(children);

          if (!(language in bundledLanguages)) {
            setHighlightedCode(
              <pre
                {...props}
                className={cn(
                  "my-0 overflow-x-auto w-full rounded-b-xl bg-[#f9f9f9] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 border-0 p-4",
                  className
                )}
              >
                <code className="whitespace-pre-wrap">{children}</code>
              </pre>
            );
            return;
          }

          const { tokens } = await codeToTokens(code, {
            lang: language as keyof typeof bundledLanguages,
            themes: {
              light: "github-light",
              dark: "github-dark",
            },
          });

          setHighlightedCode(
            <pre
              {...props}
              className={cn(
                "my-0 overflow-x-auto w-full rounded-b-xl bg-[#f9f9f9] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 border-0 p-4",
                className
              )}
            >
              <code className="whitespace-pre-wrap">
                {tokens.map((line, lineIndex) => (
                  <span
                    key={`line-${
                      // biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
                      lineIndex
                    }`}
                  >
                    {line.map((token, tokenIndex) => {
                      const style =
                        typeof token.htmlStyle === "string"
                          ? undefined
                          : token.htmlStyle;

                      return (
                        <span
                          key={`token-${
                            // biome-ignore lint/suspicious/noArrayIndexKey: Needed for react key
                            tokenIndex
                          }`}
                          style={style}
                        >
                          {token.content}
                        </span>
                      );
                    })}
                    {lineIndex !== tokens.length - 1 && "\n"}
                  </span>
                ))}
              </code>
            </pre>
          );
        } catch (error) {
          console.error("Failed to highlight code:", error);
          setHighlightedCode(
            <pre
              {...props}
              className={cn(
                "my-0 overflow-x-auto w-full rounded-b-xl bg-[#f9f9f9] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 border-0 p-4",
                className
              )}
            >
              <code className="whitespace-pre-wrap">{children}</code>
            </pre>
          );
        }
      };

      highlightCode();
    }, [children, className, language, props]);

    const fallbackContent = (
      <pre
        {...props}
        className={cn(
          "my-0 overflow-x-auto w-full rounded-b-xl bg-[#f9f9f9] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 border-0 p-4",
          className
        )}
      >
        <code className="whitespace-pre-wrap">{children}</code>
      </pre>
    );

    return (
      <div className="relative group my-4 w-full">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-2 bg-[#f9f9f9] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 rounded-t-xl w-full">
          <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
            {language}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-2 px-2 py-1 text-xs text-zinc-500 hover:text-zinc-700 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:text-zinc-200 dark:hover:bg-zinc-800 rounded transition-colors"
            title={copied ? "Copied!" : "Copy code"}
          >
            {copied ? (
              <>
                <CheckIcon className="w-3 h-3" />
                Copied
              </>
            ) : (
              <>
                <CopyIcon className="w-3 h-3" />
                Copy
              </>
            )}
          </button>
        </div>

        {/* Code content */}
        {highlightedCode || fallbackContent}
      </div>
    );
  }
);

HighlightedPre.displayName = "HighlightedPre";

interface CodeBlockProps extends React.HTMLAttributes<HTMLPreElement> {
  language: string;
}

const CodeBlock = ({
  children,
  language,
  className,
  ...props
}: CodeBlockProps) => {
  return (
    <Suspense
      fallback={
        <div className="relative group my-4 w-full">
          <div className="flex items-center justify-between px-4 py-2 bg-[#f9f9f9] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 rounded-t-xl w-full">
            <span className="text-sm text-zinc-600 dark:text-zinc-300 font-medium">
              {language}
            </span>
            <button
              className="flex items-center gap-2 px-2 py-1 text-xs text-zinc-500 dark:text-zinc-400 rounded"
              disabled
            >
              <CopyIcon className="w-3 h-3" />
              Copy
            </button>
          </div>
          <pre
            {...props}
            className={cn(
              "my-0 overflow-x-auto w-full rounded-b-xl bg-[#f9f9f9] text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50 border-0 p-4",
              className
            )}
          >
            <code className="whitespace-pre-wrap">{children}</code>
          </pre>
        </div>
      }
    >
      <HighlightedPre language={language} className={className} {...props}>
        {children}
      </HighlightedPre>
    </Suspense>
  );
};

CodeBlock.displayName = "CodeBlock";

const components: Partial<Components> = {
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mt-2 scroll-m-20 text-4xl font-bold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className="mt-8 scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0"
      {...props}
    >
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className="mt-4 scroll-m-20 text-xl font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h4
      className="mt-4 scroll-m-20 text-lg font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h5
      className="mt-4 scroll-m-20 text-lg font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h6
      className="mt-4 scroll-m-20 text-base font-semibold tracking-tight"
      {...props}
    >
      {children}
    </h6>
  ),
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="leading-6 [&:not(:first-child)]:mt-4" {...props}>
      {children}
    </p>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <span className="font-semibold" {...props}>
      {children}
    </span>
  ),
  a: ({
    children,
    ...props
  }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className="font-medium underline underline-offset-4"
      target="_blank"
      rel="noreferrer"
      {...props}
    >
      {children}
    </a>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="my-4 ml-6 list-decimal" {...props}>
      {children}
    </ol>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="my-4 ml-6 list-disc" {...props}>
      {children}
    </ul>
  ),
  li: ({ children, ...props }: React.LiHTMLAttributes<HTMLLIElement>) => (
    <li className="mt-2" {...props}>
      {children}
    </li>
  ),
  blockquote: ({
    children,
    ...props
  }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mt-4 border-l-2 pl-6 italic" {...props}>
      {children}
    </blockquote>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-4 md:my-8" {...props} />
  ),
  table: ({ children, ...props }: React.HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 w-full overflow-y-auto">
      <table
        className="relative w-full overflow-hidden border-none text-sm"
        {...props}
      >
        {children}
      </table>
    </div>
  ),
  tr: ({ children, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => (
    <tr className="last:border-b-none m-0 border-b" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className="px-4 py-2 text-left font-bold [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }: React.HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className="px-4 py-2 text-left [&[align=center]]:text-center [&[align=right]]:text-right"
      {...props}
    >
      {children}
    </td>
  ),
  img: ({ alt, ...props }: React.ImgHTMLAttributes<HTMLImageElement>) => (
    // biome-ignore lint/a11y/useAltText: alt is not required
    <img className="rounded-md" alt={alt} {...props} />
  ),
  code: ({ children, node, className, ...props }) => {
    const match = /language-(\w+)/.exec(className || "");
    if (match) {
      return (
        <CodeBlock language={match[1]} className={className} {...props}>
          {children}
        </CodeBlock>
      );
    }
    return (
      <code
        className={cn(
          "rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm",
          className
        )}
        {...props}
      >
        {children}
      </code>
    );
  },
  pre: ({ children }) => <>{children}</>,
};

function parseMarkdownIntoBlocks(markdown: string): string[] {
  if (!markdown) {
    return [];
  }
  const tokens = marked.lexer(markdown);
  return tokens.map((token) => token.raw);
}

interface MarkdownBlockProps {
  content: string;
  className?: string;
}

const MemoizedMarkdownBlock = memo(
  ({ content, className }: MarkdownBlockProps) => {
    return (
      <div className={className}>
        <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
          {content}
        </ReactMarkdown>
      </div>
    );
  },
  (prevProps, nextProps) => {
    if (prevProps.content !== nextProps.content) {
      return false;
    }
    return true;
  }
);

MemoizedMarkdownBlock.displayName = "MemoizedMarkdownBlock";

interface MarkdownContentProps {
  content: string;
  id: string;
  className?: string;
}

export const MarkdownContent = memo(
  ({ content, id, className }: MarkdownContentProps) => {
    const blocks = useMemo(
      () => parseMarkdownIntoBlocks(content || ""),
      [content]
    );

    return blocks.map((block, index) => (
      <MemoizedMarkdownBlock
        content={block}
        className={className}
        key={`${id}-block_${
          // biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
          index
        }`}
      />
    ));
  }
);

MarkdownContent.displayName = "MarkdownContent";

// Export a simple Markdown component for backward compatibility
export const Markdown = ({ children }: { children: string }) => {
  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  );
};
