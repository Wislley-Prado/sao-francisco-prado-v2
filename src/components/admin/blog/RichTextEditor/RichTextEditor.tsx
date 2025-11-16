import React from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { TOOLBAR_BUTTONS, TOOLBAR_ACTIONS, HISTORY_BUTTONS } from './toolbarConfig';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const RichTextEditorComponent = ({ value, onChange, placeholder }: RichTextEditorProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-primary underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Escreva o conteúdo do post...',
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-none focus:outline-none min-h-[300px] p-4',
      },
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="bg-muted border-b p-2 flex flex-wrap gap-1">
        {TOOLBAR_BUTTONS.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.title}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => button.action(editor)}
              className={cn(button.isActive?.(editor) && 'bg-accent')}
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
        
        {TOOLBAR_ACTIONS.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.title}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => button.action(editor)}
              className={cn(button.isActive?.(editor) && 'bg-accent')}
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}

        <div className="flex-1" />

        {HISTORY_BUTTONS.map((button) => {
          const Icon = button.icon;
          return (
            <Button
              key={button.title}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => button.action(editor)}
              disabled={button.disabled?.(editor)}
              title={button.title}
            >
              <Icon className="h-4 w-4" />
            </Button>
          );
        })}
      </div>
      <EditorContent editor={editor} className="bg-background" />
    </div>
  );
};

export const RichTextEditor = React.memo(RichTextEditorComponent);
