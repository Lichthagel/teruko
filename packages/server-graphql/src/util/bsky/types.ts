// based on https://github.com/bluesky-social/atproto/blob/main/lexicons/app/bsky/feed/defs.json

export type Author = {
  did: string;
  handle: string;
  displayName?: string;
  avatar?: string;
  associated?: unknown;
  viewer?: unknown;
  labels?: unknown[];
  createdAt?: string;
};

export type Image = {
  thumb: string;
  fullsize: string;
  alt: string;
  aspectRatio?: unknown;
};

export type ImagesEmbed = {
  images: Image[];
};

export type VideoEmbed = {
  cid: string;
  playlist: string;
  thumbnail?: string;
  alt?: string;
  aspectRatio?: unknown;
};

export type ExternalEmbed = {
  external: unknown;
};

export type RecordEmbed = {
  record: unknown;
};

export type RecordWithMediaEmbed = {
  record: RecordEmbed;
  media: ExternalEmbed | ImagesEmbed | VideoEmbed;
};

export type Embed = ExternalEmbed | ImagesEmbed | RecordEmbed | RecordWithMediaEmbed | VideoEmbed;

export type Post = {
  uri: string;
  cid: string;
  author: Author;
  record: unknown;
  embed?: Embed;
  replyCount?: number;
  repostCount?: number;
  likeCount?: number;
  quoteCount?: number;
  indexedAt: string;
  viewer?: unknown;
  labels?: unknown[];
  threadgate?: unknown;
};

export type ThreadPost = {
  post: Post;
  parent: unknown;
  replies: unknown[];
};

export type NotFoundPost = {
  uri: string;
  notFound: true;
};

export type BlockedPost = {
  uri: string;
  blocked: true;
  author: unknown;
};

export type GetPostThreadResponse = {
  thread: BlockedPost | NotFoundPost | ThreadPost;
};
