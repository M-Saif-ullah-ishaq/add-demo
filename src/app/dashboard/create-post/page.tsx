"use client";

import { useUser, SignedIn, SignedOut } from "@clerk/nextjs";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
  const { user } = useUser();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, content }),
      });

      // 🧩 handle non-JSON responses safely
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("❌ Not JSON:", text);
        throw new Error("Server returned invalid JSON (likely crashed).");
      }

      if (!res.ok) {
        throw new Error(data?.error || "Failed to create post");
      }

      setTitle("");
      setContent("");
      router.push("/dashboard");
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "An unexpected error occurred"
      );
    } finally {
      setLoading(false);
    }
  };

  // Optional — Preview AI-generated image (client-side mock)
  const handlePreview = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/generate-image", {
        // optional endpoint if you later add it
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: content }),
      });
      const data = await res.json();
      setImagePreview(data.url);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#1f2937",
        color: "white",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <SignedIn>
        <div
          style={{
            width: "100%",
            maxWidth: "450px",
            backgroundColor: "#111827",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 6px 12px rgba(0,0,0,0.4)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h1
            style={{
              fontSize: "26px",
              fontWeight: "bold",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Create Post
          </h1>

          {error && (
            <p
              style={{
                color: "#f87171",
                marginBottom: "15px",
                textAlign: "center",
              }}
            >
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit}
            style={{ display: "flex", flexDirection: "column", gap: "15px" }}
          >
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #374151",
                backgroundColor: "#1f2937",
                color: "white",
                fontSize: "16px",
              }}
            />

            <textarea
              placeholder="Content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              rows={5}
              style={{
                padding: "10px",
                borderRadius: "6px",
                border: "1px solid #374151",
                backgroundColor: "#1f2937",
                color: "white",
                fontSize: "16px",
              }}
            />

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                style={{
                  width: "100%",
                  borderRadius: "6px",
                  marginTop: "10px",
                }}
              />
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px",
                borderRadius: "6px",
                border: "none",
                backgroundColor: "#2563eb",
                color: "white",
                fontWeight: "bold",
                fontSize: "16px",
                cursor: "pointer",
                transition: "background-color 0.3s",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1e40af")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#2563eb")
              }
            >
              {loading ? "Saving..." : "Create Post"}
            </button>
          </form>
        </div>
      </SignedIn>

      <SignedOut>
        <div style={{ textAlign: "center" }}>
          <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
            You must be signed in to create a post.
          </p>
        </div>
      </SignedOut>
    </div>
  );
}
