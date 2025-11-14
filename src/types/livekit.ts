export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: number;
}

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
