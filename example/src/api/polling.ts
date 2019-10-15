import axios from 'axios';

export const polling = {
  async request(id: string): Promise<number> {
    return axios.get(`/polling/${id}`, {}).then(res => res.data);
  },
};
