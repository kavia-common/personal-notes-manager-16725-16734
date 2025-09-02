"use client";

import React from "react";
import { useRouter, useParams } from "next/navigation";
import { TopNav, Sidebar, Button, Input, TextArea, TagPill } from "@/components/ui";
import { deleteNote, fetchNote, fetchNotes, updateNote, type Note } from "@/lib/api";
import Link from "next/link";

import RequireAuth from "@/components/RequireAuth";

export default function NoteDetailPage() {
  const params = useParams();
  const id = String(params?.id || "");
  const router = useRouter();
  const [note, setNote] = React.useState<Note | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [existingTags, setExistingTags] = React.useState<string[]>([]);
  const [existingFolders, setExistingFolders] = React.useState<string[]>([]);

  React.useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [n, list] = await Promise.all([fetchNote(id), fetchNotes()]);
        setNote(n);
        const tagsSet = new Set<string>();
        const folderSet = new Set<string>();
        list.forEach((x) => {
          x.tags.forEach((t) => tagsSet.add(t));
          if (x.folder) folderSet.add(x.folder);
        });
        setExistingTags(Array.from(tagsSet));
        setExistingFolders(Array.from(folderSet));
      } finally {
        setLoading(false);
      }
    }
    if (id) load();
  }, [id]);

  async function save() {
    if (!note) return;
    setSaving(true);
    try {
      const updated = await updateNote(note.id, {
        title: note.title,
        content: note.content,
        tags: note.tags,
        folder: note.folder || null,
      });
      setNote(updated);
    } finally {
      setSaving(false);
    }
  }

  async function remove() {
    if (!note) return;
    if (!confirm("Delete this note?")) return;
    await deleteNote(note.id);
    router.replace("/notes");
  }

  const sidebar = (
    <Sidebar
      tags={existingTags}
      folders={existingFolders}
      onSelectTag={(t) => {
        if (!t || !note) return;
        if (!note.tags.includes(t)) setNote({ ...note, tags: [...note.tags, t] });
      }}
      onSelectFolder={(f) => note && setNote({ ...note, folder: f || null })}
    />
  );

  return (
    <RequireAuth>
      <div className="min-h-screen flex flex-col">
        <TopNav />
        <div className="flex flex-1">
          <div className="hidden md:block">{sidebar}</div>
          <div className="flex-1">
            <div className="mx-auto max-w-3xl px-4 py-6">
              {loading || !note ? (
                <p className="text-sm text-gray-600">Loading...</p>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Link href="/notes">
                      <Button variant="ghost">Back</Button>
                    </Link>
                    <div className="ml-auto flex items-center gap-2">
                      <Button variant="ghost" onClick={remove}>Delete</Button>
                      <Button onClick={save} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
                    </div>
                  </div>

                  <div className="mt-6 space-y-4">
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Title</label>
                      <Input value={note.title} onChange={(e) => setNote({ ...note, title: e.target.value })} />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-700 mb-1">Content</label>
                      <TextArea value={note.content} onChange={(e) => setNote({ ...note, content: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Tags</label>
                        <div className="flex flex-wrap gap-2">
                          {note.tags.map((t) => (
                            <div key={t} className="flex items-center gap-1">
                              <TagPill label={t} />
                              <button
                                className="text-xs text-gray-500"
                                onClick={() => setNote({ ...note, tags: note.tags.filter((x) => x !== t) })}
                                aria-label={`Remove ${t}`}
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                        </div>
                        <div className="mt-2 flex gap-2">
                          <Input
                            placeholder="Add tag"
                            onKeyDown={(e) => {
                              const val = (e.target as HTMLInputElement).value.trim();
                              if (e.key === "Enter" && val) {
                                e.preventDefault();
                                if (!note.tags.includes(val)) setNote({ ...note, tags: [...note.tags, val] });
                                (e.target as HTMLInputElement).value = "";
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm text-gray-700 mb-1">Folder</label>
                        <Input
                          placeholder="Folder"
                          value={note.folder || ""}
                          onChange={(e) => setNote({ ...note, folder: e.target.value || null })}
                        />
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Last updated {new Date(note.updatedAt).toLocaleString()}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
