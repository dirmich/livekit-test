import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage as ChatMessageType } from '@/types/livekit';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  return (
    <Card className={`p-3 mb-2 ${isOwnMessage ? 'bg-blue-50' : 'bg-gray-50'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Badge variant={isOwnMessage ? 'default' : 'secondary'}>
          {message.senderName}
        </Badge>
        <span className="text-xs text-gray-500">
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm">{message.message}</p>
    </Card>
  );
}
