export type HeartBeator<T> = {
  poll: Function
  cancel: Function
  onSuccess(data: T): void
  onError(err: any): void
  onStop: Function
}

export const createHeartBeator = <T>({
  api,
  delay = 3000,
  onSucess,
  onError,
  onStop,
}: {
  api?(): Promise<{ data: T }>
  delay?: number
  onSucess?(data: T): void
  onError?(data: T): void
  onStop?(data: T): boolean // time to stop long pooling
}) => {
  // tslint:disable-next-line
  let interval: number | null = null
  let canceled = false
  const heartbeator = {
    poll() {
      if (!api) {
        return
      }
      api()
        .then(res => heartbeator.onSuccess(res.data))
        .catch(heartbeator.onError)
    },
    cancel() {
      console.info('Cancel Poll manualy')
      canceled = true
      interval = null
    },
    onSuccess(data: T) {
      // 判断是否到达停止阈值条件
      if (canceled) {
        heartbeator.onStop()
        return
      }
      if (onStop && onStop(data)) {
        heartbeator.onStop()
        // 达到阈值不再执行
        return
      }
      // 收到回复后再次发出请求
      interval = window.setTimeout(heartbeator.poll, delay)
      if (onSucess) {
        onSucess(data)
      }
    },
    onError(err: any) {
      // 中断链接
      // 清空定时器
      console.error('Poll error')
      interval = null
      if (onError) {
        onError(err)
      }
    },
    onStop() {
      // 中断链接
      // 清空定时器
      console.info('Stop Poll manualy')
      interval = null
    },
  }
  return heartbeator
}
