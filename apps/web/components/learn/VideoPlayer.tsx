'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

interface VideoPlayerProps {
  videoId: string;
  title?: string;
  onComplete?: () => void;
}

export function VideoPlayer({ videoId, title, onComplete }: VideoPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false);

  const embedUrl = `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&enablejsapi=1&origin=${
    typeof window !== 'undefined' ? window.location.origin : ''
  }`;

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden">
      <div className="aspect-video">
        {!isLoaded && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-deep to-blue-primary cursor-pointer"
            onClick={() => setIsLoaded(true)}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                <Play className="w-7 h-7 text-white ml-1" fill="white" />
              </div>
              {title && <p className="text-white/80 text-sm font-medium">{title}</p>}
            </div>
          </div>
        )}
        {isLoaded && (
          <iframe
            src={embedUrl}
            title={title ?? 'Video lesson'}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            className="w-full h-full"
            onLoad={() => {
              // In production, track progress via YouTube API postMessage events
            }}
          />
        )}
      </div>
      {onComplete && (
        <div className="p-3 bg-surface border-t border-ash flex justify-end">
          <button
            onClick={onComplete}
            className="text-sm text-blue-primary font-medium hover:text-blue-deep transition-colors"
          >
            Mark as complete →
          </button>
        </div>
      )}
    </div>
  );
}
