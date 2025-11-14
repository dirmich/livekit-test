# LiveKit Test Application - 구현 계획

## 프로젝트 개요

### 목적
.env에 지정된 LiveKit 관련 정보를 토대로 다양한 LiveKit 기능을 테스트하는 웹 애플리케이션 구현
- 채팅 기능
- 오디오/비디오 통화 기능
- LiveKit 서버 연결 테스트
- 실시간 통신 기능 검증

### 핵심 가치
- LiveKit SDK의 모든 주요 기능 테스트 가능
- 직관적인 UI/UX로 빠른 테스트 수행
- 실시간 연결 상태 모니터링
- 개발자 친화적인 디버깅 도구 제공

---

## 아키텍처 설계

### 기술 스택

**Frontend**:
- **Runtime**: Bun
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript 5+
- **Styling**: Tailwind CSS 3.4+
- **UI Components**: shadcn/ui
- **State Management**: Zustand (실시간 상태 관리)
- **Forms**: React Hook Form + Zod
- **Real-time**: LiveKit Client SDK

**Backend**:
- **API**: Next.js API Routes / Server Actions
- **Authentication**: LiveKit Access Token 생성
- **Environment**: Bun runtime

**LiveKit Integration**:
- **Client SDK**: livekit-client
- **Server SDK**: livekit-server-sdk
- **Features**:
  - Room management
  - Audio/Video tracks
  - Chat/Data channels
  - Screen sharing
  - Connection quality monitoring

**DevOps**:
- **Testing**: Vitest + Playwright
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript strict mode
- **Version Control**: Git

### 폴더 구조

```
livekit-test/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (main)/              # Main route group
│   │   │   ├── page.tsx         # Landing/Dashboard
│   │   │   ├── layout.tsx       # Main layout
│   │   │   └── chat/            # Chat test page
│   │   │       └── page.tsx
│   │   ├── room/                # Video room pages
│   │   │   └── [roomName]/
│   │   │       └── page.tsx
│   │   ├── api/                 # API Routes
│   │   │   ├── token/           # Token generation
│   │   │   │   └── route.ts
│   │   │   └── rooms/           # Room management
│   │   │       └── route.ts
│   │   ├── layout.tsx           # Root layout
│   │   └── globals.css          # Global styles
│   ├── components/
│   │   ├── ui/                  # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── input.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   └── ...
│   │   └── features/            # Feature components
│   │       ├── chat/
│   │       │   ├── ChatMessage.tsx
│   │       │   ├── ChatInput.tsx
│   │       │   └── ChatContainer.tsx
│   │       ├── video/
│   │       │   ├── VideoTrack.tsx
│   │       │   ├── AudioTrack.tsx
│   │       │   ├── ParticipantView.tsx
│   │       │   └── RoomControls.tsx
│   │       └── connection/
│   │           ├── ConnectionStatus.tsx
│   │           └── QualityIndicator.tsx
│   ├── lib/
│   │   ├── livekit/             # LiveKit utilities
│   │   │   ├── client.ts        # Client setup
│   │   │   ├── hooks.ts         # Custom hooks
│   │   │   └── token.ts         # Token utilities
│   │   ├── utils.ts             # General utilities
│   │   └── config.ts            # App configuration
│   ├── hooks/
│   │   ├── use-room.ts          # Room management hook
│   │   ├── use-participants.ts  # Participants hook
│   │   ├── use-chat.ts          # Chat hook
│   │   └── use-media-devices.ts # Media devices hook
│   ├── store/
│   │   ├── room-store.ts        # Room state (Zustand)
│   │   └── ui-store.ts          # UI state
│   └── types/
│       ├── livekit.ts           # LiveKit types
│       └── index.ts             # Common types
├── tests/
│   ├── unit/                    # Vitest unit tests
│   └── e2e/                     # Playwright E2E tests
├── .env.example                 # Example environment variables
├── .env.local                   # Local environment (gitignored)
├── bun.lockb                    # Bun lockfile
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── vitest.config.ts
└── playwright.config.ts
```

---

## 환경 변수 설계

```bash
# .env.example
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

---

## 데이터 모델

### TypeScript Types

```typescript
// src/types/livekit.ts

export interface RoomConfig {
  name: string;
  maxParticipants?: number;
  emptyTimeout?: number;
  metadata?: string;
}

