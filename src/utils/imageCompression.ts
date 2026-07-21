export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1200,
  maxHeight: 1200,
  quality: 0.80,
  maxSizeMB: 0.15, // 150KB
};

/**
 * Comprime uma imagem usando canvas e converte para WebP
 */
export const compressImage = async (
  file: File,
  options: CompressionOptions = {}
): Promise<File> => {
  // Ignorar SVG e GIF animados para não quebrar funcionalidade ou animação
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    console.log(`Skipping compression for SVG/GIF: ${file.name}`);
    return file;
  }

  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Se a imagem já é pequena o suficiente e já está em formato WebP, retorna o arquivo original
  const fileSizeMB = file.size / 1024 / 1024;
  const isWebP = file.type === 'image/webp';
  if (isWebP && fileSizeMB < (opts.maxSizeMB || 0.15)) {
    console.log(`Image ${file.name} is already small enough and in WebP format (${fileSizeMB.toFixed(2)}MB)`);
    return file;
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        try {
          // Calcular novas dimensões mantendo aspect ratio
          let { width, height } = img;
          const maxWidth = opts.maxWidth || 1200;
          const maxHeight = opts.maxHeight || 1200;

          if (width > maxWidth || height > maxHeight) {
            const aspectRatio = width / height;

            if (width > height) {
              width = maxWidth;
              height = Math.round(width / aspectRatio);
            } else {
              height = maxHeight;
              width = Math.round(height * aspectRatio);
            }
          }

          // Criar canvas e comprimir
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
          }

          // Desenhar imagem no canvas
          ctx.drawImage(img, 0, 0, width, height);

          // Converter para blob em formato WebP
          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to compress image'));
                return;
              }

              const compressedSizeMB = blob.size / 1024 / 1024;
              console.log(
                `Compressed ${file.name} to WebP: ${fileSizeMB.toFixed(2)}MB → ${compressedSizeMB.toFixed(2)}MB (${((1 - compressedSizeMB / fileSizeMB) * 100).toFixed(1)}% reduction)`
              );

              // Gerar novo nome com extensão .webp
              const webpName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
              
              // Criar novo arquivo com o blob comprimido em WebP
              const compressedFile = new File([blob], webpName, {
                type: 'image/webp',
                lastModified: Date.now(),
              });

              resolve(compressedFile);
            },
            'image/webp',
            opts.quality || 0.80
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };

    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
};

/**
 * Comprime múltiplas imagens em paralelo
 */
export const compressImages = async (
  files: File[],
  options: CompressionOptions = {},
  onProgress?: (current: number, total: number) => void
): Promise<File[]> => {
  const results: File[] = [];

  for (let i = 0; i < files.length; i++) {
    try {
      const compressed = await compressImage(files[i], options);
      results.push(compressed);
      onProgress?.(i + 1, files.length);
    } catch (error) {
      console.error(`Failed to compress ${files[i].name}:`, error);
      // Em caso de erro, usa o arquivo original
      results.push(files[i]);
      onProgress?.(i + 1, files.length);
    }
  }

  return results;
};
