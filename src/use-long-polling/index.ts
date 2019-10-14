import { useState, useEffect, useRef } from 'react'

import { createHeartBeator, HeartBeator } from '~utils/api'

const useHeartbeat = <T>({
  defaultDeaded = true,
  delay = 3000,
  api,
  onStop,
  onSuccess,
}: {
  defaultDeaded: boolean
  delay?: number
  api(): Promise<{ data: T }> // is long pooling function
  onStop(data: T): boolean
  onSuccess?(data: T): void
}) => {
  // Is kill the pooling?
  const [deaded, setDeaded] = useState<boolean>(defaultDeaded)
  const heartbeator = useRef<HeartBeator<T>>()
  // const savedApi = useRef<() => Promise<{ data: T }>>()

  useEffect(() => {
    heartbeator.current = createHeartBeator({
      api,
      delay,
      onSucess: onSuccess ? onSuccess : () => undefined,
      onStop(data) {
        const isDeaded = onStop(data)
        setDeaded(isDeaded)
        return isDeaded
      },
      onError() {
        setDeaded(true)
      },
    })
  }, [api])

  useEffect(() => {
    function start() {
      if (!heartbeator.current) {
        return
      }
      heartbeator.current.poll()
    }
    function cancel() {
      if (!heartbeator.current) {
        return
      }
      heartbeator.current.cancel()
    }
    if (!deaded) {
      start()
    }

    return () => {
      cancel()
    }
  }, [deaded])

  return {
    deaded,
    setDeaded,
  }
}

export default useHeartbeat