export interface ParticipantInfo {
  identity: string;
  name: string;
  metadata?: string;
  isCameraEnabled: boolean;
  isMicEnabled: boolean;
  isScreenSharing: boolean;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
}

export interface ConnectionState {
  status: 'disconnected' | 'connecting' | 'connected' | 'reconnecting';
  quality: 'excellent' | 'good' | 'poor';
  latency?: number;
}

export interface MediaDeviceInfo {
  deviceId: string;
  label: string;
  kind: 'audioinput' | 'videoinput' | 'audiooutput';
}
```

---

## API 설계

### REST API Endpoints

```typescript
// GET /api/token
// Generate LiveKit access token
Request: {
  roomName: string;
  participantName: string;
  metadata?: string;
}
Response: {
  token: string;
  url: string;
}

// GET /api/rooms
// List active rooms
Response: {
  rooms: Array<{
    name: string;
    numParticipants: number;
    creationTime: number;
  }>;
}

// POST /api/rooms
// Create a new room
Request: {
  name: string;
  maxParticipants?: number;
}
Response: {
  room: RoomConfig;
}

// DELETE /api/rooms/:roomName
// Delete a room
Response: {
  success: boolean;
}
```

---

## 구현 순서 (TDD 기반)

### Phase 1: 프로젝트 초기화 ✅

#### [x] 1.1. Bun + Next.js 14 프로젝트 생성
```bash
bun create next-app@latest . --typescript --tailwind --app
```

**Test**: 프로젝트가 정상적으로 생성되고 `bun dev`가 실행되는지 확인

**Implementation**:
- Next.js 14 설치
- TypeScript 설정
- Tailwind CSS 설정

**Validation**:
```bash
bun dev
# http://localhost:3000 접속 확인
```

---

#### [x] 1.2. shadcn/ui 설치 및 기본 컴포넌트 추가
```bash
bunx shadcn-ui@latest init
bunx shadcn-ui@latest add button input card badge toast
```

**Test**: shadcn/ui 컴포넌트가 정상적으로 렌더링되는지 확인

**Implementation**:
- shadcn/ui 초기화
- 기본 UI 컴포넌트 설치
- `components/ui/` 폴더 생성 확인

**Validation**:
```typescript
// app/page.tsx에서 테스트
import { Button } from '@/components/ui/button';
<Button>Test Button</Button>
```

---

#### [x] 1.3. ESLint + Prettier 설정
**Test**: 코드 스타일 규칙이 적용되는지 확인

**Implementation**:
```bash
bun add -d prettier eslint-config-prettier eslint-plugin-prettier
```

```json
// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "printWidth": 100,
  "trailingComma": "es5"
}
```

**Validation**:
```bash
bun run lint
```

---

#### [x] 1.4. Vitest 설정
**Test**: 테스트 실행 환경 구성

**Implementation**:
```bash
bun add -d vitest @vitest/ui @testing-library/react @testing-library/jest-dom jsdom
```

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
});
```

**Validation**:
```bash
bun test
```

---

#### [x] 1.5. 환경 변수 설정
**Test**: 환경 변수가 정상적으로 로드되는지 확인

**Implementation**:
```bash
# .env.local 생성
LIVEKIT_URL=wss://your-livekit-server.com
LIVEKIT_API_KEY=your-api-key
LIVEKIT_API_SECRET=your-api-secret
```

```typescript
// src/lib/config.ts
export const config = {
  livekit: {
    url: process.env.LIVEKIT_URL!,
    apiKey: process.env.LIVEKIT_API_KEY!,
    apiSecret: process.env.LIVEKIT_API_SECRET!,
  },
} as const;
```

**Test Code**:
```typescript
// tests/unit/config.test.ts
import { describe, it, expect } from 'vitest';
import { config } from '@/lib/config';

describe('Config', () => {
  it('should load LiveKit configuration', () => {
    expect(config.livekit.url).toBeDefined();
    expect(config.livekit.apiKey).toBeDefined();
    expect(config.livekit.apiSecret).toBeDefined();
  });
});
```

---

### Phase 2: LiveKit 기본 연결 구현

#### [x] 2.1. LiveKit SDK 설치
**Test**: LiveKit SDK가 정상적으로 설치되는지 확인

**Implementation**:
```bash
bun add livekit-client livekit-server-sdk
```

**Validation**:
```typescript
import { Room } from 'livekit-client';
// 타입 오류 없이 import 되는지 확인
```

---

