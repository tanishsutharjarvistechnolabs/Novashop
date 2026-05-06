import { create } from 'zustand'

interface LoaderState {
    isLoading: boolean
    message?: string
    setLoading: (val: boolean) => void
    setMessage?: (msg: string) => void
}

export const useLoaderStore = create<LoaderState>((set) => ({
    isLoading: false,
    message: "",
    setLoading: (val: boolean) => set({ isLoading: val }),
    setMessage: (msg: string) => set({ message: msg }),
}))