export default function NotesNotFound() {
  return (
    <div className="min-h-[40vh] flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-lg font-medium text-gray-900">Note not found</h2>
        <p className="text-sm text-gray-600 mt-1">The note you’re looking for doesn’t exist.</p>
      </div>
    </div>
  );
}
