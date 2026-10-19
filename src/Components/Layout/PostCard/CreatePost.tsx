import { ImageIcon, Send, X } from "lucide-react";
import { useContext, useEffect, useState, type FormEvent } from "react";
import { CreatePostAPI } from "../../../services/post.services";
import { Spinner } from "@heroui/react";
import { UserContext, type UserContextType } from "../../../context/UserContext";
import toast from "react-hot-toast";
import { getErrorMessage } from "../../../utils/errorMessage";

export default function CreatePost({getPosts} :{getPosts:()=> void}) {
  const [content, setContent] = useState<string>("");

  const [image, setImage] = useState<File | null>(null);

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const userContext = useContext(UserContext) as UserContextType | null;
  const userDetails = userContext?.userDetails ?? null;

  useEffect(() => () => {
    if (imagePreview?.startsWith("blob:")) URL.revokeObjectURL(imagePreview);
  }, [imagePreview]);

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmedContent = content.trim();

    if ((!trimmedContent && !image) || isLoading) return;

    const formData = new FormData();

    try {
      setIsLoading(true);
      if (trimmedContent) {
        formData.append("body", trimmedContent);
      }
      if (image) {
        formData.append("image", image);
      }

      await CreatePostAPI(formData);

      // console.log(data);

      setContent("");
      handleClosePreview();
      getPosts()
      toast.success("Post created successfully.");
    } catch (error) {
      // console.log(error);
      toast.error(getErrorMessage(error, "Unable to create your post. Please try again."));
    } finally {
      setIsLoading(false);
    }
  }

  function handleClosePreview() {
    setImage(null);
    setImagePreview(null);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="premium-card w-full p-4 sm:p-5"
    >
      <header className="mb-4 flex items-center gap-3">
        <img
          alt={userDetails?.name ?? "User avatar"}
          className="size-10 shrink-0 rounded-full object-cover ring-2 ring-[color:var(--accent-soft)]"
          src={userDetails?.photo || "https://placehold.co/120x120/20272b/f5f1eb?text=U"}
        />
        <div className="min-w-0">
          <p className="text-sm font-bold capitalize text-[color:var(--text)]">
            {userDetails?.name || "Your profile"}
          </p>
          <p className="text-xs text-[color:var(--muted)]">Share an update with your network</p>
        </div>
      </header>

      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={`What's on your mind, ${userDetails?.name?.split(" ")[0] || "friend"}?`}
        rows={4}
        className="field-shell min-h-28 resize-none text-sm leading-6"
      />

      {imagePreview && (
        <div className="relative mt-3 overflow-hidden rounded-[18px] border border-[color:var(--line)] bg-[color:var(--panel)]">
          <button
            type="button"
            aria-label="Remove image"
            className="absolute right-3 top-3 grid size-8 place-items-center rounded-full bg-white/95 text-[color:var(--text)] shadow-sm"
            onClick={handleClosePreview}
          >
            <X size={16} />
          </button>
          <img
            src={imagePreview}
            alt="Selected post image"
            className="max-h-72 w-full object-cover"
          />
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[color:var(--line)] pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <label className="flex cursor-pointer items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--panel)] px-3 py-2 text-sm font-medium text-[#544d58] transition hover:bg-[#efefec] hover:text-[color:var(--text)]">
            <ImageIcon size={17} className="text-[#27745f]" />
            Media
            <input
              type="file"
              accept="image/*,video/*"
              className="sr-only"
              onChange={handleImage}
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || (!content.trim() && !image)}
          className="primary-button disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isLoading ? <Spinner size="sm" className="text-white" /> : "Create Post"}
          {!isLoading && <Send size={14} />}
        </button>
      </div>
    </form>
  );
}
