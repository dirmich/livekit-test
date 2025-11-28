import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Room } from 'livekit-client';
import { useLanguage } from '@/contexts/LanguageContext';

interface RoomControlsProps {
  room: Room;
  onLeave: () => void;
}

export function RoomControls({ room, onLeave }: RoomControlsProps) {
  const { t } = useLanguage();
  // Start with devices disabled (user must click to enable)
  const [isCameraEnabled, setIsCameraEnabled] = useState(false);
  const [isMicEnabled, setIsMicEnabled] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [canScreenShare, setCanScreenShare] = useState(false);

  // Sync state with actual participant state and check capabilities
  useEffect(() => {
    setIsCameraEnabled(room.localParticipant.isCameraEnabled);
    setIsMicEnabled(room.localParticipant.isMicrophoneEnabled);

    // Check if screen sharing is supported (mostly desktop only)
    setCanScreenShare(
      typeof navigator !== 'undefined' &&
      !!navigator.mediaDevices &&
      'getDisplayMedia' in navigator.mediaDevices
    );
  }, [room]);

  const createToggleHandler = (
    currentState: boolean,
    setState: (value: boolean) => void,
    enableMethod: (enabled: boolean) => Promise<unknown>
  ) => {
    return async () => {
      // Check if getUserMedia is available (required for camera/mic access)
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error(
          'getUserMedia is not supported in this browser. Please use a modern browser with HTTPS.'
        );
        alert(
          'Camera/microphone access is not supported in this browser. Please use a modern browser with HTTPS connection.'
        );
        return;
      }

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
        {isCameraEnabled ? `📹 ${t.controls.cameraOn}` : `📷 ${t.controls.cameraOff}`}
      </Button>
      <Button variant={isMicEnabled ? 'default' : 'destructive'} onClick={toggleMic}>
        {isMicEnabled ? `🎤 ${t.controls.micOn}` : `🔇 ${t.controls.micOff}`}
      </Button>
      {canScreenShare && (
        <Button
          variant={isScreenSharing ? 'secondary' : 'outline'}
          onClick={toggleScreenShare}
        >
          {isScreenSharing ? `🖥️ ${t.controls.stopSharing}` : `🖥️ ${t.controls.screenShare}`}
        </Button>
      )}
      <Button variant="destructive" onClick={onLeave}>
        {t.controls.leave}
      </Button>
    </div>
  );
}