export interface FileStorageService {
    upload(fileName: string, content: Buffer, mimeType: string): Promise<string>;
}
