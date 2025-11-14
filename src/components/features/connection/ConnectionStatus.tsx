import { Badge } from '@/components/ui/badge';
import { ConnectionState } from 'livekit-client';

interface ConnectionStatusProps {
  state: ConnectionState | string;
  className?: string;
}

export function ConnectionStatus({ state, className }: ConnectionStatusProps) {
  const getStatusColor = () => {
    switch (state) {
      case 'connected':
      case ConnectionState.Connected:
        return 'bg-green-500';
      case 'connecting':
      case ConnectionState.Connecting:
        return 'bg-yellow-500';
      case 'reconnecting':
      case ConnectionState.Reconnecting:
        return 'bg-orange-500';
      default:
        return 'bg-red-500';
    }
  };

  const getStatusText = () => {
    switch (state) {
      case 'connected':
      case ConnectionState.Connected:
        return 'Connected';
      case 'connecting':
      case ConnectionState.Connecting:
        return 'Connecting...';
      case 'reconnecting':
      case ConnectionState.Reconnecting:
        return 'Reconnecting...';
      default:
        return 'Disconnected';
    }
  };

  return (
    <Badge className={`${getStatusColor()} text-white ${className}`}>
      <span className="inline-block w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
      {getStatusText()}
    </Badge>
  );
}