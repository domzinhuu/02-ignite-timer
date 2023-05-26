import { createContext } from 'react'
export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
}

interface CycleContextProps {
  activeCycle: Cycle | undefined
  cycles: Cycle[]
  activeCycleId: string | null
  markCurrentCycleAsFinished: () => void
}
export const CycleContext = createContext({} as CycleContextProps)
