import { mkdirSync } from 'node:fs';
import { join } from 'node:path';

export const PRODUCT_IMAGES_URL = '/images/products';
export const PRODUCT_IMAGES = join(process.cwd(), 'public/images/products');

mkdirSync(PRODUCT_IMAGES, { recursive: true });
