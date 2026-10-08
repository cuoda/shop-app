import { IsNumber } from 'class-validator';

export class createSessionRequestDto {
  @IsNumber()
  productId!: number;
}
