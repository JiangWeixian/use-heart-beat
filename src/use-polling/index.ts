import { useState, useEffect, useCallback, useRef } from 'react'

import { createHeartBeator, CreateHeartBeatorProps } from './service'
import { HeartBeator } from '@/typings'

export type UsePollingProps<T = any> = {
  id: string
  isDeaded?: boolean
} & CreateHeartBeatorProps<T>

export const usePolling = <T>(props: UsePollingProps<T>) => {
  const [data, setData] = useState<T>()
  const [deaded, setDeaded] = useState<boolean>(!!props.isDeaded)
  const heatbeator = useRef<HeartBeator<T>>()
  const handleSuccess = useCallback(
    (value: T) => {
      setData(value)
      props.onSucess && props.onSucess(value)
    },
    [props.id, props.onSucess],
  )
  useEffect(() => {
    setDeaded(!!props.isDeaded)
  }, [props.isDeaded])
  useEffect(() => {
    // cancel prev heatbeator
    heatbeator.current && heatbeator.current.cancel()
    if (deaded) {
      return
    }
    heatbeator.current = createHeartBeator({ ...props, onSucess: handleSuccess })
    setData(undefined)
    heatbeator.current && heatbeator.current.restart()
    heatbeator.current && heatbeator.current.poll()
    return () => heatbeator.current && heatbeator.current.cancel()
  }, [props.id, deaded])
  return {
    data,
    deaded,
    setDeaded,
  }
}
