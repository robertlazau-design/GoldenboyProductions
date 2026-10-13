export const isVideoFile = (url: string) => {
  if (!url) return false;
  return /\.(mp4|webm|mov|ogg|m4v)($|\?)/i.test(url);
};

export const isDriveVideo = (url: string) => {
  if (!url) return false;
  return url.includes('drive.google.com/file/d/') && url.endsWith('/preview');
};

export const isAnyVideo = (url: string) => isVideoFile(url) || isDriveVideo(url);
