'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatContainer } from '@/components/features/chat/ChatContainer';
import { ConnectionStatus } from '@/components/features/connection/ConnectionStatus';
import { useRoom } from '@/hooks/use-room';
import { useChat } from '@/hooks/use-chat';

export default function ChatPage() {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const { room, connectionState, connect, disconnect } = useRoom();
  const { messages, sendMessage } = useChat(room);

  const handleJoin = async () => {
    if (roomName && userName) {
      await connect(roomName, userName);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">LiveKit Chat Test</h1>

      <ConnectionStatus state={connectionState} className="mb-4" />

      {connectionState === 'disconnected' ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Join Chat Room</h2>
          <div className="space-y-4">
            <Input
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Input
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Button onClick={handleJoin} className="w-full">
              Join Room
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Room: {roomName}</h2>
            <Button variant="destructive" onClick={disconnect}>
              Leave Room
            </Button>
          </div>
          <div className="h-[600px]">
            <ChatContainer
              messages={messages}
              onSendMessage={sendMessage}
              currentUserId={room?.localParticipant.identity || ''}
              disabled={connectionState !== 'connected'}
            />
          </div>
        </div>
      )}
    </div>
  );
}