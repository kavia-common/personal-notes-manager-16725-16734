"use client";

import React from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth";

const colors = {
  primary: "#1976D2",
  secondary: "#424242",
  accent: "#FFC107",
};

export function classNames(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

// PUBLIC_INTERFACE
export function TopNav({ onSearch }: { onSearch?: (q: string) => void }) {
  /** Top navigation bar with brand, search, and user menu. */
  const { user, logout } = useAuth();
  const [q, setQ] = React.useState("");

  function submit(e: React.FormEvent) {
    e.preventDefault();
    onSearch?.(q);
  }

  return (
    <header
      className="w-full border-b bg-white/70 backdrop-blur sticky top-0 z-40"
      style={{ borderColor: "#eaeaea" }}
    >
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-4">
        <Link href="/" className="flex items-center gap-2">
          <div
            className="h-7 w-7 rounded-md flex items-center justify-center"
            style={{ backgroundColor: colors.primary, color: "white" }}
            aria-label="Notes app"
          >
            N
          </div>
          <span className="text-lg font-medium" style={{ color: colors.secondary }}>
            Notes
          </span>
        </Link>

        <form onSubmit={submit} className="flex-1 max-w-xl">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search notes..."
            className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
            style={{
              borderColor: "#e5e7eb",
              boxShadow: "none",
            }}
          />
        </form>

        <nav className="flex items-center gap-3">
          {user ? (
            <>
              <span className="text-sm text-gray-600 hidden sm:block">{user.email}</span>
              <Link
                href="/notes/new"
                className="rounded-md px-3 py-2 text-sm"
                style={{ backgroundColor: colors.accent, color: "#111827" }}
              >
                New Note
              </Link>
              <button
                className="rounded-md px-3 py-2 text-sm border"
                style={{ borderColor: "#e5e7eb" }}
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm">Login</Link>
              <Link
                href="/register"
                className="rounded-md px-3 py-2 text-sm"
                style={{ backgroundColor: colors.primary, color: "white" }}
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

// PUBLIC_INTERFACE
export function Sidebar({
  tags,
  folders,
  activeTag,
  activeFolder,
  onSelectTag,
  onSelectFolder,
}: {
  tags: string[];
  folders: string[];
  activeTag?: string;
  activeFolder?: string;
  onSelectTag?: (t?: string) => void;
  onSelectFolder?: (f?: string) => void;
}) {
  /** Left sidebar for tags and folders. */
  return (
    <aside className="w-64 shrink-0 border-r hidden md:block" style={{ borderColor: "#eaeaea" }}>
      <div className="p-4">
        <h3 className="text-xs uppercase tracking-wide text-gray-500 mb-2">Folders</h3>
        <div className="flex flex-col gap-1">
          <button
            className={classNames(
              "text-left px-2 py-1 rounded",
              !activeFolder ? "bg-gray-100" : "hover:bg-gray-50"
            )}
            onClick={() => onSelectFolder?.(undefined)}
          >
            All
          </button>
          {folders.map((f) => (
            <button
              key={f}
              className={classNames(
                "text-left px-2 py-1 rounded",
                activeFolder === f ? "bg-gray-100" : "hover:bg-gray-50"
              )}
              onClick={() => onSelectFolder?.(f)}
            >
              {f}
            </button>
          ))}
        </div>

        <h3 className="text-xs uppercase tracking-wide text-gray-500 mt-6 mb-2">Tags</h3>
        <div className="flex flex-col gap-1">
          <button
            className={classNames(
              "text-left px-2 py-1 rounded",
              !activeTag ? "bg-gray-100" : "hover:bg-gray-50"
            )}
            onClick={() => onSelectTag?.(undefined)}
          >
            All
          </button>
          {tags.map((t) => (
            <button
              key={t}
              className={classNames(
                "text-left px-2 py-1 rounded",
                activeTag === t ? "bg-gray-100" : "hover:bg-gray-50"
              )}
              onClick={() => onSelectTag?.(t)}
            >
              #{t}
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}

// PUBLIC_INTERFACE
export function NoteCard({ title, content, updatedAt, href, tags }: { title: string; content: string; updatedAt: string; href: string; tags: string[] }) {
  /** Compact summary card for a note. */
  return (
    <Link href={href} className="block border rounded-lg p-4 hover:shadow-sm transition bg-white" style={{ borderColor: "#eee" }}>
      <h4 className="font-medium text-gray-900 line-clamp-1">{title || "Untitled"}</h4>
      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{content || "No content"}</p>
      <div className="flex items-center gap-2 mt-3">
        {tags.slice(0, 3).map((t) => (
          <span key={t} className="text-[10px] px-2 py-1 rounded-full" style={{ backgroundColor: "#F3F4F6" }}>
            #{t}
          </span>
        ))}
        <span className="ml-auto text-xs text-gray-500">{new Date(updatedAt).toLocaleString()}</span>
      </div>
    </Link>
  );
}

// PUBLIC_INTERFACE
export function EmptyState({ title, action }: { title: string; action?: React.ReactNode }) {
  /** Empty state component for lists without content. */
  return (
    <div className="text-center py-16">
      <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center" style={{ backgroundColor: "#F3F4F6", color: colors.primary }}>
        ✏️
      </div>
      <h3 className="mt-4 text-gray-700">{title}</h3>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// PUBLIC_INTERFACE
export function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "ghost" | "accent" }) {
  /** Button with minimal variants. */
  const { className, variant = "primary", ...rest } = props;
  const base = "px-3 py-2 rounded-md text-sm";
  const style =
    variant === "primary"
      ? { backgroundColor: colors.primary, color: "white" }
      : variant === "accent"
      ? { backgroundColor: colors.accent, color: "#111827" }
      : {};
  const classes = classNames(base, variant === "ghost" ? "border" : "", className);
  return <button className={classes} style={style} {...rest} />;
}

// PUBLIC_INTERFACE
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  /** Text input field */
  const { className, ...rest } = props;
  return (
    <input
      className={classNames("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2", className)}
      style={{ borderColor: "#e5e7eb" }}
      {...rest}
    />
  );
}

// PUBLIC_INTERFACE
export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  /** Text area field */
  const { className, ...rest } = props;
  return (
    <textarea
      className={classNames("w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2 min-h-64", className)}
      style={{ borderColor: "#e5e7eb" }}
      {...rest}
    />
  );
}

// PUBLIC_INTERFACE
export function TagPill({ label }: { label: string }) {
  /** Tag pill used inline. */
  return <span className="text-xs px-2 py-1 rounded-full bg-gray-100">#{label}</span>;
}
