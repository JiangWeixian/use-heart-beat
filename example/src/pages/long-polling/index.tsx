import React, { useState, useCallback } from 'react';
import { useLongPolling } from 'use-heart-beat';
import { Button } from 'antd';

import { api } from '@/api';

export default () => {
  const [id, setId] = useState<string>('1');
  const fetch = useCallback(async () => {
    return api.polling.longpolling(id);
  }, [id]);
  console.log(id);
  const { data } = useLongPolling<number>({ api: fetch, delay: 1000, deaded: id === '2' });
  return (
    <>
      <span>{data}</span>
      <Button onClick={() => setId(id === '1' ? '2' : '1')}>改变ID</Button>
    </>
  );
};
