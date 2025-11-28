import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { VideoTrack } from './VideoTrack';
import { AudioTrack } from './AudioTrack';
import { Participant, Track } from 'livekit-client';

interface ParticipantViewProps {
  participant: Participant;
  isLocal?: boolean;
}

export function ParticipantView({ participant, isLocal }: ParticipantViewProps) {
  const videoPublications = Array.from(participant.videoTrackPublications.values());
  const screenSharePub = videoPublications.find(p => p.source === Track.Source.ScreenShare);
  const cameraPub = videoPublications.find(p => p.source === Track.Source.Camera);

  const videoTrack = (screenSharePub?.track || cameraPub?.track);
  const isScreenShare = !!screenSharePub?.track;

  const isCameraEnabled = participant.isCameraEnabled ?? false;
  const isMicEnabled = participant.isMicrophoneEnabled ?? false;

  return (
    <Card className="relative overflow-hidden w-full h-full bg-black border-0">
      {videoTrack && (isCameraEnabled || isScreenShare) ? (
        <VideoTrack track={videoTrack} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-white text-2xl">
            {participant.name?.[0] || participant.identity[0]}
          </div>
        </div>
      )}

      {Array.from(participant.audioTrackPublications.values()).map((pub) => (
        pub.track && !isLocal && <AudioTrack key={pub.trackSid} track={pub.track} />
      ))}

      <div className="absolute bottom-2 left-2 flex gap-2">
        <Badge variant={isLocal ? 'default' : 'secondary'}>
          {participant.name || participant.identity}
        </Badge>
        <Badge variant={isMicEnabled ? 'default' : 'destructive'}>
          {isMicEnabled ? '🎤' : '🔇'}
        </Badge>
        <Badge variant={isCameraEnabled ? 'default' : 'destructive'}>
          {isCameraEnabled ? '📹' : '📷'}
        </Badge>
      </div>
    </Card>
  );
}