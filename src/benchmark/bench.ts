import { performance } from 'perf_hooks'

const measunres: { [key: string]: number[] } = {}

interface Options {
    samples?: number,
    before?: () => any,
    after?: () => any
}

const getMax = (numArray: number[]) => Math.max.apply(null, numArray)
const getMin = (numArray: number[]) => Math.min.apply(null, numArray)

export const bench = (id: string, fn: (payload: any) => void, opts?: Options) => {
  const options = {
    samples: 10000,
    before: () => {},
    after: () => {},
    ...opts
  }

  if (measunres[id] === undefined) measunres[id] = [];

  for (let i = 0; i < options.samples; i++) {
    const payload = options.before();
    const start = performance.now();
    fn(payload);
    measunres[id].push(performance.now() - start)
  }

  const min = getMin(measunres[id]);
  const max = getMax(measunres[id]);
  const mid = measunres[id].reduce((acc, curr) => acc + curr, 0) / measunres[id].length;

  // console.log(measunres[id].sort((a, b) => a - b))
  // console.log(measunres[id])
  const errorPerc = getMax([mid - min, max - mid]) / mid * 100;

  const opSec = 1000 / mid;

  console.log(id, `× ${opSec.toFixed(2)} ops/sec`, `± ${errorPerc.toFixed(2)}%`);
}