// src/lib/s3-service.ts
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

class S3Service {
    private client: S3Client;
    private bucket: string;

    constructor() {
        
        this.client = new S3Client({
            region : process.env.ES_AWS_REGION || 'us-east-1',
            credentials: {
                accessKeyId: process.env.ES_AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.ES_AWS_SECRET_ACCESS_KEY || '',
            },
        });
        this.bucket = process.env.ES_AWS_BUCKET_NAME || '';
    }

    async uploadFile(file: File | Blob, directory: string): Promise<string> {
        try {
            const extension = file instanceof File ? this.getFileExtension(file.name) : 'jpg';
            const filename = `${directory}/${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`;

            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: filename,
                Body: file,
                ContentType: file.type || 'application/octet-stream',
            });

            await this.client.send(command);
            const region = process.env.ES_AWS_REGION || 'us-east-1';
            return `https://${this.bucket}.s3.${region}.amazonaws.com/${filename}`;
        } catch (error) {
            console.error('Error uploading file to S3:', error);
            throw error;
        }
    }

    async uploadBuffer(buffer: Buffer, filename: string, directory: string): Promise<string> {
        try {
            const key = `${directory}/${filename}`;
            
            const command = new PutObjectCommand({
                Bucket: this.bucket,
                Key: key,
                Body: buffer,
                ContentType: 'image/webp', // Default to WebP for buffer uploads
            });

            await this.client.send(command);
            const region = process.env.ES_AWS_REGION || 'us-east-1';
            return `https://${this.bucket}.s3.${region}.amazonaws.com/${key}`;
        } catch (error) {
            console.error('Error uploading buffer to S3:', error);
            throw error;
        }
    }

    async deleteFile(url: string): Promise<void> {
        try {
            const key = this.getKeyFromUrl(url);
            const command = new DeleteObjectCommand({
                Bucket: this.bucket,
                Key: key,
            });
            await this.client.send(command);
        } catch (error) {
            console.error('Error deleting file from S3:', error);
            throw error;
        }
    }

    async deleteMultipleFiles(urls: string[]): Promise<void> {
        await Promise.all(urls.map(url => this.deleteFile(url)));
    }

    private getFileExtension(filename: string): string {
        return filename.split('.').pop()?.toLowerCase() || 'jpg';
    }

    private getKeyFromUrl(url: string): string {
        const urlObj = new URL(url);
        return urlObj.pathname.substring(1); // Remove leading slash
    }
}

export const s3Service = new S3Service();