import { create } from 'zustand';

type Camera = {
  cameraStore: { x: number; y: number; zoom: number };
  setCameraStore: (value: { x: number; y: number; zoom: number }) => void;
};

export const useCameraStore = create<Camera>((set) => ({
  cameraStore: { x: 0, y: 0, zoom: 1 },
  setCameraStore: (value) => set({ cameraStore: value }),
}));
