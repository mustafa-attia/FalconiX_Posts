import { ImageIcon, Send, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { UpdatePostAPI } from "../../../services/post.services";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/errorMessage";

export default function EditPost({
  postId,
  setShowEditPost,
  getPosts,
  initialContent = "",
  initialImage = null,
}: {
  postId: string;
  setShowEditPost: (arg: boolean) => void;
  getPosts: () => void;
  initialContent?: string;
  initialImage?: string | null;
}) {
  const [content, setContent] = useState<string>(initialContent);
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(initialImage);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setContent(initialContent);
    setImagePreview(initialImage);
  }, [initialContent, initialImage]);

  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  function handleImage(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (isSubmitting || (!content.trim() && !image && !initialImage)) return;

    const trimmedContent = content.trim();
    const formData = new FormData();

    try {
      setIsSubmitting(true);
      if (trimmedContent) {
        formData.append("body", trimmedContent);
      }

      if (image) {
        formData.append("image", image);
      }

      await UpdatePostAPI(postId, formData);

      setContent("");
      handleClosePreview();
      getPosts();
      setShowEditPost(false);
      toast.success("Post updated successfully.");
    } catch (error) {
      // console.log(error);
      toast.error(getErrorMessage(error, "Unable to update your post. Please try again."));
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleClosePreview() {
    setImage(null);
    setImagePreview(initialImage ?? null);
  }

  function handleCancel() {
    setContent(initialContent);
    setImage(null);
    setImagePreview(initialImage ?? null);
    setShowEditPost(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="premium-card mx-auto mb-4 w-full max-w-2xl overflow-hidden p-4 sm:p-5"
    >
      <textarea
        placeholder="What is in your mind ?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        rows={4}
        className="field-shell resize-none text-sm leading-6"
      />

      {imagePreview && (
        <div className="relative mt-3 overflow-hidden rounded-[18px] border border-[color:var(--line)]">
          <button
            type="button"
            aria-label="Remove image"
            className="absolute right-2 top-2 grid size-8 place-items-center rounded-full bg-white/95 text-[color:var(--text)] shadow-sm"
            onClick={handleClosePreview}
          >
            <X size={16} />
          </button>
          <img
            src={imagePreview}
            alt="Selected post image"
            className="max-h-64 w-full object-cover"
          />
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--line)] pt-3">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex cursor-pointer items-center gap-1.5 text-sm font-medium text-[color:var(--muted)] transition hover:text-[color:var(--text)]">
            <ImageIcon
              size={18}
              className="pointer-events-none text-[#27745f]"
            />
            Photo/video
            <input
              type="file"
              onChange={handleImage}
              accept="image/*,video/*"
              className="sr-only"
            />
          </label>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="secondary-button"
          >
            Cancel
            <X size={14} />
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="primary-button disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Saving..." : "Edit"}
            {!isSubmitting && <Send size={14} />}
          </button>
        </div>
      </div>
    </form>
  );
}
