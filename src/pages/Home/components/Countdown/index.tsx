import { useContext, useEffect, useState } from 'react'
import { CountDownContainer, Separator } from './styles'
import { differenceInSeconds } from 'date-fns'
import { CycleContext } from '../../../../contexts/CycleContext'

export function CountyDown() {
  const [amountSecondsPassed, setAmountSecondsPassed] = useState<number>(0)

  const { activeCycleId, activeCycle, markCurrentCycleAsFinished } =
    useContext(CycleContext)

  const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0
  const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0
  const minutesAmount = Math.floor(currentSeconds / 60)
  const secondsAmount = currentSeconds % 60

  const minutes = String(minutesAmount).padStart(2, '0')
  const seconds = String(secondsAmount).padStart(2, '0')

  useEffect(() => {
    if (activeCycle) {
      document.title = `${activeCycle.task} - ${minutes}:${seconds}`
    } else {
      document.title = 'Ignite Timer'
    }
  }, [minutes, seconds, activeCycle])

  useEffect(() => {
    let interval: number
    if (activeCycle) {
      interval = setInterval(() => {
        const diffInSeconds = differenceInSeconds(
          new Date(),
          activeCycle.startDate,
        )

        if (diffInSeconds >= totalSeconds) {
          markCurrentCycleAsFinished()
          clearInterval(interval)
          setAmountSecondsPassed(0)
        } else {
          setAmountSecondsPassed(diffInSeconds)
        }
      }, 1000)
    }

    return () => {
      setAmountSecondsPassed(0)
      clearInterval(interval)
    }
  }, [
    activeCycle,
    activeCycleId,
    totalSeconds,
    setAmountSecondsPassed,
    markCurrentCycleAsFinished,
  ])
  return (
    <CountDownContainer>
      <span>{minutes[0]}</span>
      <span>{minutes[1]}</span>
      <Separator>:</Separator>
      <span>{seconds[0]}</span>
      <span>{seconds[1]}</span>
    </CountDownContainer>
  )
}
