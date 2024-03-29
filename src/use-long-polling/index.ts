import { useState, useEffect, useRef, useMemo } from 'react'

import { createHeartBeator, CreateHeartBeatorProps } from './service'
import { HeartBeator } from '@/typings'

export type UsePollingProps<T = any> = {
  id: string | number
  deaded?: boolean
  defaultDeaded?: boolean
  defaultData?: T
} & CreateHeartBeatorProps<T>

export const useLongPolling = <T>(props: UsePollingProps<T>) => {
  const [data, setData] = useState<T | undefined>(props.defaultData)
  const [deaded, setDeaded] = useState<boolean>(!!props.deaded)
  const heatbeator = useRef<HeartBeator<T>>()
  const finalDeaded = useMemo(() => {
    return props.deaded !== undefined ? props.deaded : deaded
  }, [props.deaded, deaded])
  const handleSuccess = (value: T) => {
    setData(value)
    props.onSucess && props.onSucess(value)
  }
  useEffect(() => {
    // cancel prev heatbeator
    setData(props.defaultData)
    heatbeator.current && heatbeator.current.cancel()
    if (finalDeaded || !props.id) {
      return heatbeator.current && heatbeator.current.cancel()
    }
    heatbeator.current = createHeartBeator({ ...props, onSucess: handleSuccess })
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
