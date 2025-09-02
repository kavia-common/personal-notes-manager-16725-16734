"use client";

import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
};

export default function RequireAuth({ children }: Props) {
  const { user, loading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!loading && !user) {
      router.replace("/login");
    }
  }, [loading, user, router]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <p className="text-sm text-gray-600">Checking authentication...</p>
      </div>
    );
  }

  if (!user) return null;

  return <>{children}</>;
}
