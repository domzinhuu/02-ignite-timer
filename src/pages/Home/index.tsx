import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  HomeContainer,
  StartCoutdownButton,
  StopCoutdownButton,
} from './styles'
import { useState } from 'react'
import { NewCycleForm } from './components/NewCycleForm'
import { CountyDown } from './components/Countdown'
import { Cycle, CycleContext } from '../../contexts/CycleContext'

const newCicleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
})

type NewCicleFormData = zod.infer<typeof newCicleFormValidationSchema>

export function Home() {
  const [cycles, setCycles] = useState<Cycle[]>([])
  const [activeCycleId, setActiveCycleId] = useState<string | null>(null)

  const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId)

  const newCycleForm = useForm<NewCicleFormData>({
    resolver: zodResolver(newCicleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })

  function handleCreateNewCicle(data: NewCicleFormData) {
    const newCycle: Cycle = {
      id: String(Date.now()),
      task: data.task,
      minutesAmount: data.minutesAmount,
      startDate: new Date(),
    }

    setActiveCycleId(newCycle.id)
    setCycles((prevState) => [...prevState, newCycle])
    reset()
  }

  function handleInterruptCycle() {
    setCycles((prevState) => {
      const newCycles = prevState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          cycle.interruptDate = new Date()
        }

        return cycle
      })
      return newCycles
    })

    setActiveCycleId(null)
  }

  function markCurrentCycleAsFinished(): void {
    setCycles((prevState: Cycle[]) => {
      const newCycles = prevState.map((cycle) => {
        if (cycle.id === activeCycleId) {
          cycle.finishedDate = new Date()
        }

        return cycle
      })
      return newCycles
    })
    setActiveCycleId(null)
  }

  const { handleSubmit, watch, reset } = newCycleForm
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
    <CycleContext.Provider
      value={{
        activeCycle,
        cycles,
        markCurrentCycleAsFinished,
        activeCycleId,
      }}
    >
      <HomeContainer>
        <form onSubmit={handleSubmit(handleCreateNewCicle)}>
          <FormProvider {...newCycleForm}>
            <NewCycleForm />
          </FormProvider>

          <CountyDown />

          {activeCycle ? (
            <StopCoutdownButton type="button" onClick={handleInterruptCycle}>
              <HandPalm size={24} />
              Interromper
            </StopCoutdownButton>
          ) : (
            <StartCoutdownButton disabled={isSubmitDisabled} type="submit">
              <Play size={24} />
              Começar
            </StartCoutdownButton>
          )}
        </form>
      </HomeContainer>
    </CycleContext.Provider>
  )
}
