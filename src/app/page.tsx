'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, Users, Sparkles, Globe } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { LanguageSelector } from '@/components/features/i18n/LanguageSelector';

interface RoomInfo {
  name: string;
  numParticipants: number;
  creationTime: number;
}

export default function Home() {
  const router = useRouter();
  const { t } = useLanguage();
  const [rooms, setRooms] = useState<RoomInfo[]>([]);
  const [newRoomName, setNewRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Fetch active rooms
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await fetch('/api/rooms');
        const data = await response.json();
        setRooms(data);
      } catch (error) {
        console.error('Failed to fetch rooms:', error);
      }
    };

    fetchRooms();
    const interval = setInterval(fetchRooms, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      setIsLoggedIn(true);
    }
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && userName.trim()) {
      router.push(`/room/${encodeURIComponent(newRoomName)}?participantName=${encodeURIComponent(userName)}`);
    }
  };

  const handleJoinRoom = (roomName: string) => {
    if (userName.trim()) {
      router.push(`/room/${encodeURIComponent(roomName)}?participantName=${encodeURIComponent(userName)}`);
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        {/* Language Toggle */}
        <div className="absolute top-4 right-4 z-50">
          <LanguageSelector />
        </div>

        <Card className="w-full max-w-md p-8 bg-white/5 backdrop-blur-xl border-white/10 relative z-10">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 animate-float">
              <Video className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">{t.home.title}</h1>
            <p className="text-gray-400 text-center">{t.home.enterName}</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="text"
                placeholder={t.home.namePlaceholder}
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-12 text-lg text-center focus-visible:ring-blue-500/50"
                autoFocus
              />
            </div>
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-medium text-lg shadow-lg shadow-blue-500/25 transition-all hover:scale-[1.02]"
              disabled={!userName.trim()}
            >
              {t.home.login}
            </Button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-4 md:p-8 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-600/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-600/10 rounded-full blur-[150px]" />
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Video className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">{t.home.title}</h1>
              <p className="text-gray-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                {t.home.welcome} <span className="text-white font-medium">{userName}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Language Toggle */}
            <LanguageSelector />

            <div className="flex items-center gap-2 bg-white/5 px-4 py-2 rounded-full border border-white/10">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-medium">{rooms.reduce((acc, room) => acc + room.numParticipants, 0)} Online</span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-[350px_1fr] gap-8">
          {/* Create Room Section */}
          <div className="space-y-6">
            <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-500/20 rounded-lg">
                  <Sparkles className="w-5 h-5 text-blue-400" />
                </div>
                <h2 className="text-lg font-semibold">{t.home.createRoom}</h2>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <Input
                  placeholder={t.home.roomNamePlaceholder}
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 focus-visible:ring-blue-500/50"
                />
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                  disabled={!newRoomName.trim()}
                >
                  {t.home.create}
                </Button>
              </form>
            </Card>

            <div className="p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5">
              <h3 className="text-sm font-medium text-gray-300 mb-2">{t.home.tip}</h3>
              <p className="text-xs text-gray-400 leading-relaxed">
                {t.home.tipDescription}
              </p>
            </div>
          </div>

          {/* Active Rooms List */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                {t.home.activeRooms}
                <span className="text-sm font-normal text-gray-500 bg-white/5 px-2 py-0.5 rounded-full ml-2">
                  {rooms.length}
                </span>
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {rooms.map((room) => (
                <Card
                  key={room.name}
                  className="group p-5 bg-white/5 hover:bg-white/10 backdrop-blur-md border-white/10 transition-all hover:scale-[1.02] hover:border-blue-500/30 cursor-pointer"
                  onClick={() => handleJoinRoom(room.name)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="font-medium text-lg text-white group-hover:text-blue-400 transition-colors">
                      {room.name}
                    </h3>
                    <span className="flex items-center gap-1.5 text-xs font-medium bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                      Live
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <Users className="w-4 h-4" />
                        {room.numParticipants}
                      </span>
                      <span className="text-xs opacity-50">
                        {new Date(room.creationTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 -mr-2">
                      {t.home.join} →
                    </Button>
                  </div>
                </Card>
              ))}

              {rooms.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-20 text-gray-500 border-2 border-dashed border-white/10 rounded-2xl bg-white/5">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mb-4">
                    <Video className="w-8 h-8 opacity-20" />
                  </div>
                  <p>{t.home.noActiveRooms}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
