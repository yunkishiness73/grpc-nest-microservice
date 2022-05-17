import { Body, Controller, Get, Inject, Param, ParseIntPipe, Post, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthGuard } from '../auth/auth.guard';
import { CreateProductRequest, CreateProductResponse, FindOneRequest, FindOneResponse, ProductServiceClient, PRODUCT_SERVICE_NAME } from './product.pb';

@Controller('product')
export class ProductController {
  private svc: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  public async createProduct(@Body() body: CreateProductRequest): Promise<Observable<CreateProductResponse>> {
    return this.svc.createProduct(body);
  }

  @Get(':id')
  public async findOne(@Param('id', ParseIntPipe) id: FindOneRequest): Promise<Observable<FindOneResponse>> {
    return this.svc.findOne(id);
  }

}
