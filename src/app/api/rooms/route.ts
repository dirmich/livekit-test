import { NextResponse } from 'next/server';
import { getRoomService } from '@/lib/livekit/service';

export async function GET() {
    try {
        const roomService = getRoomService();
        const rooms = await roomService.listRooms();

        // Serialize rooms to simple objects to avoid circular reference issues if any
        const roomList = rooms.map(room => ({
            name: room.name,
            sid: room.sid,
            numParticipants: room.numParticipants,
            creationTime: Number(room.creationTime),
        }));

        return NextResponse.json(roomList);
    } catch (error) {
        console.error('Failed to list rooms:', error);
        return NextResponse.json(
            { error: 'Failed to list rooms' },
            { status: 500 }
        );
    }
}
