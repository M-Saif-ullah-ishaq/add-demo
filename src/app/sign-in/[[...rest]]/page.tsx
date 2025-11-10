"use client";

import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: "#1f2937", // dark gray background
        padding: "20px",
      }}
    >
      <div
        style={{
          padding: "40px",
          backgroundColor: "#111827", // dark card background
          borderRadius: "12px",
          boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
          width: "100%",
          maxWidth: "400px",
          color: "white", // text color inside card
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "bold",
            marginBottom: "24px",
            textAlign: "center",
            color: "white",
          }}
        >
          Sign In
        </h1>
        <div style={{ color: "white" }}>
          <SignIn routing="path" path="/sign-in" signUpUrl="/sign-up" />
        </div>
      </div>
    </div>
  );
}
