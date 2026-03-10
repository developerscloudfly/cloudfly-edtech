import { AccessToken, RoomServiceClient } from 'livekit-server-sdk';

function getLiveKitCreds() {
  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const url = process.env.NEXT_PUBLIC_LIVEKIT_URL;
  if (!apiKey || !apiSecret || !url) throw new Error('LiveKit credentials are not defined');
  return { apiKey, apiSecret, url };
}

export function getRoomServiceClient(): RoomServiceClient {
  const { url, apiKey, apiSecret } = getLiveKitCreds();
  return new RoomServiceClient(url, apiKey, apiSecret);
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
  const { apiKey, apiSecret } = getLiveKitCreds();
  const at = new AccessToken(apiKey, apiSecret, {
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
  return at.toJwt();
}

export async function endLiveKitRoom(roomName: string): Promise<void> {
  const svc = getRoomServiceClient();
  await svc.deleteRoom(roomName);
}
