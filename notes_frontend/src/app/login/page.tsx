"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const { login, error, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("demo@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) router.replace("/notes");
  }, [user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      router.replace("/notes");
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-lg p-6 bg-white" style={{ borderColor: "#eee" }}>
        <h1 className="text-xl font-medium text-gray-900">Welcome back</h1>
        <p className="text-sm text-gray-600 mt-1">Sign in to your account</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</Button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          New here? <Link href="/register" className="underline">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
