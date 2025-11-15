'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ParticipantView } from '@/components/features/video/ParticipantView';
import { RoomControls } from '@/components/features/video/RoomControls';
import { ConnectionStatus } from '@/components/features/connection/ConnectionStatus';
import { useRoom } from '@/hooks/use-room';
import { useParticipants } from '@/hooks/use-participants';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomName = params.roomName as string;
  const { room, connectionState, connect, disconnect } = useRoom();
  const { participants, localParticipant } = useParticipants(room);

  useEffect(() => {
    const userName = prompt('Enter your name:');
    if (userName) {
      connect(roomName, userName);
    } else {
      router.push('/');
    }
  }, [roomName, connect, router]);

  const handleLeave = () => {
    disconnect();
    router.push('/');
  };

  if (connectionState !== 'connected' || !room) {
    return (
      <div className="flex items-center justify-center h-screen">
        <ConnectionStatus state={connectionState} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <div className="p-4 bg-gray-900 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Room: {roomName}</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-auto">
        {localParticipant && (
          <ParticipantView participant={localParticipant} isLocal />
        )}
        {participants.map((participant) => (
          <ParticipantView key={participant.sid} participant={participant} />
        ))}
      </div>

      <RoomControls room={room} onLeave={handleLeave} />
    </div>
  );
}