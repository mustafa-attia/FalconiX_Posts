import Sidebar from "../../Components/Layout/Sidebar/Sidebar";
import PostCard from "../../Components/Layout/PostCard/PostCard";
import axios from "axios";
import { useEffect, useState } from "react";
import type { FeedPost } from "../../types/feed.type";
import { getFeed } from "../../services/feed.services";
import { PostSkeleton } from "../../Components/Layout/PostCard/PostSkeleton";
import CreatePost from "../../Components/Layout/PostCard/CreatePost";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorMessage";

export default function Feed() {
  const [posts, setPosts] = useState<FeedPost[]>([]);

  const [loading, setLoading] = useState<boolean>(true);
  async function fetchPosts() {
    try {
      const {data} = await getFeed();
      // console.log(data);
      
      setPosts(data.posts);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Error fetching posts:", error.response?.data?.message || error.message);
      }
      toast.error(getErrorMessage(error, "Unable to load posts. Please try again."));
    }finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchPosts();
  }, []);

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

        <CreatePost getPosts={fetchPosts} />

        {loading ? (
          <PostSkeleton />
        ) : (
          posts.map((post) => (
            <PostCard key={post._id} post={post} getPosts={fetchPosts} />
          ))
        )}
      </section>
    </main>
  );
}
