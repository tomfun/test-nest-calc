import { IsString, Matches, IsNotEmpty } from 'class-validator';

export class EvaluateDto {
  @IsString()
  @IsNotEmpty({ message: 'Expression should not be empty' })
  @Matches(/^[0-9+\-*/()\s.]+$/, {
    message: 'Expression contains invalid characters',
  })
  expression: string;
}
