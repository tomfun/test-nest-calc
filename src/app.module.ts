import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { CalcService } from './calc.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [CalcService],
})
export class AppModule {}
