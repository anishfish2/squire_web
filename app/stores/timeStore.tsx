import { create } from 'zustand'

interface TimeStore {
  time: number
  setTime: (addedTime: number) => void
}

export const useTimeStore = create<TimeStore>((set) => ({
  time: 0,
  setTime: (addedTime) => set((state) => ({ time: state.time + addedTime })),
}))

export default useTimeStore
