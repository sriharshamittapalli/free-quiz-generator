export function formatTextForMarkdown(text: string): string {
  // Replace double newlines with markdown paragraph breaks
  // This ensures \n\n creates proper paragraph spacing
  return text.replace(/\n\n/g, '\n\n&nbsp;\n\n')
}