#### [x] 2.2. Access Token 생성 API 구현
**Test**: 유효한 LiveKit access token이 생성되는지 확인

**Test Code**:
```typescript
// tests/unit/token.test.ts
import { describe, it, expect } from 'vitest';
import { generateToken } from '@/lib/livekit/token';

describe('LiveKit Token Generation', () => {
  it('should generate valid token', async () => {
    const token = await generateToken('test-room', 'test-user');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('should include room name in token', async () => {
    const token = await generateToken('my-room', 'user1');
    // Token decode 및 검증
    expect(token).toContain('my-room');
  });
});
```

**Implementation**:
```typescript
// src/lib/livekit/token.ts
import { AccessToken } from 'livekit-server-sdk';
import { config } from '@/lib/config';

export async function generateToken(
  roomName: string,
  participantName: string,
  metadata?: string
): Promise<string> {
  const at = new AccessToken(config.livekit.apiKey, config.livekit.apiSecret, {
    identity: participantName,
    metadata,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish: true,
    canSubscribe: true,
  });

  return at.toJwt();
}
```

```typescript
// src/app/api/token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { generateToken } from '@/lib/livekit/token';
import { config } from '@/lib/config';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const roomName = searchParams.get('roomName');
  const participantName = searchParams.get('participantName');

  if (!roomName || !participantName) {
    return NextResponse.json(
      { error: 'roomName and participantName are required' },
      { status: 400 }
    );
  }

  try {
    const token = await generateToken(roomName, participantName);
    return NextResponse.json({
      token,
      url: config.livekit.url,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to generate token' }, { status: 500 });
  }
}
```

**Validation**:
```bash
# API 테스트
curl "http://localhost:3000/api/token?roomName=test&participantName=user1"
```

---

#### [x] 2.3. Room 연결 Hook 구현
**Test**: Room에 정상적으로 연결되는지 확인

**Test Code**:
```typescript
// tests/unit/use-room.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useRoom } from '@/hooks/use-room';

describe('useRoom Hook', () => {
  it('should connect to room successfully', async () => {
    const { result } = renderHook(() => useRoom());

    await result.current.connect('test-room', 'test-user');

    await waitFor(() => {
      expect(result.current.connectionState).toBe('connected');
    });
  });

  it('should disconnect from room', async () => {
    const { result } = renderHook(() => useRoom());

    await result.current.connect('test-room', 'test-user');
    result.current.disconnect();

    expect(result.current.connectionState).toBe('disconnected');
  });
});
```

**Implementation**:
```typescript
// src/hooks/use-room.ts
import { useState, useCallback, useEffect } from 'react';
import { Room, RoomEvent, ConnectionState } from 'livekit-client';
import { config } from '@/lib/config';

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

        // Fetch token from API
        const response = await fetch(
          `/api/token?roomName=${roomName}&participantName=${participantName}`
        );
        const { token, url } = await response.json();

        // Connect to room
        await room.connect(url, token);
        setConnectionState(ConnectionState.Connected);
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
```

---

### Phase 3: 채팅 기능 구현

#### [x] 3.1. Chat Message Type 정의
**Test**: 메시지 타입이 올바르게 정의되는지 확인

**Test Code**:
```typescript
// tests/unit/chat-types.test.ts
import { describe, it, expect } from 'vitest';
import type { ChatMessage } from '@/types/livekit';

describe('Chat Message Type', () => {
  it('should have required fields', () => {
    const message: ChatMessage = {
      id: '1',
      senderId: 'user1',
      senderName: 'User 1',
      message: 'Hello',
      timestamp: Date.now(),
    };

    expect(message.id).toBeDefined();
    expect(message.senderId).toBeDefined();
    expect(message.message).toBeDefined();
  });
});
```

**Implementation**: Phase 1에서 정의된 타입 사용

---

#### [ ] 3.2. Chat Hook 구현
**Test**: 채팅 메시지 송수신이 정상적으로 동작하는지 확인

**Test Code**:
```typescript
// tests/unit/use-chat.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChat } from '@/hooks/use-chat';
import { Room } from 'livekit-client';

describe('useChat Hook', () => {
  it('should send chat message', async () => {
    const mockRoom = new Room();
    const { result } = renderHook(() => useChat(mockRoom));

    await act(async () => {
      await result.current.sendMessage('Hello World');
    });

    expect(result.current.messages).toHaveLength(1);
    expect(result.current.messages[0].message).toBe('Hello World');
  });

  it('should receive chat messages', async () => {
    const mockRoom = new Room();
    const { result } = renderHook(() => useChat(mockRoom));

    // Simulate receiving message
    // ... test implementation
  });
});
```

