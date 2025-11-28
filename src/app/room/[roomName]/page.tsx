'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { ParticipantView } from '@/components/features/video/ParticipantView';
import { RoomControls } from '@/components/features/video/RoomControls';
import { ConnectionStatus } from '@/components/features/connection/ConnectionStatus';
import { ChatContainer } from '@/components/features/chat/ChatContainer';
import { useRoom } from '@/hooks/use-room';
import { useParticipants } from '@/hooks/use-participants';
import { useChat } from '@/hooks/use-chat';
import { Users, ChevronDown, ChevronUp, LayoutGrid, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function RoomPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roomName = decodeURIComponent(params.roomName as string);
  const participantName = searchParams.get('participantName');

  const { room, connectionState, connect, disconnect } = useRoom();
  const { participants, localParticipant } = useParticipants(room);
  const { messages, sendMessage } = useChat(room);

  const [focusedParticipantSid, setFocusedParticipantSid] = useState<string | null>(null);
  const [isListExpanded, setIsListExpanded] = useState(false);
  const [showChat, setShowChat] = useState(true);

  useEffect(() => {
    // Check if we are already connected to this room to avoid double connection
    if (room && room.name === roomName && connectionState === 'connected') {
      return;
    }

    if (participantName) {
      connect(roomName, participantName);
    } else {
      // If no name provided, redirect to home to enter name
      router.push('/');
    }
  }, [roomName, participantName, connect, router, room, connectionState]);

  const handleLeave = () => {
    disconnect();
    router.push('/');
  };

  if (connectionState !== 'connected' || !room) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-950">
        <ConnectionStatus state={connectionState} />
      </div>
    );
  }

  // Filter out local participant from lists as requested
  const remoteParticipants = participants;
  const focusedParticipant = participants.find(p => p.identity === focusedParticipantSid);

  return (
    <div className="h-screen flex flex-col bg-gray-950 overflow-hidden relative">

      {/* LAYER 1: Focused Video Background */}
      {focusedParticipantSid && focusedParticipant && (
        <div className="absolute inset-0 z-0">
          <ParticipantView participant={focusedParticipant} />
        </div>
      )}

      {/* LAYER 2: Main Interface */}
      <div className="relative z-10 flex flex-col h-full">

        {/* Top Section: Header & Participant Strip */}
        <div className="bg-black/40 backdrop-blur-md border-b border-white/10 transition-all duration-300">
          <div className="h-14 px-4 flex items-center justify-between">
            <h1 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              {roomName}
            </h1>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 text-xs text-gray-300 bg-white/10 px-3 py-1.5 rounded-full">
                <Users className="w-3 h-3" />
                <span>{remoteParticipants.length}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className={`h-8 w-8 p-0 rounded-full hover:bg-white/10 ${!showChat ? 'text-gray-500' : 'text-white'}`}
                onClick={() => setShowChat(!showChat)}
              >
                <MessageSquare className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full hover:bg-white/10"
                onClick={() => setIsListExpanded(!isListExpanded)}
              >
                {isListExpanded ? <ChevronUp className="w-5 h-5 text-white" /> : <LayoutGrid className="w-5 h-5 text-white" />}
              </Button>
            </div>
          </div>

          {/* Participant Strip (Collapsed View) */}
          {!isListExpanded && (
            <div className="px-4 pb-4 overflow-x-auto flex gap-3 scrollbar-hide">
              {remoteParticipants.map((participant) => (
                <div
                  key={participant.sid}
                  className={`
                    flex-shrink-0 w-32 aspect-video rounded-lg overflow-hidden border-2 cursor-pointer relative transition-all
                    ${focusedParticipantSid === participant.identity ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-white/10 hover:border-white/30'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusedParticipantSid(participant.identity === focusedParticipantSid ? null : participant.identity);
                  }}
                >
                  <ParticipantView participant={participant} />
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1 text-[10px] text-white truncate backdrop-blur-sm">
                    {participant.name || participant.identity}
                  </div>
                </div>
              ))}
              {remoteParticipants.length === 0 && (
                <div className="text-xs text-gray-500 py-2 px-1">
                  Waiting for others...
                </div>
              )}
            </div>
          )}
        </div>

        {/* Middle Section: Chat */}
        {showChat && (
          <div className={`flex-1 overflow-hidden relative transition-all duration-500 ${focusedParticipantSid ? 'bg-transparent' : 'bg-gray-950'}`}>
            <ChatContainer
              messages={messages}
              onSendMessage={sendMessage}
              currentUserId={localParticipant?.identity || ''}
            />
          </div>
        )}
        {!showChat && <div className="flex-1" />} {/* Spacer to keep footer at bottom if needed, or let it collapse */}

        {/* Bottom Section: Controls */}
        <div className="p-4 bg-black/60 backdrop-blur-md border-t border-white/10">
          <RoomControls room={room} onLeave={handleLeave} />
        </div>
      </div>

      {/* LAYER 3: Expanded Participant Grid Overlay */}
      {isListExpanded && (
        <div
          className="absolute inset-0 z-50 bg-gray-950/95 backdrop-blur-xl flex flex-col animate-in fade-in duration-200"
          onClick={() => setIsListExpanded(false)} // Click background to close
        >
          <div className="h-14 px-4 flex items-center justify-between border-b border-white/10" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-white">Participants ({remoteParticipants.length})</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsListExpanded(false)}
            >
              <ChevronUp className="w-5 h-5" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto p-4" onClick={(e) => e.stopPropagation()}>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {remoteParticipants.map((participant) => (
                <div
                  key={participant.sid}
                  className={`
                    aspect-video rounded-xl overflow-hidden border shadow-lg relative cursor-pointer hover:border-blue-400 transition-all
                    ${focusedParticipantSid === participant.identity ? 'border-blue-500 ring-2 ring-blue-500/50' : 'border-white/10 bg-gray-900'}
                  `}
                  onClick={(e) => {
                    e.stopPropagation();
                    setFocusedParticipantSid(participant.identity);
                    setIsListExpanded(false);
                  }}
                >
                  <ParticipantView participant={participant} />
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-xs text-white backdrop-blur-sm">
                    {participant.name || participant.identity}
                  </div>
                </div>
              ))}
            </div>
            {remoteParticipants.length === 0 && (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Users className="w-12 h-12 mb-4 opacity-20" />
                <p>No other participants yet.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}