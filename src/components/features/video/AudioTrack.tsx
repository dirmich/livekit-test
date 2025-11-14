import { useEffect, useRef } from 'react';
import { Track } from 'livekit-client';

interface AudioTrackProps {
  track: Track;
}

export function AudioTrack({ track }: AudioTrackProps) {
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && track) {
      track.attach(audioRef.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return <audio ref={audioRef} autoPlay />;
}