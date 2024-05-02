import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import { v4 as uuidv4 } from 'uuid';

const generateFileName = () => uuidv4();

const s3Client = new S3Client({
    region: import.meta.env.VITE_AWS_BUCKET_REGION!,
    credentials: {
        accessKeyId: import.meta.env.VITE_AWS_ACCESS_KEY!,
        secretAccessKey: import.meta.env.VITE_AWS_SECRET_ACCESS_KEY!,
    }
});

const acceptedTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "video/mp4",
    "video/webm",
]

const maxFileSize = 1024 * 1024 * 10; // 10MB

export async function getSignedURL(type: string, size: number, checksum: string) {
    
    if(!acceptedTypes.includes(type)) {
        return {error: {message: "Invalid file type"}}
    }
    if(size > maxFileSize) {
        return {error: {message: "File size too large"}}
    }
    
    const putObjectCommand = new PutObjectCommand({
        Bucket: import.meta.env.VITE_AWS_BUCKET_NAME!,
        Key: generateFileName(),
        ContentType: type,
        ContentLength: size,
        ChecksumSHA256: checksum,

    });
    const signedURL = await getSignedUrl(s3Client, putObjectCommand, { expiresIn: 60 });


    return {success: {url: signedURL}}
}