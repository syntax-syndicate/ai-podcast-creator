import { create } from "zustand";

interface PlayerState {
  playingBlockId: string | null;
  isPlaying: boolean;
  audio: HTMLAudioElement | null;
  play: (blockId: string, audioUrl: string) => void;
  pause: () => void;
  togglePlayback: (blockId: string, audioUrl: string) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  playingBlockId: null,
  isPlaying: false,
  audio: typeof window !== "undefined" ? new Audio() : null,

  play: (blockId, audioUrl) => {
    const { audio } = get();
    if (!audio) return;

    if (get().playingBlockId === blockId && get().isPlaying) return;

    if (get().playingBlockId !== blockId && get().isPlaying) {
      get().pause();
    }

    audio.src = audioUrl;
    audio.play().catch((err) => console.error("Error playing audio:", err));

    set({ playingBlockId: blockId, isPlaying: true });

    audio.onended = () => set({ isPlaying: false });
  },

  pause: () => {
    const { audio } = get();
    if (audio) {
      audio.pause();
      set({ isPlaying: false });
    }
  },

  togglePlayback: (blockId, audioUrl) => {
    const { playingBlockId, isPlaying, play, pause } = get();

    if (playingBlockId === blockId && isPlaying) {
      pause();
    } else {
      play(blockId, audioUrl);
    }
  },
}));