**Implementation**:
```typescript
// src/hooks/use-chat.ts
import { useState, useCallback, useEffect } from 'react';
import { Room, RoomEvent, DataPacket_Kind } from 'livekit-client';
import type { ChatMessage } from '@/types/livekit';

const encoder = new TextEncoder();
const decoder = new TextDecoder();

export function useChat(room: Room | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const sendMessage = useCallback(
    async (message: string) => {
      if (!room || !message.trim()) return;

      const chatMessage: ChatMessage = {
        id: crypto.randomUUID(),
        senderId: room.localParticipant.identity,
        senderName: room.localParticipant.name || room.localParticipant.identity,
        message: message.trim(),
        timestamp: Date.now(),
      };

      const data = encoder.encode(JSON.stringify(chatMessage));
      await room.localParticipant.publishData(data, DataPacket_Kind.RELIABLE);

      setMessages((prev) => [...prev, chatMessage]);
    },
    [room]
  );

  useEffect(() => {
    if (!room) return;

    const handleDataReceived = (
      payload: Uint8Array,
      participant?: any,
      kind?: DataPacket_Kind
    ) => {
      if (kind === DataPacket_Kind.RELIABLE) {
        const message: ChatMessage = JSON.parse(decoder.decode(payload));
        setMessages((prev) => [...prev, message]);
      }
    };

    room.on(RoomEvent.DataReceived, handleDataReceived);

    return () => {
      room.off(RoomEvent.DataReceived, handleDataReceived);
    };
  }, [room]);

  return {
    messages,
    sendMessage,
  };
}
```

---

#### [ ] 3.3. Chat UI Components 구현
**Test**: 채팅 컴포넌트가 정상적으로 렌더링되는지 확인

**Test Code**:
```typescript
// tests/unit/ChatContainer.test.tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { ChatContainer } from '@/components/features/chat/ChatContainer';

describe('ChatContainer', () => {
  it('should render chat messages', () => {
    const messages = [
      {
        id: '1',
        senderId: 'user1',
        senderName: 'User 1',
        message: 'Hello',
        timestamp: Date.now(),
      },
    ];

    render(<ChatContainer messages={messages} onSendMessage={() => {}} />);

    expect(screen.getByText('Hello')).toBeInTheDocument();
    expect(screen.getByText('User 1')).toBeInTheDocument();
  });
});
```

**Implementation**:
```typescript
// src/components/features/chat/ChatMessage.tsx
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
```

```typescript
// src/components/features/chat/ChatInput.tsx
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSend(message);
      setMessage('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        disabled={disabled}
        className="flex-1"
      />
      <Button type="submit" disabled={disabled || !message.trim()}>
        Send
      </Button>
    </form>
  );
}
```

```typescript
// src/components/features/chat/ChatContainer.tsx
import { useRef, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import type { ChatMessage as ChatMessageType } from '@/types/livekit';

interface ChatContainerProps {
  messages: ChatMessageType[];
  onSendMessage: (message: string) => void;
  currentUserId: string;
  disabled?: boolean;
}

export function ChatContainer({
  messages,
  onSendMessage,
  currentUserId,
  disabled,
}: ChatContainerProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <Card className="flex flex-col h-full p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            message={msg}
            isOwnMessage={msg.senderId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>
      <ChatInput onSend={onSendMessage} disabled={disabled} />
    </Card>
  );
}
```

---

#### [ ] 3.4. Chat Test Page 구현
**Test**: 채팅 페이지가 정상적으로 동작하는지 확인

