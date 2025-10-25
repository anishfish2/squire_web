import { create } from 'zustand'

export const useTimeStore = create((set) => ({
  time: 0,
  setTime: ((addedTime) => set((state) => ({ time : state.time + addedTime}))),
  }))

export default useTimeStore
