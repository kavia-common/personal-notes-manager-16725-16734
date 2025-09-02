"use client";

import React from "react";
import { TopNav, Sidebar, Button, Input, TextArea } from "@/components/ui";
import { createNote, fetchNotes } from "@/lib/api";
import { useRouter } from "next/navigation";

import RequireAuth from "@/components/RequireAuth";

export default function NewNotePage() {
  const router = useRouter();
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tags, setTags] = React.useState<string>("");
  const [folder, setFolder] = React.useState<string>("");
  const [loading, setLoading] = React.useState(false);
  const [existingTags, setExistingTags] = React.useState<string[]>([]);
  const [existingFolders, setExistingFolders] = React.useState<string[]>([]);

  React.useEffect(() => {
    fetchNotes().then((list) => {
      const tagsSet = new Set<string>();
      const folderSet = new Set<string>();
      list.forEach((n) => {
        n.tags.forEach((t) => tagsSet.add(t));
        if (n.folder) folderSet.add(n.folder);
      });
      setExistingTags(Array.from(tagsSet));
      setExistingFolders(Array.from(folderSet));
    });
  }, []);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const created = await createNote({
        title,
        content,
        tags: tags
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        folder: folder || null,
      });
      router.replace(`/notes/${created.id}`);
    } finally {
      setLoading(false);
    }
  }

  const sidebar = (
    <Sidebar
      tags={existingTags}
      folders={existingFolders}
      onSelectTag={(t) => setTags((prev) => (prev ? prev + "," + t : t || ""))}
      onSelectFolder={(f) => setFolder(f || "")}
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
              <h2 className="text-lg font-medium text-gray-800 mb-4">Create Note</h2>
              <form className="space-y-4" onSubmit={submit}>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Title</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Untitled note" />
                </div>
                <div>
                  <label className="block text-sm text-gray-700 mb-1">Content</label>
                  <TextArea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write your note..." />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Tags (comma separated)</label>
                    <Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="work, ideas" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-700 mb-1">Folder (optional)</label>
                    <Input value={folder} onChange={(e) => setFolder(e.target.value)} placeholder="Personal" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create"}</Button>
                  <Button type="button" variant="ghost" onClick={() => router.back()}>Cancel</Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </RequireAuth>
  );
}
