import { AccessToken } from 'livekit-server-sdk';
import { config } from '@/lib/config';

export async function generateToken(
  roomName: string,
  participantName: string,
  metadata?: string
): Promise<string> {
  const at = new AccessToken(config.livekit.apiKey, config.livekit.apiSecret, {
    identity: participantName,
    metadata,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return at.toJwt();
}
