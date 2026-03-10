'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, BookOpen, LayoutDashboard, User, Award } from 'lucide-react';

interface Command {
  id: string;
  label: string;
  href: string;
  icon: React.ElementType;
  category: string;
}

const commands: Command[] = [
  { id: 'dashboard', label: 'Go to Dashboard', href: '/dashboard', icon: LayoutDashboard, category: 'Navigation' },
  { id: 'courses', label: 'Browse Courses', href: '/courses', icon: BookOpen, category: 'Navigation' },
  { id: 'profile', label: 'View Profile', href: '/profile', icon: User, category: 'Navigation' },
  { id: 'certificates', label: 'My Certificates', href: '/certificates', icon: Award, category: 'Navigation' },
];

interface CommandPaletteProps {
  open?: boolean;
  onClose?: () => void;
}

export function CommandPalette({ open: controlledOpen, onClose }: CommandPaletteProps) {
  const [open, setOpen] = useState(controlledOpen ?? false);
  const [query, setQuery] = useState('');
  const router = useRouter();

  useEffect(() => {
    if (controlledOpen !== undefined) setOpen(controlledOpen);
  }, [controlledOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
      if (e.key === 'Escape') {
        setOpen(false);
        onClose?.();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const filtered = query
    ? commands.filter(
        (c) =>
          c.label.toLowerCase().includes(query.toLowerCase()) ||
          c.category.toLowerCase().includes(query.toLowerCase())
      )
    : commands;

  const handleSelect = (command: Command) => {
    router.push(command.href);
    setOpen(false);
    onClose?.();
    setQuery('');
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[15vh]">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => {
          setOpen(false);
          onClose?.();
        }}
      />

      {/* Panel */}
      <div className="relative w-full max-w-lg mx-4 bg-surface rounded-2xl shadow-2xl border border-ash overflow-hidden">
        {/* Search input */}
        <div className="flex items-center gap-3 px-4 py-3 border-b border-ash">
          <Search className="w-4 h-4 text-slate flex-shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search commands..."
            className="flex-1 text-sm text-blue-deep placeholder:text-slate bg-transparent outline-none"
          />
          <kbd className="text-xs text-slate bg-ash px-1.5 py-0.5 rounded">ESC</kbd>
        </div>

        {/* Results */}
        <div className="max-h-80 overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <p className="text-sm text-slate text-center py-8">No commands found.</p>
          ) : (
            <div>
              {filtered.map((command) => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    onClick={() => handleSelect(command)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-bg-base transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-slate flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-sm text-blue-deep">{command.label}</span>
                    </div>
                    <span className="text-xs text-slate">{command.category}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
