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
  const videoTrack = participant.videoTracks.values().next().value?.track;
  const audioTrack = participant.audioTracks.values().next().value?.track;

  const isCameraEnabled = participant.isCameraEnabled;
  const isMicEnabled = participant.isMicrophoneEnabled;

  return (
    <Card className="relative overflow-hidden aspect-video bg-gray-900">
      {videoTrack && isCameraEnabled ? (
        <VideoTrack track={videoTrack} />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-white text-2xl">
            {participant.name?.[0] || participant.identity[0]}
          </div>
        </div>
      )}

      {audioTrack && !isLocal && <AudioTrack track={audioTrack} />}

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