"use client";

import React, { useState } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button, Input } from "@/components/ui";

export default function RegisterPage() {
  const { register, error, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (user) router.replace("/notes");
  }, [user, router]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await register(email, password, name);
      router.replace("/notes");
    } catch {
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md border rounded-lg p-6 bg-white" style={{ borderColor: "#eee" }}>
        <h1 className="text-xl font-medium text-gray-900">Create your account</h1>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-1">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm text-gray-700 mb-1">Password</label>
            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create account"}</Button>
        </form>

        <p className="text-sm text-gray-600 mt-6">
          Already have an account? <Link href="/login" className="underline">Login</Link>
        </p>
      </div>
    </main>
  );
}
