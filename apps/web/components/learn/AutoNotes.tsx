'use client';

import { useState } from 'react';
import { FileText, Plus, Trash2, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Note {
  id: string;
  timestamp: number;
  content: string;
  createdAt: Date;
}

interface AutoNotesProps {
  lessonTitle?: string;
  currentTime?: number;
}

export function AutoNotes({ lessonTitle, currentTime = 0 }: AutoNotesProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const addNote = () => {
    if (!newNote.trim()) return;
    const note: Note = {
      id: crypto.randomUUID(),
      timestamp: currentTime,
      content: newNote.trim(),
      createdAt: new Date(),
    };
    setNotes((prev) => [...prev, note]);
    setNewNote('');
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const exportNotes = () => {
    const text = notes
      .map((n) => `[${formatTime(n.timestamp)}] ${n.content}`)
      .join('\n\n');
    const blob = new Blob([`# Notes: ${lessonTitle ?? 'Lesson'}\n\n${text}`], {
      type: 'text/plain',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `notes-${lessonTitle ?? 'lesson'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="border border-ash rounded-xl bg-surface">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-sm font-medium text-blue-deep hover:bg-bg-base transition-colors rounded-xl"
      >
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4" />
          My Notes
          {notes.length > 0 && (
            <span className="bg-blue-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {notes.length}
            </span>
          )}
        </div>
        <span className="text-slate">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div className="px-4 pb-4 border-t border-ash">
          {/* Add note */}
          <div className="flex gap-2 mt-4">
            <div className="flex-1">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder={`Add note at ${formatTime(currentTime)}...`}
                rows={2}
                className="w-full text-sm border border-ash rounded-lg px-3 py-2 resize-none focus:outline-none focus:border-blue-primary text-blue-deep placeholder:text-slate"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) addNote();
                }}
              />
            </div>
            <Button size="icon" onClick={addNote} disabled={!newNote.trim()}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          {/* Notes list */}
          {notes.length > 0 && (
            <>
              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                {notes.map((note) => (
                  <div key={note.id} className="flex gap-2 group">
                    <span className="text-xs text-blue-primary font-mono mt-0.5 flex-shrink-0">
                      {formatTime(note.timestamp)}
                    </span>
                    <p className="text-sm text-slate flex-1">{note.content}</p>
                    <button
                      onClick={() => deleteNote(note.id)}
                      className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-600 transition-all flex-shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 w-full"
                onClick={exportNotes}
              >
                <Download className="w-4 h-4 mr-2" />
                Export Notes
              </Button>
            </>
          )}

          {notes.length === 0 && (
            <p className="text-xs text-slate text-center mt-4 py-2">
              No notes yet. Add your first note above.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
