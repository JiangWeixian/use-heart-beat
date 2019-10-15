import axios, { Canceler } from 'axios';

let canceler: Canceler;

export const polling = {
  async polling(id: string): Promise<number> {
    return axios.get(`/polling/${id}`, {}).then(res => res.data);
  },
  async longpolling(id: string): Promise<number> {
    canceler && canceler();
    return axios
      .get(`/polling/${id}`, {
        cancelToken: new axios.CancelToken(c => {
          canceler = c;
        }),
      })
      .then(res => res.data);
  },
};
