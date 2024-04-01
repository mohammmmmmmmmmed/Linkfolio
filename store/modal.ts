import { create } from 'zustand';

type AllowedModals = 'signup' | 'signin' | 'setup';

interface ModalState {
  active: boolean;
  setActive: (active: boolean) => void;
  type: AllowedModals;
  setType: (type: 'signup' | 'signin' | 'setup') => void;
}

export const useGenerationStore = create<ModalState>()((set) => ({
  active: false,
  setActive: (active: boolean) => set({ active }),
  type: 'signup',
  setType: (type: AllowedModals) => set({ type }),
}));
