import { Injectable } from '@nestjs/common';
import { Worker } from 'node:worker_threads';
import { EvaluateDto } from './evaluate.dto';

@Injectable()
export class CalcService {
  evaluateAsync(payload: EvaluateDto) {
    return new Promise<string>((resolve, reject) => {
      const worker = new Worker(__dirname + '/calc.worker', {
        workerData: payload.expression,
      });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0)
          reject(new Error(`Worker stopped with exit code ${code}`));
      });
    });
  }
}
