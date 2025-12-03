import connectDB from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import fs from "fs";

// Ensure DB is connected
async function ensureDB() {
  try {
    await connectDB();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

// GET — fetch one or all blogs
export async function GET(request) {
  await ensureDB();

  const blogId = request.nextUrl.searchParams.get("id");

  try {
    if (blogId) {
      const blog = await BlogModel.findById(blogId);
      if (!blog) {
        return NextResponse.json({ error: "Blog not found" }, { status: 404 });
      }
      return NextResponse.json(blog);
    } else {
      const blogs = await BlogModel.find({});
      return NextResponse.json({ blogs });
    }
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json(
      { error: "Failed to fetch blog(s)" },
      { status: 500 }
    );
  }
}

// POST — Upload image to Cloudinary + Save Blog
export async function POST(request) {
  await ensureDB();

  try {
    const formData = await request.formData();

    // Grab the image from formData
    const imageFile = formData.get("image");
    let imageUrl = null;

    if (imageFile) {
      // Convert uploaded image to buffer
      const arrayBuffer = await imageFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Upload to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "blog_uploads" }, // optional folder name
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });

      imageUrl = uploadResult.secure_url;
    }

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      authorImg: formData.get("authorImg"),
      image: imageUrl,
    };

    await BlogModel.create(blogData);

    return NextResponse.json({ success: true, msg: "Blog Added" });

  } catch (error) {
    console.error("❌ POST /api/blog error:", error);
    return NextResponse.json(
      { success: false, msg: "Failed to add blog" },
      { status: 500 }
    );
  }
}

// DELETE — Remove blog + delete image file (only if stored locally)
export async function DELETE(request) {
  await ensureDB();

  try {
    const id = request.nextUrl.searchParams.get("id");
    const blog = await BlogModel.findById(id);

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    // NOTE: This will do nothing for Cloudinary URLs (good)
    if (blog.image && blog.image.startsWith("/")) {
      fs.unlink(`./public${blog.image}`, () => {});
    }

    await BlogModel.findByIdAndDelete(id);

    return NextResponse.json({ msg: "Blog Deleted" });

  } catch (error) {
    console.error("DELETE /api/blog error:", error);
    return NextResponse.json(
      { error: "Failed to delete blog" },
      { status: 500 }
    );
  }
}
