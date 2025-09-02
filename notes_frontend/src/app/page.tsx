"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { Button } from "@/components/ui";

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.replace("/notes");
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen bg-white">
      <div className="mx-auto max-w-5xl px-6 py-24 text-center">
        <h1 className="text-4xl font-light text-gray-900">Capture ideas. Stay organized.</h1>
        <p className="mt-4 text-gray-600">
          A simple, modern notes app. Create, edit, and search your notes in a clean interface.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Link href="/register">
            <Button>Get Started</Button>
          </Link>
          <Link href="/login">
            <Button variant="ghost">I already have an account</Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
