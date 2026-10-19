export type FeedUser = {
  _id: string;
  name: string;
  username: string;
  photo: string;
};

export type FeedComment = {
  _id: string;
  content: string;
  image?: string;
  commentCreator: FeedUser;
  post: string;
  parentComment: string | null;
  likes: string[];
  createdAt: string;
};

export type FeedPost = {
  _id: string;
  id: string;
  body?: string;
  image?: string | null;
  privacy: string;
  user: FeedUser;
  sharedPost: string | null;
  likes: string[];
  createdAt: string;
  commentsCount: number;
  topComment: FeedComment | null;
  sharesCount: number;
  likesCount: number;
  isShare: boolean;
  bookmarked: boolean;
};
