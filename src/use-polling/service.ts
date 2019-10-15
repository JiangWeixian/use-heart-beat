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
  let polling = false
  const heartbeator = {
    poll() {
      if (!api) {
        return
      }
      timer = window.setInterval(() => {
        polling = true
        api()
          .then(res => {
            heartbeator.onSuccess(res)
          })
          .catch(heartbeator.onError)
      }, delay)
    },
    restart() {
      console.info('Restart Poll')
      polling = false
      // disconnect & clear
      timer && window.clearInterval(timer)
      timer = null
    },
    cancel() {
      console.info('Cancel Poll')
      polling = false
      // disconnect & clear
      canceled = true
      timer && window.clearInterval(timer)
      timer = null
    },
    onSuccess(data: T) {
      polling = false
      if (canceled) {
        heartbeator.onStop()
        return
      }
      // if stop
      if (isStop && isStop(data)) {
        heartbeator.onStop()
        return
      }
      if (onSucess && !polling && !canceled) {
        onSucess(data)
      }
    },
    onError(err: Error) {
      console.error('Poll error')
      polling = false
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
