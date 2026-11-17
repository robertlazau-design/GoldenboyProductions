/// <reference types="vite/client" />

// Defined by the Google tag in index.html; missing if an ad blocker strips it.
interface Window {
  gtag?: (...args: unknown[]) => void;
}

declare module '*.JPG' {
  const src: string;
  export default src;
}

declare module '*.MOV' {
  const src: string;
  export default src;
}

declare module '*.MP4' {
  const src: string;
  export default src;
}

declare module '*.mp4' {
  const src: string;
  export default src;
}
