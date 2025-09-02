"use client";

import React from "react";
import { TopNav, Sidebar, NoteCard, EmptyState, Button } from "@/components/ui";
import { fetchNotes, type Note } from "@/lib/api";
import Link from "next/link";

import RequireAuth from "@/components/RequireAuth";

export default function NotesPage() {
  const [notes, setNotes] = React.useState<Note[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState<string | undefined>(undefined);
  const [activeTag, setActiveTag] = React.useState<string | undefined>(undefined);
  const [activeFolder, setActiveFolder] = React.useState<string | undefined>(undefined);

  const tags = React.useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => n.tags.forEach((t) => set.add(t)));
    return Array.from(set).sort();
  }, [notes]);

  const folders = React.useMemo(() => {
    const set = new Set<string>();
    notes.forEach((n) => {
      if (n.folder) set.add(n.folder);
    });
    return Array.from(set).sort();
  }, [notes]);

  async function load() {
    setLoading(true);
    try {
      const data = await fetchNotes({ search, tag: activeTag, folder: activeFolder });
      setNotes(data);
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, activeTag, activeFolder]);

  const content = (
    <div className="flex-1">
      <div className="mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between py-4">
          <h2 className="text-lg font-medium text-gray-800">Your Notes</h2>
          <Link href="/notes/new">
            <Button variant="accent">New Note</Button>
          </Link>
        </div>

        {loading ? (
          <p className="text-sm text-gray-600">Loading...</p>
        ) : notes.length === 0 ? (
          <EmptyState
            title="No notes match your filters."
            action={
              <Link href="/notes/new">
                <Button>Create your first note</Button>
              </Link>
            }
          />
        ) : (
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 pb-8">
            {notes.map((n) => (
              <NoteCard key={n.id} title={n.title} content={n.content} updatedAt={n.updatedAt} href={`/notes/${n.id}`} tags={n.tags} />
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <TopNav onSearch={(q) => setSearch(q || undefined)} />
        <div className="flex flex-1">
          <Sidebar
            tags={tags}
            folders={folders}
            activeTag={activeTag}
            activeFolder={activeFolder}
            onSelectTag={setActiveTag}
            onSelectFolder={setActiveFolder}
          />
          {content}
        </div>
      </div>
    </RequireAuth>
  );
}
