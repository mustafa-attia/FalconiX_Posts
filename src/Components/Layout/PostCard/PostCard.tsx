import { useContext, useEffect, useState, type FormEvent } from "react";
import { Bookmark, Check, ChevronDown, Copy, Heart, MessageCircle, MoreHorizontal, Send, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { AlertDialog, Button, Dropdown, Label } from "@heroui/react";
import toast from "react-hot-toast";

import type { FeedComment, FeedPost } from "../../../types/feed.type";
import { CreateComment, getComments } from "../../../services/comments.services";
import { UserContext, type UserContextType } from "../../../context/UserContext";
import EditPost from "./EditPost";
import { DeletePostAPI, isPostBookmarked, likePost, sharePost, toggleSavedBookmark } from "../../../services/post.services";

export default function PostCard({ post, getPosts }: { post: FeedPost; getPosts: () => void }) {
  const [comments, setComments] = useState<FeedComment[]>([]);
  const [visibleComments, setVisibleComments] = useState(false);
  const [content, setContent] = useState("");
  const [showEditPost, setShowEditPost] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const userContext = useContext(UserContext) as UserContextType | null;
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(isPostBookmarked(post._id));
  const [liked, setLiked] = useState(Boolean(post.likes?.includes(userContext?.userDetails?._id ?? "")));
  const [likeCount, setLikeCount] = useState(post.likesCount ?? post.likes.length);

  const userDetails = userContext?.userDetails ?? null;
  const safePhoto = post.user.photo || "https://placehold.co/120x120/0f172a/f8fafc?text=User";

  const restOfComments = comments.filter((comment) => comment._id !== post.topComment?._id);

  useEffect(() => {
    setVisibleComments(false);
    void getPostComments(post._id);
  }, [post._id]);

  useEffect(() => {
    setLiked(Boolean(post.likes?.includes(userDetails?._id ?? "")));
    setIsBookmarked(isPostBookmarked(post._id));
    setLikeCount(post.likesCount ?? post.likes.length);
  }, [post._id, post.likes, post.likesCount, userDetails?._id]);

  async function getPostComments(postId: string) {
    try {
      const { data } = await getComments(postId);
      setComments(Array.isArray(data?.comments) ? data.comments : []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  }

  async function handleCommentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedContent = content.trim();

    if (!trimmedContent || isSubmittingComment) return;

    setIsSubmittingComment(true);

    try {
      await CreateComment(post._id, trimmedContent);
      setContent("");
      await getPostComments(post._id);
    } catch (error) {
      console.error("Error creating comment:", error);
      toast.error("Unable to add comment right now.");
    } finally {
      setIsSubmittingComment(false);
    }
  }

  function handleMoreComments() {
    setVisibleComments((prev) => !prev);
  }

  async function deleteMyPost(postId: string) {
    try {
      await DeletePostAPI(postId);
      setShowDeleteDialog(false);
      getPosts();
      toast.success("Post deleted successfully.");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("You do not have permission to delete this post or the server rejected the request.");
    }
  }

  async function handleLikeToggle() {
    if (isLiking || !userDetails?._id) return;

    const nextLikedState = !liked;
    setIsLiking(true);
    setLiked(nextLikedState);
    setLikeCount((current) => Math.max(0, current + (nextLikedState ? 1 : -1)));

    try {
      await likePost(post._id);
      await getPosts();
    } catch (error) {
      console.error("Error toggling like:", error);
      setLiked(!nextLikedState);
      setLikeCount((current) => Math.max(0, current + (nextLikedState ? -1 : 1)));
      toast.error("Unable to update like state.");
    } finally {
      setIsLiking(false);
    }
  }

  function handleBookmarkToggle() {
    const next = toggleSavedBookmark(post._id);
    setIsBookmarked(next.includes(post._id));
    toast.success(isBookmarked ? "Bookmark removed." : "Post saved.");
  }

  async function handleSharePost() {
    if (isSharing) return;

    const shareText = window.prompt("Add a short message for this share", "Sharing this great post @mentor_user") ?? "";
    const body = shareText.trim() || "Sharing this great post @mentor_user";

    setIsSharing(true);

    try {
      await sharePost(post._id, body);
      toast.success("Post shared successfully.");
      await getPosts();
    } catch (error) {
      console.error("Error sharing post:", error);
      toast.error("Unable to share this post right now.");
    } finally {
      setIsSharing(false);
    }
  }

  async function handleCopyLink() {
    const link = `${window.location.origin}/postDetails/${post._id}`;

    try {
      await navigator.clipboard.writeText(link);
      toast.success("Post link copied to clipboard.");
    } catch (error) {
      console.error("Error copying link:", error);
      toast.error("Unable to copy the post link.");
    }
  }

  return (
    <article className="premium-card mx-auto w-full max-w-2xl overflow-hidden transition-shadow duration-200 hover:shadow-[0_18px_48px_rgba(31,69,62,0.1)]">
      <header className="flex items-start justify-between gap-3 px-4 pt-5 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <img src={safePhoto} alt={post.user.name} className="size-11 shrink-0 rounded-full object-cover ring-2 ring-[#f0eee9]" />

          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-2">
              <span className="truncate text-sm font-semibold text-[#20272b]">{post.user.name}</span>
              <span className="truncate text-xs text-[#778185]">@{post.user.username}</span>
            </div>
            <div className="mt-1 flex flex-wrap items-center gap-1.5 text-xs text-[#778185]">
              <span>{post.createdAt}</span>
              <span aria-hidden="true">·</span>
              <span>{post.privacy}</span>
            </div>
          </div>
        </div>

        <Dropdown>
          <Button aria-label="Post actions" variant="ghost" className="rounded-full text-[#647773] transition-colors hover:bg-[color:var(--panel)] hover:text-[color:var(--primary)]">
            <MoreHorizontal size={20} />
          </Button>
          <Dropdown.Popover>
            <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
              {post.user._id === userDetails?._id && (
                <>
                  <Dropdown.Item id="edit-post" onClick={() => setShowEditPost(true)} textValue="Edit post">
                    <Label>Edit Post</Label>
                  </Dropdown.Item>
                  <Dropdown.Item id="delete-post" onClick={() => setShowDeleteDialog(true)} textValue="Delete post" variant="danger">
                    <Label>Delete Post</Label>
                  </Dropdown.Item>
                </>
              )}
              <Dropdown.Item id="save-post" onClick={handleBookmarkToggle} textValue="Save post">
                <Bookmark size={16} />
                <Label>{isBookmarked ? "Unsave Post" : "Save Post"}</Label>
              </Dropdown.Item>
              <Dropdown.Item id="share-post" onClick={handleSharePost} textValue="Share post">
                <Share2 size={16} />
                <Label>{isSharing ? "Sharing..." : "Share Post"}</Label>
              </Dropdown.Item>
              <Dropdown.Item id="copy-post-link" onClick={handleCopyLink} textValue="Copy post link">
                <Copy size={16} />
                <Label>Copy Link</Label>
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown.Popover>
        </Dropdown>
      </header>

      <AlertDialog isOpen={showDeleteDialog}>
        <AlertDialog.Backdrop>
          <AlertDialog.Container>
            <AlertDialog.Dialog className="sm:max-w-105">
              <AlertDialog.CloseTrigger />
              <AlertDialog.Header>
                <AlertDialog.Icon status="danger" />
                <AlertDialog.Heading>Delete post permanently?</AlertDialog.Heading>
              </AlertDialog.Header>
              <AlertDialog.Body>
                <p className="text-sm text-[#647075]">
                  This action removes the post for everyone and cannot be undone.
                </p>
              </AlertDialog.Body>
              <AlertDialog.Footer>
                <Button slot="close" onClick={() => setShowDeleteDialog(false)} variant="tertiary">
                  Cancel
                </Button>
                <Button slot="close" onClick={() => deleteMyPost(post._id)} variant="danger">
                  Delete Post
                </Button>
              </AlertDialog.Footer>
            </AlertDialog.Dialog>
          </AlertDialog.Container>
        </AlertDialog.Backdrop>
      </AlertDialog>

      {showEditPost ? (
        <EditPost getPosts={getPosts} postId={post._id} setShowEditPost={setShowEditPost} initialContent={post.body ?? ""} initialImage={post.image ?? null} />
      ) : (
        <>
          {post.body && (
            <div className="px-4 pb-4 pt-4 text-sm leading-6 text-[#354b46] sm:px-6">
              <p className="whitespace-pre-wrap">{post.body}</p>
            </div>
          )}

          {post.image && (
            <img className="block max-h-130 w-full bg-[#edf3f1] object-cover" src={post.image} alt="Post attachment" />
          )}
        </>
      )}

      <div className="flex items-center justify-between gap-3 px-4 py-3 text-xs text-[#778185] sm:px-5">
        <div className="flex items-center gap-2">
          <span className="flex size-4.5 items-center justify-center rounded-full bg-rose-500 text-white">
            <Heart size={11} fill="currentColor" />
          </span>
          <span>{likeCount} likes</span>
        </div>

        <div className="flex gap-3">
          <button type="button" className="transition hover:text-[#20272b]" onClick={() => document.getElementById(`comment-form-${post._id}`)?.querySelector("input")?.focus()}>
            {post.commentsCount} comments
          </button>
          <span>{post.sharesCount} shares</span>
        </div>
      </div>

      <div className="mx-4 flex items-center gap-1 border-y border-(--line) px-1 py-1 sm:mx-5">
        <button
          type="button"
          aria-label="Like post"
          disabled={isLiking}
          onClick={handleLikeToggle}
          className={`flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold tracking-[-0.01em] transition-colors ${liked ? "bg-rose-50 text-rose-600" : "text-[#647773] hover:bg-[#f3f7f5] hover:text-rose-600"}`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          {liked ? "Liked" : "Like"}
        </button>

        <button
          type="button"
          aria-label="Comment on post"
          className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold tracking-[-0.01em] text-[#647773] transition-colors hover:bg-[#f3f7f5] hover:text-(--primary)"
          onClick={() => document.getElementById(`comment-form-${post._id}`)?.querySelector("input")?.focus()}
        >
          <MessageCircle size={18} />
          Comment
        </button>

        <Link to={`/postDetails/${post._id}`} className="flex min-h-11 min-w-0 flex-1 items-center justify-center gap-2 rounded-xl text-[13px] font-semibold tracking-[-0.01em] text-[#647773] transition-colors hover:bg-[#f3f7f5] hover:text-[#96652f]">
          Details
        </Link>
      </div>

      <section aria-label="Comments" className="px-4 pb-4 pt-3 sm:px-5">
        {post.topComment && (
          <div className="mb-3" key={post.topComment._id}>
            <div className="flex items-start gap-2.5">
              <img alt={`${post.topComment.commentCreator.name}'s comment`} className="mt-0.5 size-8 shrink-0 rounded-full object-cover" src={post.topComment.commentCreator.photo || "https://placehold.co/80x80/0f172a/f8fafc?text=U"} />

              <div className="comment-bubble min-w-0">
                <div className="flex flex-wrap items-center gap-x-1.5">
                  <span className="text-xs font-semibold text-[#20272b]">{post.topComment.commentCreator.name}</span>
                  <span className="text-[11px] text-[#778185]">@{post.topComment.commentCreator.username}</span>
                  <span className="text-[11px] font-medium text-[#a87842]">Top Comment</span>
                  {post.topComment.commentCreator._id === userDetails?._id && (
                    <Dropdown>
                      <Button aria-label="Menu" variant="ghost">
                        <MoreHorizontal size={18} />
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                          <Dropdown.Item id="edit-comment" textValue="Edit comment"><Label>Edit Comment</Label></Dropdown.Item>
                          <Dropdown.Item id="delete-comment" textValue="Delete comment" variant="danger"><Label>Delete Comment</Label></Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  )}
                </div>

                <p className="mt-0.5 wrap-break-word text-sm leading-5 text-[#414b50]">{post.topComment.content}</p>
                <time className="mt-1 block text-[11px] text-[#778185]">{new Date(post.topComment.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</time>
              </div>
            </div>
          </div>
        )}

        {visibleComments && restOfComments.map((comment) => (
          <div className="mb-3" key={comment._id}>
            <div className="flex items-start gap-2.5">
              <img alt={`${comment.commentCreator.name}'s comment`} className="mt-0.5 size-8 shrink-0 rounded-full object-cover" src={comment.commentCreator.photo || "https://placehold.co/80x80/0f172a/f8fafc?text=U"} />

              <div className="comment-bubble min-w-0">
                <div className="flex flex-wrap items-center gap-x-1.5">
                  <span className="text-xs font-semibold text-[#20272b]">{comment.commentCreator.name}</span>
                  <span className="text-[11px] text-[#778185]">@{comment.commentCreator.username}</span>
                  {comment.commentCreator._id === userDetails?._id && (
                    <Dropdown>
                      <Button aria-label="Menu" variant="ghost">
                        <MoreHorizontal size={18} />
                      </Button>
                      <Dropdown.Popover>
                        <Dropdown.Menu onAction={(key) => console.log(`Selected: ${key}`)}>
                          <Dropdown.Item id="edit-comment" textValue="Edit comment"><Label>Edit Comment</Label></Dropdown.Item>
                          <Dropdown.Item id="delete-comment" textValue="Delete comment" variant="danger"><Label>Delete Comment</Label></Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown.Popover>
                    </Dropdown>
                  )}
                </div>

                <p className="mt-0.5 wrap-break-word text-sm leading-5 text-[#414b50]">{comment.content}</p>
                <time className="mt-1 block text-[11px] text-[#778185]">{new Date(comment.createdAt).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</time>
              </div>
            </div>
          </div>
        ))}

        {restOfComments.length > 0 && (
          <button type="button" className="mt-1 flex items-center gap-1 text-sm font-semibold text-[#647075] transition hover:text-[#20272b]" onClick={handleMoreComments}>
            {visibleComments ? "Show less comments" : "Show more comments"}
            <ChevronDown size={16} className={`transition-transform duration-200 ${visibleComments ? "rotate-180" : ""}`} />
          </button>
        )}

        <form id={`comment-form-${post._id}`} className="mt-4 flex items-center gap-2.5" onSubmit={handleCommentSubmit}>
          <img alt={userDetails?.name ?? "Your profile"} className="size-8 shrink-0 rounded-full object-cover" src={userDetails?.photo || "https://placehold.co/80x80/0f172a/f8fafc?text=U"} />

          <label className="flex min-w-0 flex-1 items-center rounded-full bg-(--panel) pr-1.5 focus-within:ring-2 focus-within:ring-[rgba(168,120,66,0.2)]">
            <span className="sr-only">Write a comment</span>
            <input
              type="text"
              name="comment"
              className="min-w-0 flex-1 rounded-full bg-transparent px-4 py-2.5 text-sm text-[color:var(--text)] outline-none focus-visible:outline-none placeholder:text-[color:var(--muted)]"
              placeholder="Write a comment..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
            />
            <button
              aria-label="Post comment"
              className="flex size-8 shrink-0 items-center justify-center rounded-full text-[#414b50] transition hover:bg-[#e9e9e5] disabled:cursor-not-allowed disabled:text-[#9ba1a3]"
              type="submit"
              disabled={!content.trim() || isSubmittingComment}
            >
              {isSubmittingComment ? <Check size={16} /> : <Send size={16} />}
            </button>
          </label>
        </form>
      </section>
    </article>
  );
}
