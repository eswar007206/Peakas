import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET_NAME = "property-images";

interface UploadResult {
  url: string;
  path: string;
}

interface UseImageUploadReturn {
  uploadImages: (files: File[]) => Promise<string[]>;
  uploading: boolean;
  progress: number;
  error: string | null;
}

export const useImageUpload = (): UseImageUploadReturn => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const uploadImages = async (files: File[]): Promise<string[]> => {
    if (files.length === 0) return [];

    setUploading(true);
    setError(null);
    setProgress(0);

    const urls: string[] = [];
    const totalFiles = files.length;

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        // Create unique filename
        const fileExt = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `properties/${fileName}`;

        // Upload to Supabase Storage
        const { data, error: uploadError } = await supabase.storage
          .from(BUCKET_NAME)
          .upload(filePath, file, {
            cacheControl: "3600",
            upsert: false,
          });

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw new Error(`Failed to upload ${file.name}: ${uploadError.message}`);
        }

        // Get public URL
        const { data: urlData } = supabase.storage
          .from(BUCKET_NAME)
          .getPublicUrl(filePath);

        if (urlData?.publicUrl) {
          urls.push(urlData.publicUrl);
        }

        // Update progress
        setProgress(Math.round(((i + 1) / totalFiles) * 100));
      }

      return urls;
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to upload images";
      setError(message);
      console.error("Image upload error:", err);
      return urls; // Return any successfully uploaded URLs
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadImages,
    uploading,
    progress,
    error,
  };
};

// Helper to delete an image from storage
export const deleteImage = async (url: string): Promise<boolean> => {
  try {
    // Extract path from URL
    const urlParts = url.split(`${BUCKET_NAME}/`);
    if (urlParts.length < 2) return false;
    
    const path = urlParts[1];
    
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error("Delete error:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Delete image error:", err);
    return false;
  }
};
