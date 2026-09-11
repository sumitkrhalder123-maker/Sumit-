/**
 * Helper utility to handle client media uploads, image compression for localStorage,
 * and video link embedding (YouTube, Vimeo, Google Drive, direct MP4).
 */

export const compressImageFile = (
  file: File,
  maxWidth = 1400,
  maxHeight = 1400,
  quality = 0.85
): Promise<string> => {
  return new Promise((resolve, reject) => {
    // If it's an SVG, read directly as data URL
    if (file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        // Resize while maintaining aspect ratio
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(img.src);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Convert to WebP if supported, otherwise JPEG
        let dataUrl = '';
        try {
          dataUrl = canvas.toDataURL('image/webp', quality);
        } catch {
          dataUrl = canvas.toDataURL('image/jpeg', quality);
        }

        resolve(dataUrl || (e.target?.result as string));
      };
      img.onerror = () => {
        resolve(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Parses video URLs into standard embed URLs or identifies direct video formats.
 */
export const getVideoInfo = (url?: string): { isVideo: boolean; embedUrl?: string; isDirect: boolean } => {
  if (!url || typeof url !== 'string') {
    return { isVideo: false, isDirect: false };
  }

  const trimmed = url.trim();

  // YouTube matchers
  const ytMatch = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/
  );
  if (ytMatch && ytMatch[1]) {
    return {
      isVideo: true,
      embedUrl: `https://www.youtube-nocookie.com/embed/${ytMatch[1]}?autoplay=1&rel=0`,
      isDirect: false,
    };
  }

  // Vimeo matchers
  const vimeoMatch = trimmed.match(/vimeo\.com\/(?:channels\/(?:\w+\/)?|groups\/[^/]*\/videos\/|album\/(?:\d+\/)?video\/|video\/|)(\d+)/);
  if (vimeoMatch && vimeoMatch[1]) {
    return {
      isVideo: true,
      embedUrl: `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`,
      isDirect: false,
    };
  }

  // Google Drive preview matcher
  const driveMatch = trimmed.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch && driveMatch[1]) {
    return {
      isVideo: true,
      embedUrl: `https://drive.google.com/file/d/${driveMatch[1]}/preview`,
      isDirect: false,
    };
  }

  // Direct video file extensions or video Data URLs
  if (
    trimmed.startsWith('data:video/') ||
    trimmed.match(/\.(mp4|webm|ogg|mov)(\?.*)?$/i)
  ) {
    return {
      isVideo: true,
      embedUrl: trimmed,
      isDirect: true,
    };
  }

  return { isVideo: false, isDirect: false };
};
