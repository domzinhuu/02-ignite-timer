import { CycleActionTypes } from './actions'
import { produce } from 'immer'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  startDate: Date
  interruptDate?: Date
  finishedDate?: Date
}

interface CycleState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cycleReducer(
  state: CycleState,
  action: { type: CycleActionTypes; payload?: any },
) {
  switch (action.type) {
    case CycleActionTypes.CREATE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload)
        draft.activeCycleId = action.payload.id
      })

    case CycleActionTypes.INTERRUPT: {
      const currentCycleIndex = state.cycles.findIndex(
        (c) => c.id === state.activeCycleId,
      )

      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.cycles[currentCycleIndex].interruptDate = new Date()
        draft.activeCycleId = null
      })
    }

    case CycleActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentCycleIndex = state.cycles.findIndex(
        (c) => c.id === state.activeCycleId,
      )
      if (currentCycleIndex < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.cycles[currentCycleIndex].finishedDate = new Date()
        draft.activeCycleId = null
      })
    }

    default:
      return state
  }
}