**Implementation**:
```typescript
// src/app/(main)/chat/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ChatContainer } from '@/components/features/chat/ChatContainer';
import { ConnectionStatus } from '@/components/features/connection/ConnectionStatus';
import { useRoom } from '@/hooks/use-room';
import { useChat } from '@/hooks/use-chat';

export default function ChatPage() {
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const { room, connectionState, connect, disconnect } = useRoom();
  const { messages, sendMessage } = useChat(room);

  const handleJoin = async () => {
    if (roomName && userName) {
      await connect(roomName, userName);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">LiveKit Chat Test</h1>

      <ConnectionStatus state={connectionState} className="mb-4" />

      {connectionState === 'disconnected' ? (
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Join Chat Room</h2>
          <div className="space-y-4">
            <Input
              placeholder="Room Name"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
            <Input
              placeholder="Your Name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <Button onClick={handleJoin} className="w-full">
              Join Room
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Room: {roomName}</h2>
            <Button variant="destructive" onClick={disconnect}>
              Leave Room
            </Button>
          </div>
          <div className="h-[600px]">
            <ChatContainer
              messages={messages}
              onSendMessage={sendMessage}
              currentUserId={room?.localParticipant.identity || ''}
              disabled={connectionState !== 'connected'}
            />
          </div>
        </div>
      )}
    </div>
  );
}
```

---

### Phase 4: 오디오/비디오 기능 구현

#### [ ] 4.1. Media Devices Hook 구현
**Test**: 미디어 디바이스 목록을 가져올 수 있는지 확인

**Test Code**:
```typescript
// tests/unit/use-media-devices.test.ts
import { describe, it, expect, vi } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { useMediaDevices } from '@/hooks/use-media-devices';

describe('useMediaDevices Hook', () => {
  it('should fetch media devices', async () => {
    const { result } = renderHook(() => useMediaDevices());

    await waitFor(() => {
      expect(result.current.devices).toBeDefined();
    });
  });

  it('should categorize devices correctly', async () => {
    const { result } = renderHook(() => useMediaDevices());

    await waitFor(() => {
      expect(result.current.audioInputs).toBeDefined();
      expect(result.current.videoInputs).toBeDefined();
      expect(result.current.audioOutputs).toBeDefined();
    });
  });
});
```

**Implementation**:
```typescript
// src/hooks/use-media-devices.ts
import { useState, useEffect } from 'react';
import type { MediaDeviceInfo as DeviceInfo } from '@/types/livekit';

export function useMediaDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        setDevices(deviceList as MediaDeviceInfo[]);
      } catch (err) {
        setError(err as Error);
      }
    };

    fetchDevices();

    navigator.mediaDevices.addEventListener('devicechange', fetchDevices);
    return () => {
      navigator.mediaDevices.removeEventListener('devicechange', fetchDevices);
    };
  }, []);

  const audioInputs = devices.filter((d) => d.kind === 'audioinput');
  const videoInputs = devices.filter((d) => d.kind === 'videoinput');
  const audioOutputs = devices.filter((d) => d.kind === 'audiooutput');

  return {
    devices,
    audioInputs,
    videoInputs,
    audioOutputs,
    error,
  };
}
```

---

#### [ ] 4.2. Participants Hook 구현
**Test**: 참가자 목록을 추적할 수 있는지 확인

**Test Code**:
```typescript
// tests/unit/use-participants.test.ts
import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useParticipants } from '@/hooks/use-participants';
import { Room } from 'livekit-client';

describe('useParticipants Hook', () => {
  it('should track participants', () => {
    const mockRoom = new Room();
    const { result } = renderHook(() => useParticipants(mockRoom));

    expect(result.current.participants).toBeDefined();
  });
});
```

**Implementation**:
```typescript
// src/hooks/use-participants.ts
import { useState, useEffect } from 'react';
import { Room, RoomEvent, RemoteParticipant } from 'livekit-client';

export function useParticipants(room: Room | null) {
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  useEffect(() => {
    if (!room) {
      setParticipants([]);
      return;
    }

    const updateParticipants = () => {
      setParticipants(Array.from(room.participants.values()));
    };

    updateParticipants();

    room.on(RoomEvent.ParticipantConnected, updateParticipants);
    room.on(RoomEvent.ParticipantDisconnected, updateParticipants);

    return () => {
      room.off(RoomEvent.ParticipantConnected, updateParticipants);
      room.off(RoomEvent.ParticipantDisconnected, updateParticipants);
    };
  }, [room]);

  return {
    participants,
    localParticipant: room?.localParticipant,
  };
}
```

---

#### [ ] 4.3. Video Track Component 구현
**Test**: 비디오 트랙이 정상적으로 렌더링되는지 확인

**Implementation**:
```typescript
// src/components/features/video/VideoTrack.tsx
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
      className={`w-full h-full object-cover ${className}`}
      autoPlay
      playsInline
      muted={track.kind === Track.Kind.Video}
    />
  );
}
```

---

