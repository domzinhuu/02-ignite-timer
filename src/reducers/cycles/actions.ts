import { Cycle } from './reducer'

export enum CycleActionTypes {
  CREATE = 'CREATE',
  INTERRUPT = 'INTERRUPT',
  MARK_CURRENT_CYCLE_AS_FINISHED = 'MARK_CURRENT_CYCLE_AS_FINISHED',
}

export function addNewCyclesAction(newCycle: Cycle) {
  return { type: CycleActionTypes.CREATE, payload: newCycle }
}

export function interruptCycleAction() {
  return { type: CycleActionTypes.INTERRUPT }
}

export function markCurrentCycleAsFinishedAction() {
  return { type: CycleActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED }
}
