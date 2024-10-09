import { parentPort, workerData } from 'node:worker_threads';

import { calculate } from './calc.lib';

const result = calculate(workerData);
parentPort.postMessage({ result });
