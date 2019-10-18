# use-heart-beat

## description

1. `isDeaded` or `deaded in hooks` is `false`, it will stop **polling request**

## props
> `use-polling and use-long-polling` has same `props`

|props|type|description|required|defalut|
|:---|:---|:---|:---|:---|
|api|async () => {}|polling api|true|
|deaded|boolean|enable or disable polling |false|false|
|defaultDeaded|boolean|enable or disable polling in init |false|false|
|delay|number|polling in `delay` ms|false|3000|
|isStop|(value): boolean => {}|stop polling by response data|false||
|onError|(err) => {}|triggered when catch error|false||
|onSuccess|(value) => {}|triggered when successful polling|false||

## return

|props|type|description|defalut|
|:---|:---|:---|:---|
|data||response data|undefined|
|deaded|boolean|polling status|`props.isDeaded`|
|setDeaded|`React.SetStateAction`|set deaded value||