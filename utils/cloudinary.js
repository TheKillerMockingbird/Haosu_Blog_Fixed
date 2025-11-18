import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadToCloudinary(filePath) {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: "blog_uploads"
    });
    return result.secure_url;   // This is the URL you save in MongoDB
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    throw err;
  }
}
