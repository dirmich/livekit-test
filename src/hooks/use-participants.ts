import { useState, useEffect } from 'react';
import { Room, RoomEvent, RemoteParticipant } from 'livekit-client';

export function useParticipants(room: Room | null) {
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  useEffect(() => {
    if (!room) {
      setParticipants([]);
      return;
    }

    const updateParticipants = () => {
      if (room.remoteParticipants) {
        setParticipants(Array.from(room.remoteParticipants.values()));
      } else {
        setParticipants([]);
      }
    };

    updateParticipants();

    room.on(RoomEvent.ParticipantConnected, updateParticipants);
    room.on(RoomEvent.ParticipantDisconnected, updateParticipants);

    return () => {
      room.off(RoomEvent.ParticipantConnected, updateParticipants);
      room.off(RoomEvent.ParticipantDisconnected, updateParticipants);
    };
  }, [room]);

  return {
    participants,
    localParticipant: room?.localParticipant,
  };
}