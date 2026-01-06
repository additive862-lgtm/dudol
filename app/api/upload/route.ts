import { NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: Request) {
    try {
        const data = await request.formData();
        const file: File | null = data.get('file') as unknown as File;

        if (!file) {
            return NextResponse.json(
                { error: 'No file uploaded' },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Determine sub-directory based on file type
        const isImage = file.type.startsWith('image/');
        const subDir = isImage ? 'images' : 'files';

        // Create unique filename
        const timestamp = Date.now();
        const uniqueId = crypto.randomUUID().split('-')[0];
        const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filename = `${timestamp}-${uniqueId}-${safeName}`;

        // Ensure upload directory exists
        const uploadDir = join(process.cwd(), 'public', 'uploads', subDir);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Save file
        const filePath = join(uploadDir, filename);
        await writeFile(filePath, buffer);

        // Return public URL
        const fileUrl = `/uploads/${subDir}/${filename}`;

        return NextResponse.json({
            message: 'File uploaded successfully',
            url: fileUrl,
            filename: filename,
            originalName: file.name,
            type: isImage ? 'IMAGE' : 'FILE'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Upload failed' },
            { status: 500 }
        );
    }
}
