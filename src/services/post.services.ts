import axios from "axios";

const baseURL = import.meta.env.VITE_BASE_URL;

export async function CreatePostAPI(formData: FormData) {
  const token = localStorage.getItem("token");

  const { data } = await axios.post(`${baseURL}posts/`, formData, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return data;
}

export async function UpdatePostAPI(postId: string, formData: FormData) {
  const token = localStorage.getItem("token");

  const { data } = await axios.put(`${baseURL}posts/${postId}`, formData, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return data;
}

export async function DeletePostAPI(postId: string) {
  const token = localStorage.getItem("token");

  const { data } = await axios.delete(`${baseURL}posts/${postId}`, {
    headers: {
      Authorization: "Bearer " + token,
    },
  });

  return data;
}

export async function likePost(postId: string) {
  const token = localStorage.getItem("token");

  return axios.put(
    `${baseURL}posts/${postId}/like`,
    {},
    {
      headers: {
        Authorization: "Bearer " + token,
      },
    },
  );
}

export async function sharePost(postId: string, body: string) {
  const token = localStorage.getItem("token");

  return axios.post(
    `${baseURL}posts/${postId}/share`,
    { body },
    {
      headers: {
        Authorization: "Bearer " + token,
        "Content-Type": "application/json",
      },
    },
  );
}

export const BOOKMARK_STORAGE_KEY = "falconix-bookmarks";

export function getSavedBookmarkIds(): string[] {
  try {
    const saved = localStorage.getItem(BOOKMARK_STORAGE_KEY);
    return saved ? (JSON.parse(saved) as string[]) : [];
  } catch (error) {
    console.error("Error reading saved bookmarks:", error);
    return [];
  }
}

export function isPostBookmarked(postId: string): boolean {
  return getSavedBookmarkIds().includes(postId);
}

export function toggleSavedBookmark(postId: string): string[] {
  const saved = new Set(getSavedBookmarkIds());

  if (saved.has(postId)) {
    saved.delete(postId);
  } else {
    saved.add(postId);
  }

  const next = [...saved];
  localStorage.setItem(BOOKMARK_STORAGE_KEY, JSON.stringify(next));

  return next;
}
