"use client";

import Link from "next/link";

export default function CreatePostButton() {
  return (
    <Link href="/dashboard/create-post">
      <button
        style={{
          padding: "10px 20px",
          backgroundColor: "#2563eb",
          color: "white",
          fontWeight: "bold",
          fontSize: "16px",
          borderRadius: "6px",
          border: "none",
          cursor: "pointer",
          transition: "all 0.3s ease",
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#1e40af")}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#2563eb")}
      >
        Create New Post
      </button>
    </Link>
  );
}
