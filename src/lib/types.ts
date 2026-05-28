export interface PhotoMetadata {
  id: string;         // Cloudinary public_id
  url: string;        // secure_url
  width: number;
  height: number;
  timestamp: string;
  uploaderName?: string;
  aspectRatio?: number;
}
