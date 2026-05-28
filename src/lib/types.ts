export interface PhotoMetadata {
  id: string;
  url: string;
  width: number;
  height: number;
  timestamp: string;
  uploaderName?: string;
  aspectRatio?: number;
}
