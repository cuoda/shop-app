import {
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateProductRequest {
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  name!: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(2000)
  description!: string;

  // max 2 decimal -> Stripe amount (cents) hamesha integer rahega
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  price!: number;
}
