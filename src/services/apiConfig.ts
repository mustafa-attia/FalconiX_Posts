const configuredBaseUrl = import.meta.env.VITE_BASE_URL?.trim();
const defaultBaseUrl = "https://route-posts.routemisr.com";

export const API_BASE_URL = `${(configuredBaseUrl || defaultBaseUrl).replace(/\/+$/, "")}/`;
