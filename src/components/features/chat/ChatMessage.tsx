import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { ChatMessage as ChatMessageType } from '@/types/livekit';

interface ChatMessageProps {
  message: ChatMessageType;
  isOwnMessage: boolean;
}

export function ChatMessage({ message, isOwnMessage }: ChatMessageProps) {
  return (
    <div className={`p-3 mb-2 rounded-lg shadow-sm ${isOwnMessage ? 'bg-blue-500/40 text-blue-50' : 'bg-black/40 text-gray-100'}`}>
      <div className="flex items-center gap-2 mb-1">
        <Badge variant={isOwnMessage ? 'default' : 'secondary'} className={isOwnMessage ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-700 hover:bg-gray-600'}>
          {message.senderName}
        </Badge>
        <span className={`text-xs ${isOwnMessage ? 'text-blue-200/70' : 'text-gray-400'}`}>
          {new Date(message.timestamp).toLocaleTimeString()}
        </span>
      </div>
      <p className="text-sm leading-relaxed break-words">{message.message}</p>
    </div>
  );
}
