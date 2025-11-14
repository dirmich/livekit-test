// Server-side configuration
// Only expose NEXT_PUBLIC_ prefixed variables to client

export const serverConfig = {
  livekit: {
    apiKey: process.env.LIVEKIT_API_KEY!,
    apiSecret: process.env.LIVEKIT_API_SECRET!, // Never expose to client
  },
};

export const publicConfig = {
  livekit: {
    url: process.env.NEXT_PUBLIC_LIVEKIT_URL!,
  },
};