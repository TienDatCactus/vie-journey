import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

@Injectable()
export class AssetsService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadImage(
    file: any,
    options?: { public_id?: string; folder?: string },
  ): Promise<UploadApiResponse> {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            resource_type: 'image',
            transformation: [
              { width: 1200, height: 800, crop: 'limit' },
              { quality: 'auto' },
            ],
            ...options, // ghi đè nếu có public_id truyền vào
          },
          (error, result) => {
            if (error) {
              reject(error);
            } else if (result) {
              resolve(result);
            } else {
              reject(new Error('Upload failed: No result returned'));
            }
          },
        )
        .end(file.buffer);
    });
  }

  async deleteImage(publicId: string): Promise<any> {
    return cloudinary.uploader.destroy(publicId);
  }

  getPublicIdFromUrl(url: string): string | null {
    // Ví dụ: https://res.cloudinary.com/.../users/123/IMAGE_BLOG/filename.jpg
    // public_id là phần sau '/upload/' và trước phần mở rộng
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.[a-zA-Z0-9]+$/);
    return matches ? matches[1] : null;
  }

  async uploadImageFromUrl(
    imageUrl: string,
    options?: { public_id?: string; folder?: string },
  ): Promise<UploadApiResponse> {
    try {
      const result = await cloudinary.uploader.upload(imageUrl, {
        resource_type: 'image',
        transformation: [
          { width: 1200, height: 800, crop: 'limit' },
          { quality: 'auto' },
        ],
        ...options, // chứa public_id nếu có
      });
      return result;
    } catch (error) {
      throw new Error(`Failed to upload image from URL: ${error.message}`);
    }
  }
}
