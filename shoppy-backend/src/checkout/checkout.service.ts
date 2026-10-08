import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { ProductsService } from '../products/products.service';

@Injectable()
export class CheckoutService {
  constructor(
    private readonly stripe: Stripe,
    private readonly productService: ProductsService,
    private readonly configService: ConfigService,
  ) {}

  async createSession(productId: number, buyerId: number) {
    const product = await this.productService.getProduct(productId);

    if (product.sold) {
      throw new ConflictException('Product already sold');
    }
    if (product.userId === buyerId) {
      throw new BadRequestException('You cannot buy your own product');
    }

    const session = await this.stripe.checkout.sessions.create({
      metadata: {
        productId: String(productId),
        buyerId: String(buyerId),
      },
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: product.name,
              description: product.description,
            },
            unit_amount: Math.round(product.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: this.configService.getOrThrow('STRIPE_SUCCESS_URL'),
      cancel_url: this.configService.getOrThrow('STRIPE_CANCEL_URL'),
    });

    return { id: session.id, url: session.url };
  }

  async handleCheckoutWebhook(
    rawBody: Buffer | undefined,
    signature: string | undefined,
  ) {
    if (!rawBody || !signature) {
      throw new BadRequestException('Missing payload or signature');
    }

    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        this.configService.getOrThrow<string>('STRIPE_WEBHOOK_SECRET'),
      );
    } catch {
      throw new BadRequestException('Invalid Stripe signature');
    }

    if (
      event.type === 'checkout.session.completed' ||
      event.type === 'checkout.session.async_payment_succeeded'
    ) {
      const session = event.data.object;

      if (session.payment_status === 'paid') {
        const productId = Number(session.metadata?.productId);
        if (Number.isInteger(productId)) {
          await this.productService.markAsSold(productId);
        }
      }
    }

    return { received: true };
  }
}
