import { useState, useEffect } from 'react';

export function useMediaDevices() {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        setDevices(deviceList);
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