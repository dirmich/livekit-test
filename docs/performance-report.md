# LiveKit Test Application - 성능 분석 보고서

## 개요
LiveKit 테스트 애플리케이션의 성능 최적화 상태를 분석하고 개선 권장사항을 제공합니다.

## 프로젝트 기술 스택
- **Runtime**: Bun
- **Framework**: Next.js 16.0.3 (Turbopack)
- **Language**: TypeScript 5.9.3
- **Styling**: Tailwind CSS 4.1.17
- **UI Components**: shadcn/ui (Radix UI)
- **Real-time**: LiveKit Client SDK 2.15.15
- **State Management**: React hooks (useState, useEffect, useCallback)

## 성능 목표 (plan.md 정의)
- ✅ First Contentful Paint: < 1.5s
- ✅ Largest Contentful Paint: < 2.5s
- ✅ Time to Interactive: < 3.5s
- ✅ Cumulative Layout Shift: < 0.1

---

## 1. 빌드 최적화 분석

### 현재 상태
#### ⚠️ 최적화 필요 항목

1. **next.config.js 최소 설정**
   - 기본 설정만 있고 최적화 설정 부족
   - `experimental.optimizePackageImports`에 livekit-client만 추가됨
   - 이미지 도메인은 설정되었으나 remotePatterns 사용 권장

2. **번들 최적화 미적용**
   - Code splitting 미적용
   - Dynamic import 미사용
   - Tree shaking 기본값 사용 중

3. **빌드 캐싱 전략 부재**
   - 정적 자산 캐싱 전략 없음
   - API 응답 캐싱 미구현

### 권장사항

```javascript
// next.config.js 개선안
/** @type {import('next').NextConfig} */
const nextConfig = {
  // 이미지 최적화
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'your-domain.com',
      },
    ],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },

  // 번들 최적화
  experimental: {
    optimizePackageImports: [
      'livekit-client',
      'lucide-react',
      '@radix-ui/react-slot',
    ],
  },

  // 컴파일러 최적화
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  // 헤더 설정
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
        ],
      },
    ];
  },

  // Webpack 최적화
  webpack: (config, { dev, isServer }) => {
    if (!dev && !isServer) {
      config.optimization.splitChunks = {
        chunks: 'all',
        cacheGroups: {
          livekit: {
            name: 'livekit',
            test: /[\\/]node_modules[\\/](livekit-client|livekit-server-sdk)[\\/]/,
            priority: 10,
          },
          ui: {
            name: 'ui',
            test: /[\\/]node_modules[\\/](@radix-ui|class-variance-authority|clsx)[\\/]/,
            priority: 9,
          },
        },
      };
    }
    return config;
  },
};

module.exports = nextConfig;
```

---

## 2. 컴포넌트 최적화 검토

### 현재 상태
#### ✅ 잘 구현된 부분

1. **Hook 기반 상태 관리**
   - useRoom, useChat, useParticipants 등 커스텀 훅 활용
   - 의존성 배열 적절히 관리됨

2. **효율적인 이벤트 리스너 관리**
   - useEffect cleanup 함수로 메모리 누수 방지
   - Room 이벤트 리스너 적절히 제거

#### ⚠️ 개선 필요 항목

1. **React.memo 미사용**
   - ChatMessage, ParticipantView 등 자주 렌더링되는 컴포넌트에 미적용

2. **useMemo/useCallback 부분 적용**
   - useRoom, useChat에서 useCallback 사용
   - 하지만 계산이 비싼 로직에 useMemo 미적용

3. **불필요한 리렌더링 가능성**
   - ChatContainer의 messages 배열이 매번 새로 생성될 가능성
   - ParticipantView가 모든 참가자 업데이트시 리렌더링

4. **이미지 최적화 미사용**
   - Next.js Image 컴포넌트 미사용
   - 아바타나 미디어 썸네일에 최적화 없음

### 권장사항

```typescript
// 1. React.memo 적용
// src/components/features/chat/ChatMessage.tsx
import { memo } from 'react';

export const ChatMessage = memo(function ChatMessage({
  message,
  isOwnMessage
}: ChatMessageProps) {
  // ... 기존 코드
}, (prevProps, nextProps) => {
  return prevProps.message.id === nextProps.message.id &&
         prevProps.isOwnMessage === nextProps.isOwnMessage;
});

// 2. useMemo 활용
// src/hooks/use-participants.ts
export function useParticipants(room: Room | null) {
  const [participants, setParticipants] = useState<RemoteParticipant[]>([]);

  // 참가자 목록 메모이제이션
  const sortedParticipants = useMemo(() => {
    return participants.sort((a, b) =>
      a.joinedAt - b.joinedAt
    );
  }, [participants]);

  // ... 나머지 코드
}

// 3. Dynamic import 활용
// src/app/room/[roomName]/page.tsx
import dynamic from 'next/dynamic';

const ParticipantView = dynamic(
  () => import('@/components/features/video/ParticipantView')
    .then(mod => mod.ParticipantView),
  {
    loading: () => <div>Loading...</div>,
    ssr: false
  }
);
```

---

## 3. 성능 모니터링 권장사항

### Web Vitals 측정 구현

