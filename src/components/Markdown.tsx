import ReactMarkdown from "react-markdown";

/**
 * Renders a Markdown string (lesson prose, callouts, story text). Centralizing
 * this means every block that shows prose looks consistent and we configure
 * Markdown in one place.
 */
export function Markdown({ children }: { children: string }) {
  return (
    <div className="markdown leading-relaxed text-text">
      <ReactMarkdown>{children}</ReactMarkdown>
    </div>
  );
}
