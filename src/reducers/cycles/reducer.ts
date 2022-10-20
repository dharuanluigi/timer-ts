import { produce } from 'immer'
import { ActionTypes } from './actions'

export interface Cycle {
  id: string
  task: string
  minutesAmount: number
  createdAt: Date
  interruptedAt?: Date
  finishedAt?: Date
}

interface CyclesState {
  cycles: Cycle[]
  activeCycleId: string | null
}

export function cyclesReducer(state: CyclesState, action: any) {
  switch (action.type) {
    case ActionTypes.ADD_NEW_CYCLE:
      return produce(state, (draft) => {
        draft.cycles.push(action.payload.newCycle)
        draft.activeCycleId = action.payload.newCycle.id
      })

    case ActionTypes.INTERRUPT_CURRENT_CYCLE: {
      const currentActiveCycleId = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentActiveCycleId < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentActiveCycleId].interruptedAt = new Date()
      })
    }

    case ActionTypes.MARK_CURRENT_CYCLE_AS_FINISHED: {
      const currentActiveCycleId = state.cycles.findIndex(
        (cycle) => cycle.id === state.activeCycleId,
      )

      if (currentActiveCycleId < 0) {
        return state
      }

      return produce(state, (draft) => {
        draft.activeCycleId = null
        draft.cycles[currentActiveCycleId].finishedAt = new Date()
      })
    }
    default:
      return state
  }
}
