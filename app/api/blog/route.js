import connectDB from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server";
import fs from "fs"; // ✅ Use ES module import instead of require (Next.js prefers this)

// ✅ Connect to MongoDB inside each request handler (not at file load time)
async function ensureDB() {
  try {
    await connectDB();
  } catch (error) {
    console.error("❌ Database connection failed:", error);
  }
}

// ✅ GET — fetch single blog or all blogs
export async function GET(request) {
  await ensureDB(); // <-- ensures DB is ready each time

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
      console.log("✅ API fetched blogs:", blogs);
      return NextResponse.json({ blogs });
    }
  } catch (error) {
    console.error("GET /api/blog error:", error);
    return NextResponse.json({ error: "Failed to fetch blog(s)" }, { status: 500 });
  }
}

// ✅ POST — upload and save new blog
export async function POST(request) {
  await ensureDB(); // <-- connect before writing

  try {
    const formData = await request.formData();
    const timestamp = Date.now();

    const image = formData.get("image");
    const imageByteData = await image.arrayBuffer();
    const buffer = Buffer.from(imageByteData);
    const path = `./public/${timestamp}_${image.name}`;
    await writeFile(path, buffer);
    const imgUrl = `/${timestamp}_${image.name}`;

    const blogData = {
      title: formData.get("title"),
      description: formData.get("description"),
      category: formData.get("category"),
      author: formData.get("author"),
      image: imgUrl,
      authorImg: formData.get("authorImg"),
    };

    await BlogModel.create(blogData);
    console.log("✅ Blog Saved");

    return NextResponse.json({ success: true, msg: "Blog Added" });
  } catch (error) {
    console.error("POST /api/blog error:", error);
    return NextResponse.json(
      { success: false, msg: "Failed to add blog" },
      { status: 500 }
    );
  }
}

// ✅ DELETE — remove blog by ID and delete its image file
export async function DELETE(request) {
  await ensureDB(); // <-- connect before deleting

  try {
    const id = request.nextUrl.searchParams.get("id");
    const blog = await BlogModel.findById(id);
    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 });
    }

    fs.unlink(`./public${blog.image}`, () => {});
    await BlogModel.findByIdAndDelete(id);

    return NextResponse.json({ msg: "Blog Deleted" });
  } catch (error) {
    console.error("DELETE /api/blog error:", error);
    return NextResponse.json({ error: "Failed to delete blog" }, { status: 500 });
  }
}
