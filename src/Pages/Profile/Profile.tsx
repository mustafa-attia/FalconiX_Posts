import { useContext, useEffect, useState } from "react";
import { Bookmark, Camera, ImageIcon, Mail, Sparkles, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import PostCard from "../../Components/Layout/PostCard/PostCard";
import { UserContext, type UserContextType } from "../../context/UserContext";
import { getFeed } from "../../services/feed.services";
import { getSavedBookmarkIds } from "../../services/post.services";
import { getMyProfile, updateProfilePhoto } from "../../services/profile.services";
import type { FeedPost } from "../../types/feed.type";

export default function Profile() {
  const userContext = useContext(UserContext) as UserContextType | null;
  const userDetails = userContext?.userDetails ?? null;
  const setUserDetails = userContext?.setUserDetails;
  const [activeTab, setActiveTab] = useState<"posts" | "saved">("posts");
  const [profilePosts, setProfilePosts] = useState<FeedPost[]>([]);
  const [savedPosts, setSavedPosts] = useState<FeedPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoError, setPhotoError] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  async function refreshProfileData() {
    if (!userDetails?._id) return;

    try {
      const { data } = await getFeed();
      const posts = Array.isArray(data?.posts) ? data.posts : [];
      setProfilePosts(posts.filter((post: FeedPost) => post.user._id === userDetails._id));
      setSavedPosts(posts.filter((post: FeedPost) => getSavedBookmarkIds().includes(post._id)));
    } catch (error) {
      console.error("Error fetching profile posts:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    setPhotoPreview(userDetails?.photo ?? null);
  }, [userDetails?.photo]);

  useEffect(() => {
    void refreshProfileData();
  }, [userDetails?._id]);

  function handlePhotoSelection(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Please choose an image under 5MB.");
      return;
    }

    setPhotoError("");
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handlePhotoSubmit() {
    if (!photoFile) {
      toast.error("Choose a profile photo before uploading.");
      return;
    }

    setIsUploading(true);

    try {
      await updateProfilePhoto(photoFile);
      const { data } = await getMyProfile();
      setUserDetails?.(data.user);
      toast.success("Profile photo updated successfully.");
      setPhotoFile(null);
      setPhotoPreview(data.user.photo ?? null);
      await refreshProfileData();
    } catch (error) {
      const message = error instanceof Error ? error.message : "Profile photo update is not available on the current backend.";
      toast.error(message);
      setPhotoError(message);
    } finally {
      setIsUploading(false);
    }
  }

  if (!userDetails) {
    return (
      <main className="mx-auto flex min-h-[50vh] w-full max-w-5xl items-center justify-center px-4 py-10">
        <div className="premium-card px-8 py-6 text-[color:var(--muted)]">
          Loading profile...
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-7 sm:px-6 sm:py-8 lg:px-8">
      <section className="premium-card overflow-hidden">
        <div className="h-36 bg-gradient-to-r from-[#dceae5] via-[#eaf1ed] to-[#e4eeea] sm:h-44" />

        <div className="px-4 pb-6 sm:px-6 lg:px-8">
          <div className="-mt-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={photoPreview || userDetails.photo || "https://placehold.co/200x200/0f172a/f8fafc?text=User"}
                  alt={userDetails.name}
                  className="size-24 rounded-full border-4 border-white object-cover shadow-sm sm:size-28"
                />
                <label className="absolute -bottom-2 -right-2 flex size-10 cursor-pointer items-center justify-center rounded-full border-2 border-white bg-[color:var(--primary)] text-white shadow-sm transition hover:bg-[#286057]">
                  <Camera size={16} />
                  <input type="file" accept="image/*" onChange={handlePhotoSelection} className="sr-only" />
                </label>
              </div>

              <div>
                <h1 className="text-2xl font-bold tracking-[-0.04em] text-[color:var(--text)] sm:text-3xl">{userDetails.name}</h1>
                <p className="text-sm text-[color:var(--muted)]">@{userDetails.username || "user"}</p>
              </div>
            </div>

            {photoFile && (
              <div className="flex flex-col items-start gap-2 md:items-end">
                <button
                  type="button"
                  onClick={handlePhotoSubmit}
                  disabled={isUploading}
                  className="primary-button"
                >
                  <Camera size={16} />
                  {isUploading ? "Uploading..." : "Save profile photo"}
                </button>
                {photoError && <p className="text-xs text-[#bd514b]">{photoError}</p>}
              </div>
            )}
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <div className="soft-panel p-5">
              <div className="flex items-center gap-2 text-sm font-semibold text-[#40534e]">
                <UserRound size={16} />
                About
              </div>
              <div className="mt-4 space-y-3.5 text-sm text-[#647773]">
                <div className="flex items-center gap-2">
                  <Mail size={16} className="text-[#82938e]" />
                  <span>{userDetails.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles size={16} className="text-[#82938e]" />
                  <span>{userDetails.gender || "Not specified"}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="soft-panel p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#82938e]">Posts</p>
                <p className="mt-2 text-2xl font-bold text-[color:var(--text)]">{profilePosts.length}</p>
              </div>
              <div className="soft-panel p-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#82938e]">Saved</p>
                <p className="mt-2 text-2xl font-bold text-[color:var(--text)]">{savedPosts.length}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="premium-card p-4 sm:p-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-1 rounded-2xl bg-[color:var(--panel)] p-1.5">
            <button
              type="button"
              onClick={() => setActiveTab("posts")}
              className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeTab === "posts" ? "bg-[color:var(--primary)] text-white shadow-sm" : "text-[#647773] hover:bg-white/70 hover:text-[color:var(--primary)]"}`}
            >
              <ImageIcon size={16} />
              My posts
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("saved")}
              className={`inline-flex min-h-10 items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${activeTab === "saved" ? "bg-[color:var(--primary)] text-white shadow-sm" : "text-[#647773] hover:bg-white/70 hover:text-[color:var(--primary)]"}`}
            >
              <Bookmark size={16} />
              Saved
            </button>
          </div>
        </div>

        <div className="mt-5">
          {loading ? (
            <div className="soft-panel p-5 text-sm text-[color:var(--muted)]">Loading your posts...</div>
          ) : activeTab === "posts" ? (
            profilePosts.length === 0 ? (
              <div className="empty-state">
                You have not posted anything yet.
              </div>
            ) : (
              <div className="space-y-4">
                {profilePosts.map((post) => (
                  <PostCard key={post._id} post={post} getPosts={refreshProfileData} />
                ))}
              </div>
            )
          ) : savedPosts.length === 0 ? (
            <div className="empty-state">
              You have no saved posts.
            </div>
          ) : (
            <div className="space-y-4">
              {savedPosts.map((post) => (
                <PostCard key={post._id} post={post} getPosts={refreshProfileData} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
