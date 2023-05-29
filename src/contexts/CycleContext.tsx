import { createContext, useEffect, useReducer, useState } from 'react'
import { Cycle, cycleReducer } from '../reducers/cycles/reducer'
import {
  addNewCyclesAction,
  interruptCycleAction,
  markCurrentCycleAsFinishedAction,
} from '../reducers/cycles/actions'
import { differenceInSeconds } from 'date-fns'

interface NewCicleForm {
  task: string
  minutesAmount: number
}

interface CycleContextProps {
  activeCycle: Cycle | undefined
  cycles: Cycle[]
  activeCycleId: string | null
  amountSecondsPassed: number
  markCurrentCycleAsFinished: () => void
  createNewCycle: (data: NewCicleForm) => void
  interruptCycle: () => void
  updateSecondsPassed: (seconds: number) => void
}

export const CycleContext = createContext({} as CycleContextProps)

export const CycleContextProvider = ({ children }: any) => {
  const [cyclesState, dispatch] = useReducer(
    cycleReducer,
    {
      cycles: [],
      activeCycleId: null,
    },
    (innitalState) => {
      const storedStateAsJson = localStorage.getItem(
        '@ignite-time:cycle-state-1.0.0',
      )

      if (storedStateAsJson) {
        return JSON.parse(storedStateAsJson)
      } else {
        return innitalState
      }
    },
  )
  const { cycles, activeCycleId } = cyclesState
  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(() => {
    if (activeCycle) {
      return differenceInSeconds(new Date(), new Date(activeCycle.startDate))
    }

    return 0
  })
  useEffect(() => {
    const stateJSON = JSON.stringify(cyclesState)
    localStorage.setItem('@ignite-time:cycle-state-1.0.0', stateJSON)
  }, [cyclesState])

  function markCurrentCycleAsFinished() {
    dispatch(markCurrentCycleAsFinishedAction())
  }

  function createNewCycle(data: NewCicleForm) {
    const newCycle: Cycle = {
      id: String(Date.now()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }
    dispatch(addNewCyclesAction(newCycle))
  }

  function interruptCycle() {
    dispatch(interruptCycleAction())
  }

  function updateSecondsPassed(seconds: number) {
    setAmountSecondsPassed(seconds)
  }

  return (
    <CycleContext.Provider
      value={{
        activeCycle,
        cycles,
        activeCycleId,
        amountSecondsPassed,
        markCurrentCycleAsFinished,
        createNewCycle,
        interruptCycle,
        updateSecondsPassed,
      }}
    >
      {children}
    </CycleContext.Provider>
  )
}
