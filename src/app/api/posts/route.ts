// src/app/api/posts/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@/lib/generated/prisma";
import OpenAI from "openai";

// Initialize Prisma
const prisma = new PrismaClient();

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

export async function POST(req: NextRequest) {
  try {
    const { title, content } = await req.json();

    if (!title || !content) {
      return NextResponse.json(
        { error: "Title and content are required" },
        { status: 400 }
      );
    }
    let imageUrl = null;
    // ✅ Generate an AI image based on content
    try {
      const aiResponse = await openai.images.generate({
        model: "gpt-image-1",
        prompt: content,
        size: "1024x1024",
      });
      imageUrl = aiResponse.data?.[0]?.url ?? null;
    } catch (error) {
      console.error("AI image generation failed:", error);
      // fallback to a placeholder
      imageUrl = "https://via.placeholder.com/1024x1024?text=Ad+Image";
    }
    // ✅ Save post in database
    const post = await prisma.post.create({
      data: {
        title,
        content,
        imageUrl, // must exist in Prisma schema
      },
    });

    return NextResponse.json(post, { status: 201 });
  } catch (err: unknown) {
    console.error("POST /api/posts error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (err: unknown) {
    console.error("GET /api/posts error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 }
    );
  }
}
