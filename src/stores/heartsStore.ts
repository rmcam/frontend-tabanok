import { create } from 'zustand';

interface HeartsStore {
  hearts: number;
  setHearts: (newHearts: number) => void;
  decrementHeart: () => void;
  incrementHeart: () => void;
  resetHearts: () => void;
}

export const useHeartsStore = create<HeartsStore>((set) => ({
  hearts: 5, // Valor inicial de vidas
  setHearts: (newHearts) => set({ hearts: newHearts }),
  decrementHeart: () => set((state) => ({ hearts: Math.max(0, state.hearts - 1) })),
  incrementHeart: () => set((state) => ({ hearts: state.hearts + 1 })),
  resetHearts: () => set({ hearts: 5 }), // Reiniciar a un valor por defecto
}));
