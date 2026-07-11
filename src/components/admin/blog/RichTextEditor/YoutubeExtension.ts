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
      isShort: {
        default: false,
        parseHTML: (element) => element.hasAttribute('data-youtube-short'),
        renderHTML: (attributes) => {
          if (attributes.isShort) {
            return { 'data-youtube-short': '' };
          }
          return {};
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-youtube-video] iframe',
        getAttrs: (node) => {
          const iframe = node as HTMLElement;
          const parent = iframe.parentElement;
          return {
            src: iframe.getAttribute('src'),
            isShort: parent ? parent.hasAttribute('data-youtube-short') : false,
          };
        },
      },
      {
        tag: 'iframe[src*="youtube.com"]',
        getAttrs: (node) => {
          const iframe = node as HTMLElement;
          const src = iframe.getAttribute('src') || '';
          return {
            src,
            isShort: src.includes('/shorts/'),
          };
        },
      },
      {
        tag: 'iframe[src*="youtu.be"]',
        getAttrs: (node) => ({
          src: (node as HTMLElement).getAttribute('src'),
          isShort: false,
        }),
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    let src = HTMLAttributes.src || '';
    let isShort = HTMLAttributes.isShort || false;

    // Normalize YouTube URL to embed format if needed
    if (src.includes('/shorts/')) {
      const videoId = src.split('/shorts/')[1]?.split('?')[0];
      if (videoId) {
        src = `https://www.youtube.com/embed/${videoId}`;
        isShort = true;
      }
    } else if (src.includes('watch?v=')) {
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

    if (isShort) {
      return [
        'div',
        {
          'data-youtube-video': '',
          'data-youtube-short': '',
          class: 'w-full max-w-[400px] mx-auto my-6 overflow-hidden rounded-lg border border-muted shadow-sm aspect-[9/16] bg-background',
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
            style: 'width: 100%; height: 100%; border: none; min-height: 500px;',
          },
        ],
      ];
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
          let isShort = false;

          // Normalize YouTube URL to embed format if needed
          if (src.includes('/shorts/')) {
            const videoId = src.split('/shorts/')[1]?.split('?')[0];
            if (videoId) {
              src = `https://www.youtube.com/embed/${videoId}`;
              isShort = true;
            }
          } else if (src.includes('watch?v=')) {
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
            attrs: { src, isShort },
          });
        },
    };
  },
});
