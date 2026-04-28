import { Injectable } from '@nestjs/common';
import { Product, ProductHydratedDocument } from './document/product.document';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { CreateProductRequest } from './dto/create-product-request.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductHydratedDocument>,
  ) {}

  // CREATE
  async create(dto: CreateProductRequest): Promise<ProductHydratedDocument> {
    const product = new this.productModel(dto);
    return product.save();
  }

  // FIND ALL
  async findAll(): Promise<ProductHydratedDocument[]> {
    return this.productModel.find().exec();
  }

  // FIND ONE BY ID
  async findOneById(id: string): Promise<ProductHydratedDocument | null> {
    return this.productModel.findById(id).exec();
  }

  // UPDATE
  async update(
    id: string,
    dto: UpdateProductDto,
  ): Promise<ProductHydratedDocument | null> {
    return this.productModel
      .findByIdAndUpdate(id, dto, { new: true, runValidators: true })
      .exec();
  }

  // REMOVE
  async remove(id: string): Promise<boolean> {
    const result = await this.productModel.findByIdAndDelete(id).exec();
    return !!result;
  }
}



