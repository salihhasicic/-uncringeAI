const LOCAL_MAX_IMAGE_SIZE_BYTES = 8 * 1024 * 1024;
const NETLIFY_SAFE_MAX_IMAGE_SIZE_BYTES = Math.floor(4.5 * 1024 * 1024);

export const maxImageSizeBytes =
  import.meta.env.PROD && !import.meta.env.VITE_API_BASE_URL
    ? NETLIFY_SAFE_MAX_IMAGE_SIZE_BYTES
    : LOCAL_MAX_IMAGE_SIZE_BYTES;

export const maxImageSizeLabel =
  maxImageSizeBytes === NETLIFY_SAFE_MAX_IMAGE_SIZE_BYTES ? "4.5MB" : "8MB";

export const isNetlifyFunctionUploadLimit = maxImageSizeBytes === NETLIFY_SAFE_MAX_IMAGE_SIZE_BYTES;
