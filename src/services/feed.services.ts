import axios from "axios";
import type { FeedPost } from "../types/feed.type";

const baseURL = import.meta.env.VITE_BASE_URL;

export type AllPostsPage = {
  posts: FeedPost[];
  page: number;
  totalPages: number | null;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readPostsPayload(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  if ("posts" in payload || "paginationResult" in payload) return payload;
  return "data" in payload ? readPostsPayload(payload.data) : payload;
}

function readPage(payload: unknown, requestedPage: number): number {
  if (!isRecord(payload)) return requestedPage;

  for (const key of ["currentPage", "page"]) {
    const value = payload[key];
    if (typeof value === "number" && Number.isInteger(value) && value > 0) return value;
  }

  if (isRecord(payload.paginationResult)) return readPage(payload.paginationResult, requestedPage);
  return requestedPage;
}

function readTotalPages(payload: unknown): number | null {
  if (!isRecord(payload)) return null;

  for (const key of ["totalPages", "numberOfPages"]) {
    const value = payload[key];
    if (typeof value === "number" && Number.isInteger(value) && value >= 0) return value;
  }

  return isRecord(payload.paginationResult) ? readTotalPages(payload.paginationResult) : null;
}

export async function getAllPosts(page = 1, limit = 10): Promise<AllPostsPage> {
  const token = localStorage.getItem("token");

  const { data } = await axios.get<unknown>(`${baseURL}posts`, {
    params: { page, limit },
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  });

  const payload = readPostsPayload(data);
  const posts = Array.isArray(payload)
    ? payload
    : isRecord(payload) && Array.isArray(payload.posts)
      ? payload.posts
      : null;

  if (!posts) {
    throw new Error("Posts response did not include a post list.");
  }

  return {
    posts: posts.filter((post): post is FeedPost => isRecord(post) && typeof post._id === "string"),
    page: readPage(payload, page),
    totalPages: readTotalPages(payload),
  };
}

export async function getFeed() {
  const token = localStorage.getItem("token");

  const { data } = await axios.get(`${baseURL}posts?limit=10`, {
    headers: {
      "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
  });

  return data;
}
