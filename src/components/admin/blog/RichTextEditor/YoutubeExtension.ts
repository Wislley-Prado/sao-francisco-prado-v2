import { Node } from '@tiptap/core';

export const Youtube = Node.create({
  name: 'youtube',
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
        tag: 'div[data-youtube-video] iframe',
        getAttrs: (node) => ({
          src: (node as HTMLElement).getAttribute('src'),
        }),
      },
      {
        tag: 'iframe[src*="youtube.com"]',
        getAttrs: (node) => ({
          src: (node as HTMLElement).getAttribute('src'),
        }),
      },
      {
        tag: 'iframe[src*="youtu.be"]',
        getAttrs: (node) => ({
          src: (node as HTMLElement).getAttribute('src'),
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    let src = HTMLAttributes.src || '';
    // Normalize YouTube URL to embed format if needed
    if (src.includes('watch?v=')) {
      const videoId = src.split('v=')[1]?.split('&')[0];
      if (videoId) {
        src = `https://www.youtube.com/embed/${videoId}`;
      }
    } else if (src.includes('youtu.be/')) {
      const videoId = src.split('youtu.be/')[1]?.split('?')[0];
      if (videoId) {
        src = `https://www.youtube.com/embed/${videoId}`;
      }
    }

    return [
      'div',
      {
        'data-youtube-video': '',
        class: 'w-full aspect-video rounded-lg my-6 max-w-4xl mx-auto overflow-hidden border border-muted',
      },
      [
        'iframe',
        {
          src: src,
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
      setYoutubeVideo:
        (options: { src: string }) =>
        ({ commands }) => {
          let src = options.src;
          // Normalize YouTube URL to embed format if needed
          if (src.includes('watch?v=')) {
            const videoId = src.split('v=')[1]?.split('&')[0];
            if (videoId) {
              src = `https://www.youtube.com/embed/${videoId}`;
            }
          } else if (src.includes('youtu.be/')) {
            const videoId = src.split('youtu.be/')[1]?.split('?')[0];
            if (videoId) {
              src = `https://www.youtube.com/embed/${videoId}`;
            }
          }

          return commands.insertContent({
            type: this.name,
            attrs: { src },
          });
        },
    };
  },
});
