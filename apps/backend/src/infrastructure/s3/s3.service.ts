import { Injectable } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { FileStorageService } from '../../application/ports/file-storage.service';

@Injectable()
export class S3Service implements FileStorageService {
    private s3Client: S3Client;
    private readonly bucketName = process.env.AWS_BUCKET_NAME || 'godtier-bucket';

    constructor() {
        this.s3Client = new S3Client({
            region: process.env.AWS_REGION,
            endpoint: process.env.AWS_ENDPOINT,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
            },
            forcePathStyle: true, // Needed for some S3 compatible storages like MinIO
        });
    }

    async upload(fileName: string, content: Buffer, mimeType: string): Promise<string> {
        await this.s3Client.send(
            new PutObjectCommand({
                Bucket: this.bucketName,
                Key: fileName,
                Body: content,
                ContentType: mimeType,
            }),
        );
        return fileName;
    }

    getClient() {
        return this.s3Client;
    }
}
