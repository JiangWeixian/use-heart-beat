export type HeartBeator<T> = {
  poll: Function
  cancel: Function
  restart: Function
  onSuccess(data: T): void
  onError(err: Error): void
  onStop: Function
}
