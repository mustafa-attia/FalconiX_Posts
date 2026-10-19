import Sidebar from "../../Components/Layout/Sidebar/Sidebar";
import PostCard from "../../Components/Layout/PostCard/PostCard";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { FeedPost } from "../../types/feed.type";
import { getAllPosts } from "../../services/feed.services";
import { PostSkeleton } from "../../Components/Layout/PostCard/PostSkeleton";
import CreatePost from "../../Components/Layout/PostCard/CreatePost";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorMessage";

const PAGE_SIZE = 10;

export default function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

  const fetchPosts = useCallback(async (requestedPage: number) => {
    setLoading(true);
    setLoadError(null);

    try {
      const result = await getAllPosts(requestedPage, PAGE_SIZE);
      setPosts(result.posts);
      setCurrentPage(result.page);
      setTotalPages(result.totalPages);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching posts:", error.response?.data?.message || error.message);
      } else {
        console.error("Error fetching posts:", error);
      }
      setLoadError(getErrorMessage(error, "Unable to load posts. Please try again."));
      toast.error(getErrorMessage(error, "Unable to load posts. Please try again."));
    }finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      void fetchPosts(1);
    }, 0);
    return () => window.clearTimeout(timeoutId);
  }, [fetchPosts]);

  const hasPreviousPage = currentPage > 1;
  const hasNextPage = totalPages === null ? posts.length === PAGE_SIZE : currentPage < totalPages;

  return (
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 p-4 sm:px-6 sm:py-7 lg:flex-row lg:items-start lg:gap-8 lg:px-8 xl:gap-10">
      <aside className="w-full lg:w-72 lg:shrink-0">
        <Sidebar />
      </aside>

      <section className="w-full min-w-0 flex-1 space-y-6">
        <div className="premium-card overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-[color:var(--line)] bg-white px-5 py-6 text-[color:var(--text)] sm:px-7 sm:py-7">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--accent)]">Discover</p>
                <h1 className="mt-2 text-2xl font-bold tracking-[-0.045em] sm:text-[28px]">Your circle, curated.</h1>
              </div>
              <span className="brand-mark bg-[color:var(--panel)] text-[color:var(--muted)]">Live</span>
            </div>
          </div>
        </div>

        <CreatePost getPosts={() => fetchPosts(currentPage)} />

        {loading && posts.length === 0 ? (
          <PostSkeleton />
        ) : loadError && posts.length === 0 ? (
          <div className="empty-state space-y-3">
            <p role="alert">{loadError}</p>
            <button type="button" className="secondary-button mx-auto" onClick={() => void fetchPosts(currentPage)}>
              Try again
            </button>
          </div>
        ) : (
          <>
            {loading && <p className="text-center text-sm text-[color:var(--muted)]" aria-live="polite">Loading posts…</p>}
            {loadError && <p className="rounded-xl bg-white p-3 text-sm text-[color:var(--danger)]" role="alert">{loadError}</p>}
            {posts.length === 0 ? (
              <div className="empty-state">No posts to show yet.</div>
            ) : (
              posts.map((post) => (
                <PostCard key={post._id} post={post} getPosts={() => fetchPosts(currentPage)} />
              ))
            )}
            {posts.length > 0 && (
              <nav aria-label="Posts pagination" className="premium-card flex items-center justify-between gap-3 p-3 sm:p-4">
                <span className="text-sm text-[color:var(--muted)]">
                  Page {currentPage}{totalPages !== null ? ` of ${Math.max(totalPages, 1)}` : ""}
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    className="secondary-button min-h-10 px-3 py-2"
                    disabled={!hasPreviousPage || loading}
                    onClick={() => void fetchPosts(currentPage - 1)}
                    aria-label="Previous posts page"
                  >
                    <ChevronLeft size={16} />
                    Previous
                  </button>
                  <button
                    type="button"
                    className="secondary-button min-h-10 px-3 py-2"
                    disabled={!hasNextPage || loading}
                    onClick={() => void fetchPosts(currentPage + 1)}
                    aria-label="Next posts page"
                  >
                    Next
                    <ChevronRight size={16} />
                  </button>
                </div>
              </nav>
            )}
          </>
        )}
      </section>
    </main>
  );
}
