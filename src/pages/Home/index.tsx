import { HandPalm, Play } from 'phosphor-react'
import { FormProvider, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as zod from 'zod'
import {
  HomeContainer,
  StartCoutdownButton,
  StopCoutdownButton,
} from './styles'
import { NewCycleForm } from './components/NewCycleForm'
import { CountyDown } from './components/Countdown'
import { CycleContext } from '../../contexts/CycleContext.tsx'
import { useContext } from 'react'

const newCicleFormValidationSchema = zod.object({
  task: zod.string().min(1, 'Informe a tarefa'),
  minutesAmount: zod.number().min(5).max(60),
})

type NewCicleFormData = zod.infer<typeof newCicleFormValidationSchema>

export function Home() {
  const { activeCycle, createNewCycle, interruptCycle } =
    useContext(CycleContext)
  const newCycleForm = useForm<NewCicleFormData>({
    resolver: zodResolver(newCicleFormValidationSchema),
    defaultValues: {
      task: '',
      minutesAmount: 5,
    },
  })

  function handleCreateNewCicle(data: NewCicleFormData) {
    createNewCycle(data)
    reset()
  }

  function handleInterruptCycle() {
    interruptCycle()
  }

  const { handleSubmit, watch, reset } = newCycleForm
  const task = watch('task')
  const isSubmitDisabled = !task

  return (
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
  )
}
