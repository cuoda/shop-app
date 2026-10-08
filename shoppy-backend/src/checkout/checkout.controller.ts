import {
  Body,
  Controller,
  Headers,
  HttpCode,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { RawBodyRequest } from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { ITokenPayload } from '../auth/interfaces/token-payload.interface';
import { createSessionRequestDto } from './dto/create-session-request.dto';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post('session')
  @UseGuards(JwtAuthGuard)
  createSession(
    @Body() request: createSessionRequestDto,
    @CurrentUser() user: ITokenPayload,
  ) {
    return this.checkoutService.createSession(request.productId, user.userId);
  }

  @Post('webhook')
  @HttpCode(200)
  handleCheckoutWebhooks(
    @Req() req: RawBodyRequest<Request>,
    @Headers('stripe-signature') signature?: string,
  ) {
    return this.checkoutService.handleCheckoutWebhook(req.rawBody, signature);
  }
}