#### [ ] 4.4. Participant View Component 구현
**Test**: 참가자 뷰가 정상적으로 렌더링되는지 확인

**Implementation**:
```typescript
// src/components/features/video/ParticipantView.tsx
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
```

---

#### [ ] 4.5. Room Controls Component 구현
**Test**: 미디어 제어 버튼이 정상적으로 동작하는지 확인

**Implementation**:
```typescript
// src/components/features/video/RoomControls.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Room } from 'livekit-client';

interface RoomControlsProps {
  room: Room;
  onLeave: () => void;
}

export function RoomControls({ room, onLeave }: RoomControlsProps) {
  const [isCameraEnabled, setIsCameraEnabled] = useState(true);
  const [isMicEnabled, setIsMicEnabled] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);

  const toggleCamera = async () => {
    await room.localParticipant.setCameraEnabled(!isCameraEnabled);
    setIsCameraEnabled(!isCameraEnabled);
  };

  const toggleMic = async () => {
    await room.localParticipant.setMicrophoneEnabled(!isMicEnabled);
    setIsMicEnabled(!isMicEnabled);
  };

  const toggleScreenShare = async () => {
    if (isScreenSharing) {
      await room.localParticipant.setScreenShareEnabled(false);
    } else {
      await room.localParticipant.setScreenShareEnabled(true);
    }
    setIsScreenSharing(!isScreenSharing);
  };

  return (
    <div className="flex gap-2 justify-center p-4 bg-gray-900">
      <Button
        variant={isCameraEnabled ? 'default' : 'destructive'}
        onClick={toggleCamera}
      >
        {isCameraEnabled ? '📹 Camera On' : '📷 Camera Off'}
      </Button>
      <Button variant={isMicEnabled ? 'default' : 'destructive'} onClick={toggleMic}>
        {isMicEnabled ? '🎤 Mic On' : '🔇 Mic Off'}
      </Button>
      <Button
        variant={isScreenSharing ? 'secondary' : 'outline'}
        onClick={toggleScreenShare}
      >
        {isScreenSharing ? '🖥️ Stop Sharing' : '🖥️ Share Screen'}
      </Button>
      <Button variant="destructive" onClick={onLeave}>
        Leave Room
      </Button>
    </div>
  );
}
```

---

#### [ ] 4.6. Video Room Page 구현
**Test**: 비디오 룸이 정상적으로 동작하는지 확인

**Implementation**:
```typescript
// src/app/room/[roomName]/page.tsx
'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ParticipantView } from '@/components/features/video/ParticipantView';
import { RoomControls } from '@/components/features/video/RoomControls';
import { ConnectionStatus } from '@/components/features/connection/ConnectionStatus';
import { useRoom } from '@/hooks/use-room';
import { useParticipants } from '@/hooks/use-participants';

export default function RoomPage() {
  const params = useParams();
  const router = useRouter();
  const roomName = params.roomName as string;
  const { room, connectionState, connect, disconnect } = useRoom();
  const { participants, localParticipant } = useParticipants(room);

  useEffect(() => {
    const userName = prompt('Enter your name:');
    if (userName) {
      connect(roomName, userName);
    } else {
      router.push('/');
    }
  }, [roomName, connect, router]);

  const handleLeave = () => {
    disconnect();
    router.push('/');
  };

  if (connectionState !== 'connected') {
    return (
      <div className="flex items-center justify-center h-screen">
        <ConnectionStatus state={connectionState} />
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-gray-950">
      <div className="p-4 bg-gray-900 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-white">Room: {roomName}</h1>
      </div>

      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4 overflow-auto">
        {localParticipant && (
          <ParticipantView participant={localParticipant} isLocal />
        )}
        {participants.map((participant) => (
          <ParticipantView key={participant.sid} participant={participant} />
        ))}
      </div>

      <RoomControls room={room!} onLeave={handleLeave} />
    </div>
  );
}
```

---

### Phase 5: UI/UX 개선 (shadcn/ui)

#### [ ] 5.1. Landing Page 구현
**Test**: 랜딩 페이지가 정상적으로 렌더링되는지 확인

