import { Badge } from '@/components/ui/badge';
import { ConnectionState } from 'livekit-client';

interface ConnectionStatusProps {
  state: ConnectionState | string;
  className?: string;
}

interface StatusConfig {
  color: string;
  text: string;
}

const STATUS_MAP: Record<string, StatusConfig> = {
  connected: { color: 'bg-green-500', text: 'Connected' },
  connecting: { color: 'bg-yellow-500', text: 'Connecting...' },
  reconnecting: { color: 'bg-orange-500', text: 'Reconnecting...' },
  disconnected: { color: 'bg-red-500', text: 'Disconnected' },
};

export function ConnectionStatus({ state, className }: ConnectionStatusProps) {
  const normalizeState = (state: ConnectionState | string): string => {
    if (state === ConnectionState.Connected) return 'connected';
    if (state === ConnectionState.Connecting) return 'connecting';
    if (state === ConnectionState.Reconnecting) return 'reconnecting';
    if (typeof state === 'string') return state;
    return 'disconnected';
  };

  const statusKey = normalizeState(state);
  const config = STATUS_MAP[statusKey] || STATUS_MAP.disconnected;

  return (
    <Badge className={`${config.color} text-white ${className}`}>
      <span className="inline-block w-2 h-2 rounded-full bg-white mr-2 animate-pulse" />
      {config.text}
    </Badge>
  );
}