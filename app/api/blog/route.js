import { ConnectDB } from "@/lib/config/db";
import BlogModel from "@/lib/models/BlogModel";
import { writeFile } from "fs/promises";
import { NextResponse } from "next/server"; // ✅ Import this directly (no require)
const fs = require('fs')

// Connect to DB on load
const LoadDB = async () => {
  await ConnectDB();
};
LoadDB();

// ✅ GET — fetch single blog or all blogs
export async function GET(request) {
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
    return NextResponse.json({ error: "Failed to fetch blog(s)" }, { status: 500 });
  }
}

// ✅ POST — upload and save new blog
export async function POST(request) {
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
    return NextResponse.json({ success: false, msg: "Failed to add blog" }, { status: 500 });
  }
}

// Creating API endpoint to delete blog

export async function DELETE(request){
    const id = await request.nextUrl.searchParams.get('id');
    const blog = await BlogModel.findById(id);
    fs.unlink(`./public${blog.image}`,()=>{});
    await BlogModel.findByIdAndDelete(id);
    return NextResponse.json({msg:"Blog Deleted"})
}