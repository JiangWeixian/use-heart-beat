import { useState, useEffect, useCallback, useRef, useMemo } from 'react'

import { createHeartBeator, CreateHeartBeatorProps } from './service'
import { HeartBeator } from '@/typings'

export type UsePollingProps<T = any> = {
  id: string
  deaded?: boolean
  defaultDeaded?: boolean
} & CreateHeartBeatorProps<T>

export const usePolling = <T>(props: UsePollingProps<T>) => {
  const [data, setData] = useState<T>()
  const [deaded, setDeaded] = useState<boolean>(!!props.deaded)
  const heatbeator = useRef<HeartBeator<T>>()
  const finalDeaded = useMemo(() => {
    return props.deaded !== undefined ? props.deaded : deaded
  }, [props.deaded, deaded])
  const handleSuccess = useCallback(
    (value: T) => {
      setData(value)
      props.onSucess && props.onSucess(value)
    },
    [props.onSucess, props.id],
  )
  useEffect(() => {
    // cancel prev heatbeator
    heatbeator.current && heatbeator.current.cancel()
    if (finalDeaded || !props.id) {
      return heatbeator.current && heatbeator.current.cancel()
    }
    heatbeator.current = createHeartBeator({ ...props, onSucess: handleSuccess })
    setData(undefined)
    heatbeator.current && heatbeator.current.restart()
    heatbeator.current && heatbeator.current.poll()
    return () => heatbeator.current && heatbeator.current.cancel()
  }, [finalDeaded, props.id])
  return {
    data,
    deaded: finalDeaded,
    setDeaded,
  }
}
