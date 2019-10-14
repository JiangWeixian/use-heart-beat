export type HeartBeator<T> = {
  poll: Function
  cancel: Function
  onSuccess(data: T): void
  onError(err: Error): void
  onStop: Function
}

export type CreateHeartBeatorProps<T = any> = {
  api?(): Promise<T>
  delay?: number
  onSucess?(data: T): void
  onError?(err: Error): void
  isStop?(data: T): boolean // time to stop long pooling
}

export const createHeartBeator = <T>({
  api,
  delay = 3000,
  onSucess,
  onError,
  isStop,
}: CreateHeartBeatorProps<T>) => {
  let timer: number | null
  let canceled = false
  const heartbeator = {
    poll() {
      if (!api) {
        return
      }
      api()
        .then(res => heartbeator.onSuccess(res))
        .catch(heartbeator.onError)
    },
    restart() {
      console.info('Restart Poll')
      timer && window.clearTimeout(timer)
      timer = null
    },
    cancel() {
      console.info('Cancel Poll')
      canceled = true
      timer && window.clearTimeout(timer)
      timer = null
    },
    onSuccess(data: T) {
      // if stop
      if (canceled) {
        heartbeator.onStop()
        return
      }
      if (isStop && isStop(data)) {
        heartbeator.onStop()
        return
      }
      // repoll after success
      timer = window.setTimeout(heartbeator.poll, delay)
      if (onSucess && !canceled) {
        onSucess(data)
      }
    },
    onError(err: any) {
      console.error('Poll error')
      heartbeator.cancel()
      if (onError) {
        onError(err)
      }
    },
    onStop() {
      console.info('Stop Poll')
      heartbeator.cancel()
    },
  }
  return heartbeator
}
