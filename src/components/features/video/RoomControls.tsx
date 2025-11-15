import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Room } from 'livekit-client';

interface RoomControlsProps {
  room: Room;
  onLeave: () => void;
}

export function RoomControls({ room, onLeave }: RoomControlsProps) {
  const [isCameraEnabled, setIsCameraEnabled] = useState(
    room.localParticipant.isCameraEnabled
  );
  const [isMicEnabled, setIsMicEnabled] = useState(
    room.localParticipant.isMicrophoneEnabled
  );
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  // Sync state with actual participant state
  useEffect(() => {
    setIsCameraEnabled(room.localParticipant.isCameraEnabled);
    setIsMicEnabled(room.localParticipant.isMicrophoneEnabled);
  }, [room]);

  const createToggleHandler = (
    currentState: boolean,
    setState: (value: boolean) => void,
    enableMethod: (enabled: boolean) => Promise<unknown>
  ) => {
    return async () => {
      const newState = !currentState;
      try {
        await enableMethod(newState);
        setState(newState);
      } catch (error) {
        // Handle device errors gracefully (e.g., device not found, permissions denied)
        console.error('Failed to toggle media device:', error);
        // Don't update state if the operation failed
      }
    };
  };

  const toggleCamera = createToggleHandler(
    isCameraEnabled,
    setIsCameraEnabled,
    (enabled) => room.localParticipant.setCameraEnabled(enabled)
  );

  const toggleMic = createToggleHandler(
    isMicEnabled,
    setIsMicEnabled,
    (enabled) => room.localParticipant.setMicrophoneEnabled(enabled)
  );

  const toggleScreenShare = createToggleHandler(
    isScreenSharing,
    setIsScreenSharing,
    (enabled) => room.localParticipant.setScreenShareEnabled(enabled)
  );

  return (
    <div className="flex gap-2 justify-center p-4 bg-gray-900">
      <Button
        variant={isCameraEnabled ? 'default' : 'destructive'}
        onClick={toggleCamera}
      >
        {isCameraEnabled ? '📹 Camera On' : '📷 Camera Off'}
      </Button>
      <Button variant={isMicEnabled ? 'default' : 'destructive'} onClick={toggleMic}>
        {isMicEnabled ? '🎤 Mic On' : '🔇 Mic Off'}
      </Button>
      <Button
        variant={isScreenSharing ? 'secondary' : 'outline'}
        onClick={toggleScreenShare}
      >
        {isScreenSharing ? '🖥️ Stop Sharing' : '🖥️ Share Screen'}
      </Button>
      <Button variant="destructive" onClick={onLeave}>
        Leave Room
      </Button>
    </div>
  );
}