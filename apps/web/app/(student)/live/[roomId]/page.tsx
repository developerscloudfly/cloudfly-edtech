'use client';

import { useParams } from 'next/navigation';
import { Video, Mic, MicOff, VideoOff, PhoneOff, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';

export default function LiveRoomPage() {
  const params = useParams();
  const roomId = params.roomId as string;
  const [micOn, setMicOn] = useState(false);
  const [camOn, setCamOn] = useState(false);

  return (
    <div className="h-full flex flex-col gap-4">
      <div>
        <h1 className="font-heading text-xl font-bold text-blue-deep">Live Session</h1>
        <p className="text-sm text-slate">Room: {roomId}</p>
      </div>

      {/* Video grid */}
      <div className="flex-1 bg-blue-deep rounded-2xl min-h-64 flex items-center justify-center">
        <div className="text-center text-white">
          <Users className="w-12 h-12 mx-auto mb-3 text-white/40" />
          <p className="font-heading font-semibold text-lg">Waiting for the session to start...</p>
          <p className="text-sm text-white/60 mt-1">The instructor will begin shortly</p>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-surface border border-ash rounded-2xl px-6 py-4 flex items-center justify-center gap-4">
        <button
          onClick={() => setMicOn(!micOn)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            micOn ? 'bg-blue-primary text-white' : 'bg-ash text-slate hover:bg-blue-primary/10'
          }`}
          title={micOn ? 'Mute microphone' : 'Unmute microphone'}
        >
          {micOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
        </button>
        <button
          onClick={() => setCamOn(!camOn)}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
            camOn ? 'bg-blue-primary text-white' : 'bg-ash text-slate hover:bg-blue-primary/10'
          }`}
          title={camOn ? 'Turn off camera' : 'Turn on camera'}
        >
          {camOn ? <Video className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
        </button>
        <button
          className="w-12 h-12 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center transition-colors"
          title="Leave session"
        >
          <PhoneOff className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
