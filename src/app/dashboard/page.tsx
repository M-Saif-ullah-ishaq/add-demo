//

"use client";

import { useUser, SignOutButton, SignedIn, SignedOut } from "@clerk/nextjs";
import Link from "next/link";
import { useEffect, useState } from "react";
import CreatePostButton from "./create-post/CreatePostButton";
import Image from "next/image";

type Post = {
  id: number;
  title: string;
  content: string;
  imageUrl: string;
  createdAt: string;
};

export default function Dashboard() {
  const { user } = useUser();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPosts() {
      try {
        const res = await fetch("/api/posts");
        const data: Post[] = await res.json();
        setPosts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  const handleDelete = async (postId: number, postTitle: string) => {
    const input = prompt(`To delete this post, type the title: "${postTitle}"`);
    if (input !== postTitle) {
      alert("Title did not match. Post was not deleted.");
      return;
    }

    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete post");
      setPosts(posts.filter((post) => post.id !== postId));
    } catch (err) {
      alert(err instanceof Error ? err.message : "Error deleting post");
    }
  };

  const email = user?.emailAddresses[0]?.emailAddress;

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#1f2937",
        color: "white",
        padding: "20px",
        fontFamily: "Arial, sans-serif",
      }}
    >
      <SignedIn>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "40px",
          }}
        >
          <h1 style={{ fontSize: "28px", fontWeight: "bold" }}>
            Welcome, {user?.fullName || email}
          </h1>
          <div style={{ display: "flex", gap: "10px" }}>
            <CreatePostButton />
            <SignOutButton>
              <button
                style={{
                  padding: "8px 16px",
                  backgroundColor: "#dc2626",
                  border: "none",
                  borderRadius: "6px",
                  color: "white",
                  cursor: "pointer",
                }}
              >
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </div>

        {/* Posts Section */}
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <h2
            style={{
              fontSize: "22px",
              fontWeight: "600",
              marginBottom: "20px",
              borderBottom: "2px solid #374151",
              paddingBottom: "5px",
            }}
          >
            Posts
          </h2>

          {loading ? (
            <p style={{ color: "#9ca3af" }}>Loading posts...</p>
          ) : posts.length === 0 ? (
            <p style={{ color: "#9ca3af" }}>No posts yet.</p>
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "20px",
                justifyContent: "center",
              }}
            >
              {posts.map((post) => (
                <div
                  key={post.id}
                  style={{
                    backgroundColor: "#111827",
                    padding: "20px",
                    borderRadius: "10px",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.3)",
                    width: "300px",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  {/* IMAGE SECTION */}
                  {post.imageUrl && (
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      width={300}
                      height={180}
                      style={{
                        objectFit: "cover",
                        borderRadius: "8px",
                        marginBottom: "10px",
                      }}
                    />
                  )}

                  <h3
                    style={{
                      fontSize: "18px",
                      fontWeight: "bold",
                      marginBottom: "10px",
                      textAlign: "center",
                    }}
                  >
                    {post.title}
                  </h3>
                  <p
                    style={{
                      marginBottom: "10px",
                      color: "#d1d5db",
                      textAlign: "center",
                    }}
                  >
                    {post.content}
                  </p>
                  <span style={{ color: "#9ca3af", fontSize: "12px" }}>
                    {new Date(post.createdAt).toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleDelete(post.id, post.title)}
                    style={{
                      marginTop: "15px",
                      padding: "8px 12px",
                      backgroundColor: "#b91c1c",
                      color: "white",
                      border: "none",
                      borderRadius: "6px",
                      cursor: "pointer",
                    }}
                  >
                    Delete Post
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </SignedIn>

      <SignedOut>
        <div style={{ textAlign: "center", marginTop: "100px" }}>
          <p style={{ color: "#9ca3af", marginBottom: "20px" }}>
            You are not signed in.
          </p>
          <Link href="/sign-in">
            <button
              style={{
                padding: "10px 20px",
                backgroundColor: "#2563eb",
                border: "none",
                borderRadius: "6px",
                color: "white",
                cursor: "pointer",
              }}
            >
              Go to Sign In
            </button>
          </Link>
        </div>
      </SignedOut>
    </div>
  );
}
