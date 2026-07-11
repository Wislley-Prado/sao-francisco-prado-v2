import { Node } from '@tiptap/core';

export const Instagram = Node.create({
  name: 'instagram',
  group: 'block',
  selectable: true,
  draggable: true,
  atom: true,

  addAttributes() {
    return {
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-instagram-post] iframe',
        getAttrs: (node) => ({
          src: (node as HTMLElement).getAttribute('src'),
        }),
      },
      {
        tag: 'iframe[src*="instagram.com"]',
        getAttrs: (node) => ({
          src: (node as HTMLElement).getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    let src = HTMLAttributes.src || '';
    
    // Normalize URL
    if (src && !src.endsWith('/embed') && !src.endsWith('/embed/')) {
      const cleanUrl = src.split('?')[0].replace(/\/$/, '');
      src = `${cleanUrl}/embed/`;
    }

    return [
      'div',
      {
        'data-instagram-post': '',
        class: 'w-full max-w-[450px] mx-auto my-6 overflow-hidden rounded-lg border border-muted shadow-sm aspect-[4/5] bg-background',
      },
      [
        'iframe',
        {
          src: src,
          width: '100%',
          height: '100%',
          allowfullscreen: 'true',
          frameborder: '0',
          style: 'width: 100%; height: 100%; border: none; min-height: 480px;',
        },
      ],
    ];
  },

  addCommands() {
    return {
      setInstagramPost:
        (options: { src: string }) =>
        ({ commands }) => {
          let src = options.src;
          if (src && !src.endsWith('/embed') && !src.endsWith('/embed/')) {
            const cleanUrl = src.split('?')[0].replace(/\/$/, '');
            src = `${cleanUrl}/embed/`;
          }
          return commands.insertContent({
            type: this.name,
            attrs: { src },
          });
        },
    };
  },
});
