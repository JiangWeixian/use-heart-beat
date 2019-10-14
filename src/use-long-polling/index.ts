import { useState, useEffect, useCallback, useMemo } from 'react'

import { createHeartBeator, CreateHeartBeatorProps } from './service'

export type UsePollingProps<T = any> = {
  id: string
  defaultDead: boolean
} & CreateHeartBeatorProps<T>

export const useLongPolling = <T>(props: UsePollingProps<T>) => {
  const [data, setData] = useState<T>()
  const [dead, setDead] = useState<boolean>(!!props.defaultDead)
  const handleSuccess = useCallback(
    (value: T) => {
      setData(value)
      props.onSucess && props.onSucess(value)
    },
    [props.id, props.onSucess],
  )
  const heatbeator = useMemo(() => {
    return createHeartBeator({ ...props, onSucess: handleSuccess })
  }, [props.id])
  useEffect(() => {
    if (!heatbeator) {
      return
    }
    if (dead) {
      heatbeator.cancel()
      return
    }
    setData(undefined)
    heatbeator.restart()
    heatbeator.poll()
    return () => heatbeator.cancel()
  }, [props.id, dead])
  return {
    data,
    dead,
    setDead,
  }
}
