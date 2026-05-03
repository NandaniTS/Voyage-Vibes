import { apiClient } from '../api-client';

export interface UploadResponse {
  success: boolean;
  data: {
    files: string[];
    count: number;
  };
}

export interface UploadError {
  success: false;
  message: string;
}

export class UploadApi {
  async uploadImages(files: File[]): Promise<UploadResponse> {
    console.log('Upload API called with files:', files);
    const formData = new FormData();
    
    // Append all files to FormData with the same field name 'images'
    files.forEach(file => {
      console.log('Appending file:', file.name, file.type, file.size);
      formData.append('images', file);  
    });

    console.log('FormData entries:', formData);
    
    try {
      console.log('Making request to /upload/images');
      // Override the default Content-Type for FormData
      const response = await apiClient.post('/api/upload/images', formData, {
        headers: {
          'Content-Type': undefined, // Let axios set the correct multipart boundary
        },
      });

      console.log('Upload API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Upload API error:', error);
      console.error('Error response:', error.response?.data);
      throw new Error(error.response?.data?.message || 'Upload failed');
    }
  }

  async deleteFile(filename: string): Promise<void> {
    try {
      await apiClient.delete(`/upload/${filename}`);
    } catch (error: any) {
      console.error('Delete error:', error);
      throw new Error(error.response?.data?.message || 'Delete failed');
    }
  }
}

export const uploadApi = new UploadApi();
