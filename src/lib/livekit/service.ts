import { RoomServiceClient } from 'livekit-server-sdk';
import { config } from '@/lib/config';

let roomService: RoomServiceClient | null = null;

export function getRoomService(): RoomServiceClient {
    if (!roomService) {
        roomService = new RoomServiceClient(
            config.livekit.url,
            config.livekit.apiKey,
            config.livekit.apiSecret
        );
    }
    return roomService;
}
