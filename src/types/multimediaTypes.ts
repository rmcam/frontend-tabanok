export interface Multimedia {
  id: string;
  title: string;
  description: string;
  type: string; // e.g., 'image', 'video', 'audio'
  url: string;
  metadata: MultimediaMetadata;
}

export interface MultimediaMetadata {
  [key: string]: unknown;
}
