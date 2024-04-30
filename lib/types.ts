export type videoFormat = 'hrs' | 'min' | 'sec';

export type videoSpeed = '0.25' | '0.5' | '0.75' | '1' | '1.25' | '1.5' | '1.75' | '2';

export interface PlaylistItemListResponse {
  kind: string;
  etag: string;
  items: Item[];
  pageInfo: PageInfo;
}

interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

interface Thumbnails {
  default: Thumbnail;
  medium: Thumbnail;
  high: Thumbnail;
  standard: Thumbnail;
  maxres: Thumbnail;
}

interface ResourceId {
  kind: string;
  videoId: string;
}

interface Snippet {
  publishedAt: string;
  channelId: string;
  title: string;
  description: string;
  thumbnails: Thumbnails;
  channelTitle: string;
  playlistId: string;
  position: number;
  resourceId: ResourceId;
  videoOwnerChannelTitle: string;
  videoOwnerChannelId: string;
}

interface ContentDetails {
  videoId: string;
  videoPublishedAt: string;
}

interface Status {
  privacyStatus: string;
}

interface Item {
  kind: string;
  etag: string;
  id: string;
  snippet: Snippet;
  contentDetails: ContentDetails;
  status: Status;
  videoTitle: string;
  videoThumbnail: string;
  videoDuration: string;
  index: number
}

interface PageInfo {
  totalResults: number;
  resultsPerPage: number;
}