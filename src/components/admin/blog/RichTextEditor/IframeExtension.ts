import { Node } from '@tiptap/core';

export const Iframe = Node.create({
  name: 'iframe',
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
        tag: 'iframe',
        getAttrs: (node) => ({
          src: (node as HTMLElement).getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'div',
      {
        'data-iframe-wrapper': '',
        class: 'w-full aspect-video rounded-lg my-6 max-w-4xl mx-auto overflow-hidden border border-muted',
      },
      [
        'iframe',
        {
          src: HTMLAttributes.src,
          width: '100%',
          height: '100%',
          allowfullscreen: 'true',
          frameborder: '0',
          allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture',
          style: 'aspect-ratio: 16/9; width: 100%; height: 100%; border: none;',
        },
      ],
    ];
  },

  addCommands() {
    return {
      setIframe:
        (options: { src: string }) =>
        ({ commands }) => {
          return commands.insertContent({
            type: this.name,
            attrs: options,
          });
        },
    };
  },
});
