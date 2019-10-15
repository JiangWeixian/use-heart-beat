import { useState, useEffect, useCallback, useRef } from 'react'

import { createHeartBeator, CreateHeartBeatorProps } from './service'
import { HeartBeator } from '@/typings'

export type UsePollingProps<T = any> = {
  id: string
  defaultDead?: boolean
} & CreateHeartBeatorProps<T>

export const usePolling = <T>(props: UsePollingProps<T>) => {
  const [data, setData] = useState<T>()
  const [dead, setDead] = useState<boolean>(!!props.defaultDead)
  const heatbeator = useRef<HeartBeator<T>>()
  const handleSuccess = useCallback(
    (value: T) => {
      setData(value)
      props.onSucess && props.onSucess(value)
    },
    [props.id, props.onSucess],
  )
  useEffect(() => {
    // cancel prev heatbeator
    heatbeator.current && heatbeator.current.cancel()
    if (dead) {
      return
    }
    heatbeator.current = createHeartBeator({ ...props, onSucess: handleSuccess })
    setData(undefined)
    heatbeator.current && heatbeator.current.restart()
    heatbeator.current && heatbeator.current.poll()
    return () => heatbeator.current && heatbeator.current.cancel()
  }, [props.id, dead])
  return {
    data,
    dead,
    setDead,
  }
}
