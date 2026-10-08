import {
  Body,
  Controller,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  ParseIntPipe,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import type { ITokenPayload } from '../auth/interfaces/token-payload.interface';
import { CreateProductRequest } from './dto/create-product.dto';
import { ProductsService } from './products.service';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  createProduct(
    @Body() body: CreateProductRequest,
    @CurrentUser() user: ITokenPayload,
  ) {
    return this.productsService.createProduct(body, user.userId);
  }

  @Post(':productId/image')
  @UseInterceptors(FileInterceptor('image'))
  uploadProductImage(
    @Param('productId', ParseIntPipe) productId: number,
    @CurrentUser() user: ITokenPayload,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 2 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^image\/(jpeg|png|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    return this.productsService.saveImage(productId, user.userId, file);
  }

  @Get()
  getProducts(@Query('status') status?: string) {
    return this.productsService.getProducts(status);
  }

  @Get(':productId')
  getProduct(@Param('productId', ParseIntPipe) productId: number) {
    return this.productsService.getProduct(productId);
  }
}
