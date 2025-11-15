import { useState, useCallback, useEffect } from 'react';
import { Room, RoomEvent, ConnectionState } from 'livekit-client';

export function useRoom() {
  const [room] = useState(() => new Room());
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected
  );
  const [error, setError] = useState<Error | null>(null);

  const connect = useCallback(
    async (roomName: string, participantName: string) => {
      try {
        setConnectionState(ConnectionState.Connecting);
        setError(null);

        // Fetch token from API
        const response = await fetch(
          `/api/token?roomName=${roomName}&participantName=${participantName}`
        );
        const { token, url } = await response.json();

        // Connect to room
        await room.connect(url, token);
        setConnectionState(ConnectionState.Connected);

        // Note: Camera and microphone are disabled by default
        // Users must manually enable them using the RoomControls buttons
        // This is required for mobile browser compatibility (getUserMedia needs user gesture)
      } catch (err) {
        setError(err as Error);
        setConnectionState(ConnectionState.Disconnected);
      }
    },
    [room]
  );

  const disconnect = useCallback(() => {
    room.disconnect();
    setConnectionState(ConnectionState.Disconnected);
  }, [room]);

  useEffect(() => {
    const handleConnectionStateChange = (state: ConnectionState) => {
      setConnectionState(state);
    };

    room.on(RoomEvent.ConnectionStateChanged, handleConnectionStateChange);

    return () => {
      room.off(RoomEvent.ConnectionStateChanged, handleConnectionStateChange);
    };
  }, [room]);

  return {
    room,
    connectionState,
    error,
    connect,
    disconnect,
  };
}
