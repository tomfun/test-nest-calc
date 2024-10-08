import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { CalcService } from './calc.service';

describe('AppController', () => {
  let appController: AppController;
  let calcWorker: AppController;

  beforeEach(async () => {
    // calcWorker = jest.mock('./calc.worker');
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [CalcService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', async () => {
      await expect(appController.getEvaluateResult({ expression: '1+1' })).resolves.toContainEqual({
        result: 2,
      });
    });
  });
});
