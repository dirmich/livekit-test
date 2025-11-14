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
