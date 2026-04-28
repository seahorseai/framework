import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductRequest } from './dto/create-product-request.dto';
import { CreateProductResponse } from './dto/create-product-response.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductHydratedDocument } from './document/product.document';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  // CREATE
  @Post()
  async create(
    @Body() dto: CreateProductRequest,
  ): Promise<CreateProductResponse> {
    try {
      const product = await this.productService.create(dto);
      return this.toResponse(product);
    } catch (error) {
      throw new HttpException(
        { message: 'Failed to create product', error: error?.message },
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  // FIND ALL
  @Get()
  async findAll(): Promise<CreateProductResponse[]> {
    const products = await this.productService.findAll();
    return products.map(this.toResponse);
  }

  // FIND ONE
  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<CreateProductResponse> {
    const product = await this.productService.findOneById(id);

    if (!product) {
      throw new HttpException(
        `Product with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.toResponse(product);
  }

  // UPDATE
  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<CreateProductResponse> {
    const product = await this.productService.update(id, dto);

    if (!product) {
      throw new HttpException(
        `Product with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }

    return this.toResponse(product);
  }

  // DELETE
  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<void> {
    const deleted = await this.productService.remove(id);

    if (!deleted) {
      throw new HttpException(
        `Product with id ${id} not found`,
        HttpStatus.NOT_FOUND,
      );
    }
  }

  // MAPPER
  private toResponse(
    product: ProductHydratedDocument,
  ): CreateProductResponse {
    return {
      id: product._id.toString(),
      name: product.name,
      reference: product.reference,
      price: product.price,
      
    };
  }
}
