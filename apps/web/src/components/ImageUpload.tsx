"use client";

import React, { useState, useRef } from "react";
import { Button } from "@heroui/react";
import { FaCamera, FaTrash } from "react-icons/fa";
import toast from "react-hot-toast";
import { uploadApi } from "@repo/frontend-sdk";

interface ImageUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  images,
  onChange,
  maxImages = 5,
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB per image
    const validFiles: File[] = [];

    // Validate files
    for (const file of Array.from(files)) {
      if (!file.type.startsWith("image/")) {
        toast.error(`File ${file.name} is not an image`);
        continue;
      }

      if (file.size > MAX_FILE_SIZE) {
        toast.error(`Image ${file.name} is too large. Maximum size is 5MB per image.`);
        continue;
      }

      validFiles.push(file);
    }

    if (validFiles.length === 0) {
      return;
    }

    if (images.length + validFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    // console.log('Starting upload with files:', validFiles);
    setUploading(true);
    try {
      const response = await uploadApi.uploadImages(validFiles);
      // console.log('Upload response:', response);
      
      if (response.success) {
        const updatedImages = [...images, ...response.data.files];
        onChange(updatedImages);
        toast.success(`Successfully uploaded ${response.data.count} image(s)`);
      } else {
        // console.log('Upload failed:', response);
        toast.error('Upload failed');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      toast.error(error.message || 'Failed to upload images');
    } finally {
      setUploading(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    onChange(updatedImages);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`space-y-4 ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
      
      {/* Upload Button */}
      {images.length < maxImages && (
        <Button
          onPress={triggerFileInput}
          variant="bordered"
          className="border border-(--border) rounded-lg flex items-center gap-2 w-full"
          startContent={<FaCamera size={16} />}
          isLoading={uploading}
          isDisabled={uploading}
        >
          {uploading ? 'Uploading...' : `Upload Images (${images.length}/${maxImages})`}
        </Button>
      )}

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={`http://localhost:4001${image}`}
                alt={`Upload ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-(--border)"
              />
              <Button
                isIconOnly
                size="sm"
                variant="light"
                color="danger"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onPress={() => removeImage(index)}
              >
                <FaTrash size={12} />
              </Button>
            </div>
          ))}
        </div>
      )}

      {images.length === 0 && (
        <div className="border-2 border-dashed border-(--border) rounded-lg p-8 text-center">
          <FaCamera size={32} className="mx-auto mb-2 text-(--muted-foreground)" />
          <p className="text-(--muted-foreground) text-sm">
            No images uploaded yet. Click the button above to add images.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
