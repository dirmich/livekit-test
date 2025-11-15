import { useState, useCallback, useEffect } from 'react';
import { Room, RoomEvent, DataPacket_Kind, Participant } from 'livekit-client';
import type { ChatMessage } from '@/types/livekit';
import { generateUUID } from '@/lib/utils/uuid';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function useChat(room: Room | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!room || !room.localParticipant || !message.trim()) return;

      const chatMessage: ChatMessage = {
        id: generateUUID(),
        senderId: room.localParticipant.identity,
        senderName: room.localParticipant.name || room.localParticipant.identity,
        message: message.trim(),
        timestamp: Date.now(),
      };

      const data = encoder.encode(JSON.stringify(chatMessage));
      await room.localParticipant.publishData(data, { reliable: true });

      setMessages((prev) => [...prev, chatMessage]);
    },
    [room]
  );

  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (
      payload: Uint8Array,
      participant?: Participant,
      kind?: DataPacket_Kind
    ) => {
      if (kind === DataPacket_Kind.RELIABLE) {
        const message: ChatMessage = JSON.parse(decoder.decode(payload));
        setMessages((prev) => [...prev, message]);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  return {
    messages,
    sendMessage,
  };
}
