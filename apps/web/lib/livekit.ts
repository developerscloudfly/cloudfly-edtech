import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

const LIVEKIT_API_KEY = process.env.LIVEKIT_API_KEY!;
const LIVEKIT_API_SECRET = process.env.LIVEKIT_API_SECRET!;
const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL!;

export function getRoomServiceClient(): RoomServiceClient {
  return new RoomServiceClient(LIVEKIT_URL, LIVEKIT_API_KEY, LIVEKIT_API_SECRET);
}

export async function generateLiveKitToken({
  roomName,
  participantName,
  participantId,
  isInstructor = false,
}: {
  roomName: string;
  participantName: string;
  participantId: string;
  isInstructor?: boolean;
}): Promise<string> {
  const at = new AccessToken(LIVEKIT_API_KEY, LIVEKIT_API_SECRET, {
    identity: participantId,
    name: participantName,
    ttl: '4h',
  });

  at.addGrant({
    roomJoin: true,
    room: roomName,
    canPublish: isInstructor,
    canSubscribe: true,
    canPublishData: true,
    roomAdmin: isInstructor,
  });

  return await at.toJwt();
}

export async function endLiveKitRoom(roomName: string): Promise<void> {
  const svc = getRoomServiceClient();
  await svc.deleteRoom(roomName);
}
