import { create } from 'zustand';
import { Data } from '../types/data';

export type User = {
  name: string;
  weight: string;
  age: string;
  height: string;
  level: string;
  objective: string;
  gender: string;
};

type DataState = {
  user: User;
  plan: Data | null;
  setPageOne: (data: Omit<User, 'gender' | 'objective' | 'level'>) => void;
  setPageTwo: (data: Pick<User, 'gender' | 'objective' | 'level'>) => void;
  setPlan: (plan: Data) => void;
};

export const useDataStore = create<DataState>((set) => ({
  user: {
    name: '',
    age: '',
    level: '',
    objective: '',
    gender: '',
    weight: '',
    height: '',
  },
  plan: null,
  setPageOne: (data) => set((state) => ({ user: { ...state.user, ...data } })),
  setPageTwo: (data) => set((state) => ({ user: { ...state.user, ...data } })),
  setPlan: (plan) => set(() => ({ plan })),
}));
