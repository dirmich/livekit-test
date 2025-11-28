import { useEffect, useRef } from 'react';
import { Track } from 'livekit-client';

interface VideoTrackProps {
  track: Track;
  className?: string;
}

export function VideoTrack({ track, className }: VideoTrackProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && track) {
      track.attach(videoRef.current);
    }

    return () => {
      track.detach();
    };
  }, [track]);

  return (
    <video
      ref={videoRef}
      className={`w-full h-full object-contain ${className || ''}`}
      autoPlay
      playsInline
      muted={track.kind === Track.Kind.Video}
    />
  );
}