**Implementation**:
```typescript
// src/app/page.tsx
'use client';

import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold mb-4">LiveKit Test Application</h1>
        <p className="text-xl text-gray-600">
          Test LiveKit features including chat, audio, and video
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">💬 Chat Test</h2>
          <p className="text-gray-600 mb-4">
            Test real-time chat functionality using LiveKit's data channels
          </p>
          <Link href="/chat">
            <Button className="w-full">Start Chat Test</Button>
          </Link>
        </Card>

        <Card className="p-6 hover:shadow-lg transition-shadow">
          <h2 className="text-2xl font-semibold mb-3">📹 Video/Audio Test</h2>
          <p className="text-gray-600 mb-4">
            Test audio and video communication with screen sharing
          </p>
          <Link href="/room/test-room">
            <Button className="w-full">Start Video Test</Button>
          </Link>
        </Card>
      </div>

      <Card className="mt-8 p-6 bg-blue-50">
        <h3 className="text-xl font-semibold mb-2">Configuration</h3>
        <p className="text-sm text-gray-700">
          LiveKit URL: {process.env.NEXT_PUBLIC_LIVEKIT_URL || 'Not configured'}
        </p>
      </Card>
    </div>
  );
}
```

---

#### [ ] 5.2. Connection Status Component 구현
**Test**: 연결 상태가 정확하게 표시되는지 확인

**Implementation**:
```typescript
// src/components/features/connection/ConnectionStatus.tsx
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
```

---

#### [ ] 5.3. Dark Mode 지원
**Test**: 다크 모드가 정상적으로 동작하는지 확인

**Implementation**:
```typescript
// src/app/layout.tsx
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'LiveKit Test App',
  description: 'Testing LiveKit features including chat and video',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
```

---

### Phase 6: 테스트 및 최적화

#### [ ] 6.1. E2E 테스트 설정 (Playwright)
**Test**: E2E 테스트가 정상적으로 실행되는지 확인

**Implementation**:
```bash
bun add -d @playwright/test
```

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command: 'bun dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

#### [ ] 6.2. Chat Flow E2E 테스트
**Test**: 채팅 플로우가 E2E로 정상 동작하는지 확인

**Implementation**:
```typescript
// tests/e2e/chat.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Chat Feature', () => {
  test('should join chat room and send message', async ({ page }) => {
    await page.goto('/chat');

    await expect(page.getByRole('heading', { name: 'LiveKit Chat Test' })).toBeVisible();

    await page.fill('input[placeholder="Room Name"]', 'test-room');
    await page.fill('input[placeholder="Your Name"]', 'Test User');
    await page.click('button:has-text("Join Room")');

    await expect(page.getByText('Room: test-room')).toBeVisible();

    await page.fill('input[placeholder="Type a message..."]', 'Hello World');
    await page.click('button:has-text("Send")');

    await expect(page.getByText('Hello World')).toBeVisible();
  });
});
```

---

#### [ ] 6.3. Performance 최적화
**Test**: Lighthouse 성능 점수 확인

**Implementation**:
- Next.js Image 최적화
- Dynamic imports for heavy components
- React.memo, useMemo, useCallback 적용
- Tailwind CSS purge 설정

```typescript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['your-domain.com'],
  },
  experimental: {
    optimizePackageImports: ['livekit-client'],
  },
};

module.exports = nextConfig;
```

---

#### [ ] 6.4. 보안 검토
**Test**: 보안 취약점 스캔

**Implementation**:
- 환경 변수 검증
- CORS 설정
- Rate limiting
- Input sanitization

```typescript
// src/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Add security headers
  const response = NextResponse.next();

  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');

  return response;
}
```

---

## 테스트 커버리지 목표

- **Unit Tests**: 80% 이상
- **Integration Tests**: 주요 플로우 커버
- **E2E Tests**: 핵심 사용자 시나리오

---

## 성능 목표

- **First Contentful Paint**: < 1.5s
- **Largest Contentful Paint**: < 2.5s
- **Time to Interactive**: < 3.5s
- **Cumulative Layout Shift**: < 0.1

---

## 다음 단계

1. "go" 명령 대기
2. plan.md의 체크리스트 순서대로 TDD 사이클 진행
3. 각 단계마다 테스트 작성 → 구현 → 리팩토링
4. 모든 테스트 통과 후 커밋

---

## 주의사항

- ✅ Bun 명령어만 사용
- ✅ TDD Red-Green-Refactor 사이클 준수
- ✅ 테스트 없이 코드 작성 금지
- ✅ 커밋 전 lint + test 실행
- ✅ rule.md의 모든 규칙 준수
- ✅ shadcn/ui 컴포넌트 최대 활용
- ✅ Tailwind utility-first 접근
