import { delay } from 'roadhog-api-doc';

const datasets = {
  one: 1,
  two: 2,
};

const proxy = {
  'GET /polling/1': (req, res) => {
    datasets.two = 1;
    datasets.one += 1;
    res.json(datasets.one);
  },
  'GET /polling/2': (req, res) => {
    datasets.one = 1;
    datasets.two += 1;
    res.json(datasets.two);
  },
};

export default delay(proxy, 2000);
