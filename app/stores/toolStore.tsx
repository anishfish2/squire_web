import { create } from 'zustand'

export interface Tool {
  id: string
  tool: string
  iconPath: string
  functions: { name: string; time: string }[]
}

export interface ToolStore {
  centeredTool: Tool | null
  setCenteredTool: (tool: Tool | null) => void
  handleClick: ((id: string) => void) | null
  setHandleClick: (fn: ((id: string) => void) | null) => void
}

export const useToolStore = create<ToolStore>((set) => ({
  centeredTool: null,
  setCenteredTool: (tool) => set({ centeredTool: tool }),
  handleClick: null,
  setHandleClick: (fn) => set({ handleClick: fn }),
}))
