'use client';

import { MinimalTiptapEditor } from '@/components/ui/minimal-tiptap';
import type { Content } from '@tiptap/react';

interface NotesEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function NotesEditor({ value, onChange, placeholder, className }: NotesEditorProps) {
  const handleChange = (content: Content) => {
    // Convert content to HTML string
    const htmlContent = typeof content === 'string' ? content : '';
    onChange(htmlContent);
  };

  return (
    <div className={className}>
      <MinimalTiptapEditor
        value={value}
        onChange={handleChange}
        placeholder={placeholder || 'Start writing your notes...'}
        output="html"
        editorContentClassName="min-h-[400px] p-4 prose dark:prose-invert max-w-none"
        className="border-border"
      />
    </div>
  );
}
