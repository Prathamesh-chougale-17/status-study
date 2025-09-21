'use client';

import { useEffect, useRef, useState } from 'react';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function QuillEditor({ value, onChange, placeholder, className }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadQuill = async () => {
      try {
        // Dynamically import Quill
        const Quill = (await import('quill')).default;
        
        // Import Quill styles dynamically
        if (typeof window !== 'undefined') {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = 'https://cdn.quilljs.com/1.3.6/quill.snow.css';
          document.head.appendChild(link);
        }

        if (editorRef.current && !quillRef.current) {
          quillRef.current = new Quill(editorRef.current, {
            theme: 'snow',
            placeholder: placeholder || 'Start writing...',
            modules: {
              toolbar: [
                [{ 'header': [1, 2, 3, false] }],
                ['bold', 'italic', 'underline', 'strike'],
                [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                ['link', 'code-block'],
                ['clean']
              ],
            },
          });

          // Set initial value
          if (value) {
            quillRef.current.root.innerHTML = value;
          }

          // Listen for changes
          quillRef.current.on('text-change', () => {
            const html = quillRef.current.root.innerHTML;
            onChange(html);
          });

          setIsLoaded(true);
        }
      } catch (error) {
        console.error('Error loading Quill:', error);
        // Fallback to textarea if Quill fails to load
        setIsLoaded(true);
      }
    };

    loadQuill();

    return () => {
      if (quillRef.current) {
        quillRef.current = null;
      }
      // Clean up CSS link
      if (typeof window !== 'undefined') {
        const existingLink = document.querySelector('link[href="https://cdn.quilljs.com/1.3.6/quill.snow.css"]');
        if (existingLink) {
          existingLink.remove();
        }
      }
    };
  }, []);

  useEffect(() => {
    if (quillRef.current && isLoaded && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value;
    }
  }, [value, isLoaded]);

  if (!isLoaded) {
    return (
      <div className={`min-h-[400px] flex items-center justify-center ${className || ''}`}>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className={`quill-editor ${className || ''}`}>
      <div 
        ref={editorRef} 
        className="min-h-[400px] bg-background text-foreground"
        style={{
          border: '1px solid hsl(var(--border))',
          borderRadius: '6px',
        }}
      />
      <style jsx global>{`
        .quill-editor .ql-toolbar {
          border-top: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-bottom: none;
          background: hsl(var(--background));
        }
        
        .quill-editor .ql-container {
          border-bottom: 1px solid hsl(var(--border));
          border-left: 1px solid hsl(var(--border));
          border-right: 1px solid hsl(var(--border));
          border-top: none;
          background: hsl(var(--background));
        }
        
        .quill-editor .ql-editor {
          color: hsl(var(--foreground));
          min-height: 400px;
        }
        
        .quill-editor .ql-editor.ql-blank::before {
          color: hsl(var(--muted-foreground));
          font-style: normal;
        }
        
        .quill-editor .ql-toolbar .ql-stroke {
          stroke: hsl(var(--foreground));
        }
        
        .quill-editor .ql-toolbar .ql-fill {
          fill: hsl(var(--foreground));
        }
        
        .quill-editor .ql-toolbar button:hover {
          background: hsl(var(--muted));
        }
        
        .quill-editor .ql-toolbar button.ql-active {
          background: hsl(var(--muted));
        }
        
        .quill-editor .ql-toolbar .ql-picker-label {
          color: hsl(var(--foreground));
        }
        
        .quill-editor .ql-toolbar .ql-picker-options {
          background: hsl(var(--background));
          border: 1px solid hsl(var(--border));
        }
        
        .quill-editor .ql-toolbar .ql-picker-item {
          color: hsl(var(--foreground));
        }
        
        .quill-editor .ql-toolbar .ql-picker-item:hover {
          background: hsl(var(--muted));
        }
      `}</style>
    </div>
  );
}
