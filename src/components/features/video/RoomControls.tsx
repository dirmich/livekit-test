import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Room } from 'livekit-client';

interface RoomControlsProps {
  room: Room;
  onLeave: () => void;
}

export function RoomControls({ room, onLeave }: RoomControlsProps) {
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleCamera = async () => {
    await room.localParticipant.setCameraEnabled(!isCameraEnabled);
    setIsCameraEnabled(!isCameraEnabled);
  };

  const toggleMic = async () => {
    await room.localParticipant.setMicrophoneEnabled(!isMicEnabled);
    setIsMicEnabled(!isMicEnabled);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await room.localParticipant.setScreenShareEnabled(false);
    } else {
      await room.localParticipant.setScreenShareEnabled(true);
    }
    setIsScreenSharing(!isScreenSharing);
  };

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