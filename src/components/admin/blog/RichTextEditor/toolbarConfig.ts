import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Heading1,
  Heading2,
  Heading3,
  Code,
  Link2,
  ImageIcon,
  Undo,
  Redo,
  Quote,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';

export interface ToolbarButton {
  icon: typeof Bold;
  title: string;
  action: (editor: Editor) => void;
  isActive?: (editor: Editor) => boolean;
  disabled?: (editor: Editor) => boolean;
}

export const TOOLBAR_BUTTONS: ToolbarButton[] = [
  {
    icon: Bold,
    title: 'Negrito',
    action: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive('bold'),
  },
  {
    icon: Italic,
    title: 'Itálico',
    action: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive('italic'),
  },
  {
    icon: Heading1,
    title: 'Título 1',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 1 }),
  },
  {
    icon: Heading2,
    title: 'Título 2',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 2 }),
  },
  {
    icon: Heading3,
    title: 'Título 3',
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive('heading', { level: 3 }),
  },
  {
    icon: List,
    title: 'Lista',
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive('bulletList'),
  },
  {
    icon: ListOrdered,
    title: 'Lista Ordenada',
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive('orderedList'),
  },
  {
    icon: Code,
    title: 'Bloco de Código',
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive('codeBlock'),
  },
  {
    icon: Quote,
    title: 'Citação',
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive('blockquote'),
  },
];

export const TOOLBAR_ACTIONS: ToolbarButton[] = [
  {
    icon: Link2,
    title: 'Adicionar Link',
    action: (editor) => {
      const url = window.prompt('Digite a URL:');
      if (url) {
        editor.chain().focus().setLink({ href: url }).run();
      }
    },
    isActive: (editor) => editor.isActive('link'),
  },
  {
    icon: ImageIcon,
    title: 'Adicionar Imagem',
    action: (editor) => {
      const url = window.prompt('Digite a URL da imagem:');
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    },
  },
];

export const HISTORY_BUTTONS: ToolbarButton[] = [
  {
    icon: Undo,
    title: 'Desfazer',
    action: (editor) => editor.chain().focus().undo().run(),
    disabled: (editor) => !editor.can().undo(),
  },
  {
    icon: Redo,
    title: 'Refazer',
    action: (editor) => editor.chain().focus().redo().run(),
    disabled: (editor) => !editor.can().redo(),
  },
];