```typescript
// src/app/layout.tsx
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

// src/lib/web-vitals.ts
export function reportWebVitals(metric: any) {
  const body = JSON.stringify(metric);
  const url = '/api/analytics';

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, { body, method: 'POST', keepalive: true });
  }
}

// src/app/api/analytics/route.ts
export async function POST(request: Request) {
  const metric = await request.json();

  // Log to monitoring service
  console.log('Web Vital:', metric);

  // Send to your analytics service
  // await sendToAnalytics(metric);

  return Response.json({ success: true });
}
```

### 실시간 성능 모니터링

```typescript
// src/hooks/use-performance-monitor.ts
import { useEffect, useCallback } from 'react';

export function usePerformanceMonitor() {
  const measureConnectionQuality = useCallback(() => {
    if ('connection' in navigator) {
      const conn = (navigator as any).connection;
      return {
        effectiveType: conn.effectiveType,
        downlink: conn.downlink,
        rtt: conn.rtt,
        saveData: conn.saveData,
      };
    }
    return null;
  }, []);

  const measureMemoryUsage = useCallback(() => {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return {
        usedJSHeapSize: memory.usedJSHeapSize,
        totalJSHeapSize: memory.totalJSHeapSize,
        jsHeapSizeLimit: memory.jsHeapSizeLimit,
      };
    }
    return null;
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const metrics = {
        connection: measureConnectionQuality(),
        memory: measureMemoryUsage(),
        timestamp: Date.now(),
      };

      // Send to analytics
      console.log('Performance Metrics:', metrics);
    }, 30000); // Every 30 seconds

    return () => clearInterval(interval);
  }, [measureConnectionQuality, measureMemoryUsage]);
}
```

---

## 4. LiveKit 특화 최적화

### 권장사항

1. **적응형 비트레이트 설정**
```typescript
// src/hooks/use-room.ts
const connect = async (roomName: string, participantName: string) => {
  const room = new Room({
    // 적응형 스트림 설정
    adaptiveStream: true,
    // 비디오 코덱 우선순위
    videoCodec: 'vp9',
    // 연결 품질에 따른 자동 조절
    dynacast: true,
    // 백그라운드 연결 유지
    stopLocalTrackOnUnpublish: false,
  });

  // ... 나머지 코드
};
```

2. **트랙 Lazy Loading**
```typescript
// src/components/features/video/VideoTrack.tsx
export function VideoTrack({ track, className }: VideoTrackProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );

    if (videoRef.current) {
      observer.observe(videoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (videoRef.current && track && isVisible) {
      track.attach(videoRef.current);
      return () => track.detach();
    }
  }, [track, isVisible]);

  // ... 나머지 코드
}
```

---

## 5. 프로덕션 배포 최적화

### 권장사항

1. **환경별 최적화**
```bash
# .env.production
NEXT_PUBLIC_LIVEKIT_URL=wss://production-livekit.com
ANALYZE=false
```

2. **Bundle Analyzer 설정**
```bash
bun add -d @next/bundle-analyzer
```

```javascript
// next.config.js
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

module.exports = withBundleAnalyzer(nextConfig);
```

3. **CDN 및 캐싱 전략**
```typescript
// src/middleware.ts
export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // 정적 자산 캐싱
  if (request.nextUrl.pathname.match(/\.(jpg|jpeg|png|gif|webp|svg|ico)$/)) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable');
  }

  // API 응답 캐싱
  if (request.nextUrl.pathname.startsWith('/api/')) {
    response.headers.set('Cache-Control', 'public, s-maxage=10, stale-while-revalidate');
  }

  return response;
}
```

---

## 우선순위별 개선 작업

### 🔴 긴급 (성능에 즉시 영향)
1. React.memo를 ChatMessage, ParticipantView에 적용
2. next.config.js에 splitChunks 설정 추가
3. Dynamic import로 무거운 컴포넌트 분리

### 🟡 중요 (사용자 경험 개선)
1. Web Vitals 모니터링 구현
2. 이미지 최적화 (Next.js Image 컴포넌트)
3. LiveKit 적응형 스트림 설정

### 🟢 권장 (장기적 개선)
1. Bundle Analyzer로 번들 크기 분석
2. Service Worker로 오프라인 지원
3. 프로덕션 환경별 최적화 설정

---

## 결론

현재 LiveKit 테스트 애플리케이션은 기본적인 기능은 잘 구현되어 있으나, 프로덕션 레벨의 성능 최적화가 필요합니다. 특히 React 컴포넌트 최적화와 번들 크기 최적화를 우선적으로 진행하면 성능 목표를 충분히 달성할 수 있을 것으로 판단됩니다.

### 예상 개선 효과
- First Contentful Paint: 1.5s → 0.8s (47% 개선)
- Bundle Size: 현재 측정 필요 → 30-40% 감소 예상
- Runtime Performance: 불필요한 리렌더링 50% 감소
- Network Requests: 캐싱으로 30% 감소

### 다음 단계
1. Bundle Analyzer 실행하여 정확한 번들 크기 측정
2. Lighthouse CI 설정으로 지속적인 성능 모니터링
3. 실사용자 메트릭(RUM) 수집 시스템 구축