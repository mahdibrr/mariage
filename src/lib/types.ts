export interface PhotoMetadata {
  id: string;
  key: string;
  url: string;
  width: number;
  height: number;
  timestamp: string;
  uploaderName?: string;
  aspectRatio?: number;
}
