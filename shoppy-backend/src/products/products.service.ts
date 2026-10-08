import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { readdir, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { Prisma } from '../../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProductRequest } from './dto/create-product.dto';
import { PRODUCT_IMAGES, PRODUCT_IMAGES_URL } from './product-images';
import { ProductsGateway } from './products.gateway';

const IMAGE_FILE_REGEX = /^(\d+)-image\.(jpe?g|png|gif)$/;
const MIME_EXTENSIONS: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
};

@Injectable()
export class ProductsService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productsGateway: ProductsGateway,
  ) {}

  async createProduct(data: CreateProductRequest, userId: number) {
    const product = await this.prismaService.product.create({
      data: { ...data, userId },
    });

    this.productsGateway.emitProductUpdated({
      productId: product.id,
      type: 'created',
    });
    return { ...product, imageUrl: null };
  }

  async getProducts(status?: string) {
    const where: Prisma.ProductWhereInput =
      status === 'available' ? { sold: false } : {};

    const [products, images] = await Promise.all([
      this.prismaService.product.findMany({
        where,
        orderBy: { id: 'desc' },
        include: { user: { select: { id: true, email: true } } },
      }),
      this.getImageMap(),
    ]);

    return products.map((product) => ({
      ...product,
      imageUrl: images.get(product.id) ?? null,
    }));
  }

  async getProduct(productId: number) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
      include: { user: { select: { id: true, email: true } } },
    });
    if (!product) throw new NotFoundException('Product not found');

    const imageUrl = (await this.getImageMap()).get(productId) ?? null;
    return { ...product, imageUrl, imageExists: imageUrl !== null };
  }

  async saveImage(
    productId: number,
    userId: number,
    file: Express.Multer.File,
  ) {
    const product = await this.prismaService.product.findUnique({
      where: { id: productId },
    });
    if (!product) throw new NotFoundException('Product not found');
    if (product.userId !== userId) {
      throw new ForbiddenException(
        'You can only upload images for your own products',
      );
    }

    await this.removeImages(productId);

    const fileName = `${productId}-image.${MIME_EXTENSIONS[file.mimetype]}`;
    await writeFile(join(PRODUCT_IMAGES, fileName), file.buffer);

    this.productsGateway.emitProductUpdated({ productId, type: 'updated' });
    return { imageUrl: `${PRODUCT_IMAGES_URL}/${fileName}` };
  }

  async markAsSold(productId: number) {
    await this.prismaService.product.update({
      where: { id: productId },
      data: { sold: true },
    });

    this.productsGateway.emitProductUpdated({ productId, type: 'sold' });
  }

  private async getImageMap(): Promise<Map<number, string>> {
    const files = await readdir(PRODUCT_IMAGES).catch(() => [] as string[]);
    const map = new Map<number, string>();
    for (const file of files) {
      const match = IMAGE_FILE_REGEX.exec(file);
      if (match) map.set(Number(match[1]), `${PRODUCT_IMAGES_URL}/${file}`);
    }
    return map;
  }

  private async removeImages(productId: number) {
    const files = await readdir(PRODUCT_IMAGES).catch(() => [] as string[]);
    await Promise.all(
      files
        .filter((file) => {
          const match = IMAGE_FILE_REGEX.exec(file);
          return match && Number(match[1]) === productId;
        })
        .map((file) => rm(join(PRODUCT_IMAGES, file), { force: true })),
    );
  }
}
