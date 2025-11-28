'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Video, MessageSquare, Users, Plus, RefreshCw, User, LogOut } from 'lucide-react';

interface Room {
  name: string;
  sid: string;
  numParticipants: number;
  creationTime: number;
}

export default function HomePage() {
  const router = useRouter();
  const [rooms, setRooms] = useState<Room[]>([]);
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchRooms = async () => {
    try {
      setIsRefreshing(true);
      const res = await fetch('/api/rooms');
      if (res.ok) {
        const data = await res.json();
        setRooms(data);
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRooms();
    const savedName = localStorage.getItem('livekit-username');
    if (savedName) {
      setUserName(savedName);
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (userName.trim()) {
      localStorage.setItem('livekit-username', userName.trim());
      setIsLoggedIn(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserName('');
    localStorage.removeItem('livekit-username');
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (newRoomName.trim() && userName.trim()) {
      router.push(`/room/${encodeURIComponent(newRoomName.trim())}?participantName=${encodeURIComponent(userName.trim())}`);
    }
  };

  const handleJoinRoom = (roomName: string) => {
    if (userName.trim()) {
      router.push(`/room/${encodeURIComponent(roomName)}?participantName=${encodeURIComponent(userName.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-6xl pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="relative z-10 max-w-4xl w-full">
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-6xl font-bold tracking-tight mb-2">
            <span className="text-gradient">LiveKit</span> Lobby
          </h1>
          <p className="text-xl text-muted-foreground">
            {isLoggedIn
              ? `Welcome back, ${userName}`
              : 'Enter your name to get started'}
          </p>
        </div>

        {!isLoggedIn ? (
          /* Login Screen */
          <Card className="p-8 glass-panel border-0 max-w-md mx-auto">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-xl bg-green-500/20 text-green-400">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold text-white">Your Identity</h2>
            </div>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <label htmlFor="userName" className="text-sm font-medium text-gray-300">
                  Display Name
                </label>
                <Input
                  id="userName"
                  placeholder="Enter your name..."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-12 text-lg"
                  autoFocus
                />
              </div>
              <Button
                type="submit"
                disabled={!userName.trim()}
                className="w-full h-12 text-lg bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-500/25 border-0"
              >
                Enter Lobby
              </Button>
            </form>
          </Card>
        ) : (
          /* Dashboard Screen */
          <div className="space-y-6">
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={handleLogout}
                className="text-gray-400 hover:text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Change Name
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Create Room Section */}
              <Card className="p-8 glass-panel border-0 h-full">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400">
                    <Plus className="w-6 h-6" />
                  </div>
                  <h2 className="text-2xl font-bold text-white">Create Room</h2>
                </div>
                <form onSubmit={handleCreateRoom} className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="roomName" className="text-sm font-medium text-gray-300">
                      Room Name
                    </label>
                    <Input
                      id="roomName"
                      placeholder="Enter room name..."
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      className="bg-black/20 border-white/10 text-white placeholder:text-gray-500 h-12"
                    />
                  </div>
                  <Button
                    type="submit"
                    disabled={!newRoomName.trim()}
                    className="w-full h-12 text-lg bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-500/25 border-0"
                  >
                    Create & Join
                  </Button>
                </form>
              </Card>

              {/* Active Rooms List */}
              <Card className="p-8 glass-panel border-0 h-full flex flex-col">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400">
                      <Users className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Active Rooms</h2>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={fetchRooms}
                    disabled={isRefreshing}
                    className="hover:bg-white/10 text-gray-400 hover:text-white"
                  >
                    <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
                  </Button>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar min-h-[200px]">
                  {isLoading ? (
                    <div className="text-center py-8 text-gray-500">Loading rooms...</div>
                  ) : rooms.length === 0 ? (
                    <div className="text-center py-8 text-gray-500 flex flex-col items-center gap-2">
                      <MessageSquare className="w-8 h-8 opacity-20" />
                      <p>No active rooms found.</p>
                      <p className="text-sm">Create one to get started!</p>
                    </div>
                  ) : (
                    rooms.map((room) => (
                      <div
                        key={room.sid}
                        onClick={() => handleJoinRoom(room.name)}
                        className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between"
                      >
                        <div>
                          <h3 className="font-semibold text-white group-hover:text-blue-400 transition-colors">
                            {room.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            Created {new Date(room.creationTime * 1000).toLocaleTimeString()}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 bg-black/20 px-3 py-1 rounded-full text-xs">
                          <Users className="w-3 h-3" />
                          <span>{room.numParticipants}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
