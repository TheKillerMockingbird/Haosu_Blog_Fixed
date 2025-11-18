import connectDB from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// 🔧 Cloudinary Config (reads from Vercel env vars)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Ensure Database Connection
async function ensureDB() {
  try {
    await connectDB();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

// --------------------- GET ---------------------
export async function GET(request) {
  await ensureDB();

  const blogId = request.nextUrl.searchParams.get("id");

  try {
    if (blogId) {
      const blog = await BlogModel.findById(blogId);
      if (!blog) return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      return NextResponse.json(blog);
    } else {
      const blogs = await BlogModel.find({});
      return NextResponse.json({ blogs });
    }
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json({ error: "Failed to fetch blog(s)" }, { status: 500 });
  }
}

// --------------------- POST ---------------------
export async function POST(request) {
  await ensureDB();

  try {
    const formData = await request.formData();

    // 1. Get uploaded image
    const image = formData.get("image");
    let cloudinaryUrl = "";

    if (image) {
      const arrayBuffer = await image.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary
      const uploadRes = await cloudinary.uploader.upload_stream(
        { folder: "haosu_blog" },
        (error, result) => {
          if (error) console.error("Cloudinary Upload Error:", error);
        }
      );

      // Convert Buffer to stream
      await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "haosu_blog" },
          (error, result) => {
            if (error) reject(error);
            else {
              cloudinaryUrl = result.secure_url;
              resolve(result);
            }
          }
        );
        stream.end(buffer);
      });
    }

    // 2. Build database object
    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: cloudinaryUrl, // <-- Cloudinary URL instead of local file
      authorImg: formData.get("authorImg"),
    };

    await BlogModel.create(blogData);

    return NextResponse.json({ success: true, msg: "Blog Added" });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json({ success: false, msg: "Failed to add blog" }, { status: 500 });
  }
}

// --------------------- DELETE ---------------------
export async function DELETE(request) {
  await ensureDB();

  try {
    const id = request.nextUrl.searchParams.get("id");
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // Try to delete from Cloudinary (ignores failure)
    try {
      const publicId = blog.image.split("/").pop().split(".")[0];
      await cloudinary.uploader.destroy(`haosu_blog/${publicId}`);
    } catch (cloudErr) {
      console.warn("Cloudinary delete skipped:", cloudErr);
    }

    await BlogModel.findByIdAndDelete(id);

    return NextResponse.json({ msg: "Blog Deleted" });
  } catch (error) {
    console.error("DELETE /api/blog error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
