import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import crypto from 'crypto';
import path from 'path';

dotenv.config();

const s3 = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }
});

export const uploadFileToS3 = async (file) => {
    const ext = path.extname(file.originalname);
    const key = `${crypto.randomBytes(16).toString('hex')}${ext}`;

    const params = {
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        key: key,
        Body: file.buffer,
        ContentType: file.mimetype
    };

    await s3.send(new PutObjectCommand(params));
    return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
}