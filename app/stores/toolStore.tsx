import { create } from 'zustand'

export const useToolStore = create((set) => ({
  centeredTool: null,
  setCenteredTool: (tool) => set({ centeredTool: tool }),
  handleClick: null,
  setHandleClick: (fn) => set({ handleClick: fn }),
}))
