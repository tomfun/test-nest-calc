import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { CalcService } from './calc.service';
import { EvaluateDto } from './evaluate.dto';

@Controller()
export class AppController {
  constructor(private readonly calcService: CalcService) {}

  @Post('/evaluate')
  getEvaluateResult(
    @Body(new ValidationPipe({ whitelist: true, transform: true }))
    payload: EvaluateDto,
  ): Promise<string> {
    return this.calcService.evaluateAsync(payload);
  }
}
