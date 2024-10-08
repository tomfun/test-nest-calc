import { parentPort, workerData } from 'node:worker_threads';

// for older node:
// import mathjs from 'mathjs';
// for modern:
const mathjs_import = import('mathjs');

const expression = workerData;
console.log('33 ', expression);
(async () => {
  const { evaluate } = await mathjs_import;
  const result = evaluate(expression);
  parentPort.postMessage({ result });
})();
