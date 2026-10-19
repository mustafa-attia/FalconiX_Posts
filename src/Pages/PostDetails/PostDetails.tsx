import { useEffect, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  ChevronDown,
  Globe2,
  Heart,
  MessageCircle,
  MoreHorizontal,
  Send,
  Share2,
} from "lucide-react";
import { Link, useParams } from "react-router";
import { getPostDetails } from "../../services/postDetails.services";
import type { FeedComment, FeedPost } from "../../types/feed.type";
import { CreateComment, getComments } from "../../services/comments.services";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../utils/errorMessage";

function PostDetails() {
  const { id } = useParams();
  const [details, setDetails] = useState<FeedPost | null>(null);
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [visibleComments, setVisibleComments] = useState(1);
  const [content, setContent] = useState<string>("");

  async function fetchPostDetails(postId: string) {
    try {
      const { data } = await getPostDetails(postId);
      // console.log(data.post);
      if (!data?.post) {
        throw new Error("The post details response did not include a post.");
      }
      setDetails(data.post);
    } catch (error) {
      console.error("Error fetching post details:", error);
      toast.error(getErrorMessage(error, "Unable to load this post."));
    }
  }

    async function handleCommentSubmit(e: FormEvent<HTMLFormElement>) {
      e.preventDefault();
  
      if (!id || !content.trim()) return;
      try {
        await CreateComment(id, content.trim());
        setContent("");
        await getPostComments(id);
      } catch (error) {
        console.error("Error creating comment:", error);
        toast.error(getErrorMessage(error, "Unable to add your comment."));
      }
    }

  async function getPostComments(postId: string) {
    try {
      const { data } = await getComments(postId);
      // console.log(data.comments);
      setComments(Array.isArray(data?.comments) ? data.comments : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
      toast.error(getErrorMessage(error, "Unable to load comments for this post."));
    }
  }

  useEffect(() => {
    if (!id) return;
    void fetchPostDetails(id);
    void getPostComments(id);
  }, [id]);

  function handleMoreComments() {
    setVisibleComments((prev) => (prev === 1 ? comments.length : 1));
  }


  return (
    <>
      <div className="mx-auto mt-5 w-full max-w-2xl px-4 sm:px-5">
        <Link
          className="inline-flex min-h-10 items-center gap-2 rounded-full px-3 text-sm font-medium text-[color:var(--muted)] transition-colors hover:bg-white hover:text-[color:var(--text)]"
          to="/"
        >
          <ArrowLeft aria-hidden="true" size={17} />
          Back to feed
        </Link>
      </div>
      <article className="premium-card mx-auto mb-6 mt-2 w-full max-w-2xl overflow-hidden">
        <header className="flex items-start justify-between gap-3 px-4 pt-5 sm:px-6">
          <div className="flex min-w-0 items-center gap-3">
            <img
              className="size-10 shrink-0 rounded-full object-cover ring-2 ring-[color:var(--panel-strong)]"
              src={details?.user.photo}
              alt={details?.user.name}
            />
            <div className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-1.5">
                <span className="truncate text-sm font-semibold text-[color:var(--text)]">
                  {details?.user.name}
                </span>
                <span className="truncate text-xs text-[color:var(--muted)]">
                  {details?.user.username}
                </span>
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[color:var(--muted)]">
                <span>
                  {details?.createdAt
                    ? new Date(details.createdAt).toLocaleString("en-us", {
                        timeStyle: "short",
                        dateStyle: "full",
                      })
                    : ""}
                </span>
                <span aria-hidden="true">·</span>
                <Globe2 aria-label="Public" size={13} />
                <span>{details?.privacy}</span>
              </div>
            </div>
          </div>
          <button
            aria-label="More post options"
            className="-mr-2 flex size-9 shrink-0 items-center justify-center rounded-full text-[color:var(--muted)] transition-colors hover:bg-[color:var(--panel)] hover:text-[color:var(--text)]"
            type="button"
          >
            <MoreHorizontal size={21} />
          </button>
        </header>

        <div className="px-4 pb-4 pt-4 text-sm leading-6 text-[#40534e] sm:px-6">
          <p>{details?.body}</p>
        </div>

        {details?.image && (
          <img
            className="block max-h-130 w-full bg-[color:var(--panel)] object-cover"
            src={details.image}
            alt={details.body}
          />
        )}

        <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-[color:var(--muted)] sm:px-6">
          <div className="flex items-center gap-2">
            <span className="flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-white">
              <Heart aria-hidden="true" fill="currentColor" size={11} />
            </span>
            <span>{details?.likesCount} likes</span>
          </div>
          <div className="flex gap-3">
            <span>{details?.commentsCount} comments</span>
            <span>{details?.sharesCount} shares</span>
          </div>
        </div>

        <div className="mx-4 flex border-y border-[color:var(--line)] sm:mx-6">
          <button
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold tracking-[-0.01em] text-[color:var(--muted)] transition-colors hover:bg-[color:var(--panel)] hover:text-[color:var(--primary)]"
            type="button"
          >
            <Heart fill="currentColor" size={18} />
            Like
          </button>
          <button
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold tracking-[-0.01em] text-[color:var(--muted)] transition-colors hover:bg-[color:var(--panel)] hover:text-[color:var(--primary)]"
            onClick={() =>
              document.getElementById("post-details-comment")?.focus()
            }
            type="button"
          >
            <MessageCircle size={18} />
            Comment
          </button>
          <button
            className="flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold tracking-[-0.01em] text-[color:var(--muted)] transition-colors hover:bg-[color:var(--panel)] hover:text-[color:var(--primary)]"
            type="button"
          >
            <Share2 size={18} />
            Share
          </button>
        </div>

        <section aria-label="Comments" className="px-4 pb-5 pt-4 sm:px-6">
          {comments.length > 0 ? (
            comments.slice(0, visibleComments).map((comment) => {
              return (
                <div className="mb-3" key={comment._id}>
                  <div className="flex items-start gap-2.5">
                    <img
                      alt={comment?.commentCreator.name + "'s comment"}
                      className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                      src={comment?.commentCreator.photo}
                    />
                    <div className="comment-bubble min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-1.5">
                        <span className="text-xs font-semibold text-[#20272b]">
                          {comment.commentCreator.name}
                        </span>
                        <span className="text-[11px] text-[#778185]">
                          {comment.commentCreator.username}
                        </span>
                      </div>
                      <p className="mt-0.5 break-words text-sm leading-5 text-[#414b50]">
                        {comment.content}
                      </p>
                      <span className="mt-1 block text-[11px] text-[#778185]">
                        {new Date(comment.createdAt!).toLocaleString("en-us", {
                          timeStyle: "short",
                          dateStyle: "full",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <>
              {details?.topComment && (
                <div className="space-y-4" key={details?.topComment._id}>
                  <div className="flex items-start gap-2.5">
                    <img
                      alt={details?.user.name + "'s comment"}
                      className="mt-0.5 size-8 shrink-0 rounded-full object-cover"
                      src={details?.topComment?.commentCreator.photo}
                    />
                    <div className="comment-bubble min-w-0">
                      <div className="flex flex-wrap items-baseline gap-x-1.5">
                        <span className="text-xs font-semibold text-[#20272b]">
                          {details?.topComment?.commentCreator.name}
                        </span>
                        <span className="text-[11px] text-[#778185]">
                          {details?.topComment?.commentCreator.username}
                        </span>
                        <span className="text-[11px] text-[color:var(--accent)]">
                          Top Commment
                        </span>
                      </div>
                      <p className="mt-0.5 break-words text-sm leading-5 text-[#414b50]">
                        {details?.topComment?.content}
                      </p>
                      <span className="mt-1 block text-[11px] text-[#778185]">
                        {details?.topComment?.createdAt
                          ? new Date(details.topComment.createdAt).toLocaleString("en-us", {
                              timeStyle: "short",
                              dateStyle: "full",
                            })
                          : ""}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          <button
            className="mt-3 flex items-center gap-1 text-sm font-semibold text-[color:var(--muted)] transition-colors hover:text-[color:var(--primary)]"
            type="button"
            onClick={handleMoreComments}
          >
            {visibleComments === 1
              ? "Show more comments"
              : "Show less comments"}

            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                visibleComments > 1 ? "rotate-180" : ""
              }`}
            />
          </button>
          <form
            className="mt-4 flex items-center gap-2.5"
            onSubmit={handleCommentSubmit}
          >
            <img
              alt="Your profile"
              className="size-8 shrink-0 rounded-full object-cover"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&h=96&q=80"
            />
            <label className="flex min-w-0 flex-1 items-center rounded-full bg-[color:var(--panel)] pr-1.5 focus-within:ring-2 focus-within:ring-[rgba(40,122,107,0.16)]">
              <span className="sr-only">Write a comment</span>
              <input
                className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm text-[color:var(--text)] outline-none focus-visible:outline-none placeholder:text-[color:var(--muted)]"
                id="post-details-comment"
                placeholder="Write a comment..."
                  value={content}
          onChange={(e) => setContent(e.target.value)}

              />
              <button
                aria-label="Post comment"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-[color:var(--primary)] transition-colors hover:bg-[color:var(--panel-strong)] disabled:text-[#9ba1a3] disabled:hover:bg-transparent"
                type="submit"
                disabled={!content.trim()}
              >
                <Send size={16} />
              </button>
            </label>
          </form>
        </section>
      </article>
    </>
  );
}

export default PostDetails;