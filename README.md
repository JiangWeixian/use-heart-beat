<!--
  Title: use-heart-beat
  Description: polling and long-polling request in react hooks
  Author: JiangWeixian
  -->

# use-heart-beat
![Version](https://img.shields.io/npm/v/use-heart-beat?style=for-the-badge)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](#)
[![Twitter: jiangweixian](https://img.shields.io/twitter/follow/jiangweixian.svg?style=for-the-badge)](https://twitter.com/jiangweixian)

> polling request in react hooks

## Install

```sh
npm install use-heart-beat --save
```

## Usage
> see more [props](/docs/use-heart-beat.md)

### use-polling

```tsx
import React, { useState, useCallback } from 'react';
import { usePolling } from 'use-heart-beat';

import { api } from '@/api';

export default () => {
  const fetch = useCallback(async () => {
    return api.polling.polling(id);
  }, []);
  const { data } = usePolling<number>({ id: 'polling-example', api: fetch, delay: 1000 });
  return (
    <>
      <span>{data}</span>
    </>
  );
};
```

### use-long-polling

```tsx
import React, { useState, useCallback } from 'react';
import { useLongPolling } from 'use-heart-beat';

import { api } from '@/api';

export default () => {
  const fetch = useCallback(async () => {
    return api.polling.longpolling(id);
  }, []);
  const { data } = useLongPolling<number>({ id: 'long-polling-example', api: fetch, delay: 1000 });
  return (
    <>
      <span>{data}</span>
    </>
  );
};
```

## Author

👤 **JW**

* Twitter: [@jiangweixian](https://twitter.com/jiangweixian)
* Github: [@JiangWeixian](https://github.com/JiangWeixian)

## Show your support

Give a ⭐️ if this project helped you!

<a href="https://www.patreon.com/jiangweixian">
  <img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>


***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
