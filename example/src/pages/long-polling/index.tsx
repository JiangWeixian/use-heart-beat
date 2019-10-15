import React, { useState, useCallback } from 'react';
import { useLongPolling } from 'use-heart-beat';
import { Button } from 'antd';

import { api } from '@/api';

export default () => {
  const [id, setId] = useState<string>('1');
  const fetch = useCallback(async () => {
    return api.polling.request(id);
  }, [id]);
  const { data } = useLongPolling<number>({ id, api: fetch, delay: 1000 });
  return (
    <>
      <span>{data}</span>
      <Button onClick={() => setId(id === '1' ? '2' : '1')}>改变ID</Button>
    </>
  );
};
