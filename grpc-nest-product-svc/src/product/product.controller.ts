import { Controller, Inject } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import {
  CreateProductRequestDto,
  DecreaseStockRequestDto,
  FindOneRequestDto,
} from './product.dto';
import {
  CreateProductResponse,
  DecreaseStockResponse,
  FindOneResponse,
  PRODUCT_SERVICE_NAME,
} from './product.pb';
import { ProductService } from './product.service';

@Controller('product')
export class ProductController {
  @Inject(ProductService)
  private readonly service: ProductService;

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'CreateProduct')
  public createProduct(
    payload: CreateProductRequestDto,
  ): Promise<CreateProductResponse> {
    return this.service.createProduct(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'FindOne')
  public findOne(payload: FindOneRequestDto): Promise<FindOneResponse> {
    return this.service.findOne(payload);
  }

  @GrpcMethod(PRODUCT_SERVICE_NAME, 'DecreaseStock')
  public decreaseStock(
    payload: DecreaseStockRequestDto,
  ): Promise<DecreaseStockResponse> {
    return this.service.decreaseStock(payload);
  }
}
