import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <section className="border rounded-lg p-8 bg-white text-center" role="alert" aria-live="assertive" style={{ borderColor: "#eee" }}>
        <h1 className="text-2xl font-medium text-gray-900">404 – Page Not Found</h1>
        <p className="text-gray-600 mt-2">The page you’re looking for doesn’t exist.</p>
        <Link href="/" className="inline-block mt-6 underline">
          Go back home
        </Link>
      </section>
    </main>
  );
}
