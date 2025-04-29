"use client";

import { useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
  createdAt: string;
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    fetch("http://localhost:8000/notes")
      .then((res) => {
        if (!res.ok) throw new Error("API error: " + res.status);
        return res.json();
      })
      .then((data) => setNotes(data))
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSubmit = async () => {
    await fetch("http://localhost:8000/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    console.log("Note created");
    setTitle("");
    setContent("");
    // 再取得
    const updated = await fetch("http://localhost:8000/notes").then((res) =>
      res.json()
    );

    console.log(updated);
    setNotes(updated);
  };
  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-2">Notes</h1>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Title"
        className="border p-2 mb-2 block"
      />
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Content"
        className="border p-2 mb-2 block"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded"
      >
        Save Note
      </button>

      <ul className="mt-4">
        {notes.map((note) => (
          <li key={note.id} className="border-b py-2">
            <strong>{note.title}</strong>: {note.content}
          </li>
        ))}
      </ul>
    </div>
  );
}
