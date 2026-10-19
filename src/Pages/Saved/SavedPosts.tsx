import { useEffect, useState } from "react";
import { Bookmark } from "lucide-react";
import PostCard from "../../Components/Layout/PostCard/PostCard";
import { getSavedBookmarkIds } from "../../services/post.services";
import { getFeed } from "../../services/feed.services";
import type { FeedPost } from "../../types/feed.type";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorMessage";

export default function SavedPosts() {
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchSavedPosts() {
    try {
      const { data } = await getFeed();
      const savedIds = getSavedBookmarkIds();
      const filtered = (data.posts ?? []).filter((post: FeedPost) => savedIds.includes(post._id));
      setPosts(filtered);
    } catch (error) {
      console.error("Error fetching saved posts:", error);
      toast.error(getErrorMessage(error, "Unable to load saved posts. Please try again."));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    void fetchSavedPosts();
  }, []);

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
      <div className="premium-card mb-6 flex items-center justify-between gap-3 p-5">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[color:var(--muted)]">Saved</p>
          <h1 className="mt-1 text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)]">Bookmarked posts</h1>
        </div>
        <div className="flex size-11 items-center justify-center rounded-2xl bg-[color:var(--accent-soft)] text-[color:var(--accent)]">
          <Bookmark size={18} />
        </div>
      </div>

      {loading ? (
        <div className="premium-card p-6 text-sm text-[color:var(--muted)]">Loading saved posts...</div>
      ) : posts.length === 0 ? (
        <div className="empty-state">
          You have no saved posts yet.
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard key={post._id} post={post} getPosts={fetchSavedPosts} />
          ))}
        </div>
      )}
    </main>
  );
}
