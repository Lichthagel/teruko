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

export type ExternalEmbed = {
  external: unknown;
};

export type FacetTag = {
  $type: "app.bsky.richtext.facet#tag";
  tag: string;
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

export type RecordEmbed = {
  record: unknown;
};

export type RecordWithMediaEmbed = {
  record: RecordEmbed;
  media: ExternalEmbed | ImagesEmbed | VideoEmbed;
};

export type VideoEmbed = {
  cid: string;
  playlist: string;
  thumbnail?: string;
  alt?: string;
  aspectRatio?: unknown;
};

export const isFacetTag
  = (facetFeature: unknown): facetFeature is FacetTag =>
    typeof facetFeature === "object"
    && facetFeature !== null
    && "$type" in facetFeature
    && facetFeature.$type === "app.bsky.richtext.facet#tag";

export type BlockedPost = {
  uri: string;
  blocked: true;
  author: unknown;
};

export type Embed = ExternalEmbed | ImagesEmbed | RecordEmbed | RecordWithMediaEmbed | VideoEmbed;

export type Facet = {
  features: (FacetTag | { $type: string; [k: string]: unknown })[];
  index: { byteEnd: number; byteStart: number };
};

export type GetPostThreadResponse = {
  thread: BlockedPost | NotFoundPost | ThreadPost;
};

export type NotFoundPost = {
  uri: string;
  notFound: true;
};

export type Post = {
  uri: string;
  cid: string;
  author: Author;
  record: PostRecord;
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

export type PostRecord = {
  $type: "app.bsky.feed.post";
  createdAt: string;
  embed?: unknown;
  facets?: Facet[];
  langs?: unknown[];
  text?: string;
};

export type ThreadPost = {
  post: Post;
  parent: unknown;
  replies: unknown[];
};
