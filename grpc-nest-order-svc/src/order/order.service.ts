import { HttpStatus, Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { InjectRepository } from '@nestjs/typeorm';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { CreateOrderRequestDto } from './order.dto';
import { Order } from './order.entity';
import { CreateOrderResponse } from './proto/order.pb';
import { Connection } from 'typeorm';
import {
  DecreaseStockResponse,
  FindOneResponse,
  ProductServiceClient,
  PRODUCT_SERVICE_NAME,
} from './proto/product.pb';

@Injectable()
export class OrderService implements OnModuleInit {
  private productSvc: ProductServiceClient;

  @Inject(PRODUCT_SERVICE_NAME)
  private readonly client: ClientGrpc;

  @InjectRepository(Order)
  private readonly repository: Repository<Order>;

  constructor(private readonly connection: Connection) {}

  onModuleInit() {
    this.productSvc =
      this.client.getService<ProductServiceClient>(PRODUCT_SERVICE_NAME);
  }

  public async createOrder(
    data: CreateOrderRequestDto,
  ): Promise<CreateOrderResponse> {
    const product: FindOneResponse = await firstValueFrom(
      this.productSvc.findOne({
        id: data.productId,
      }),
    );

    console.log(JSON.stringify(product));

    if (product.status === HttpStatus.NOT_FOUND) {
      return {
        id: null,
        error: ['Product not found'],
        status: product.status,
      };
    }

    if (product.data.stock < data.quantity) {
      return {
        id: null,
        error: ['Stock too low'],
        status: HttpStatus.BAD_REQUEST,
      };
    }

    // const queryRunner = this.connection.createQueryRunner();
    // await queryRunner.connect();
    // await queryRunner.startTransaction();

    try {
      const order: Order = new Order();
      order.price = product.data.price;
      order.productId = product.data.id;
      order.userId = data.userId;

      const orderEntity = await order.save();

      const decreasedStockData: DecreaseStockResponse = await firstValueFrom(
        this.productSvc.decreaseStock({
          id: data.productId,
          orderId: orderEntity.id,
        }),
      );

      if (decreasedStockData.status === HttpStatus.BAD_REQUEST) {
        await this.repository.delete(orderEntity.id);
        return {
          id: null,
          error: decreasedStockData.error,
          status: decreasedStockData.status,
        };
      }

      //await queryRunner.commitTransaction();

      return {
        id: orderEntity.id,
        error: null,
        status: HttpStatus.OK,
      };
    } catch (err) {
      //await queryRunner.rollbackTransaction();
    } finally {
      //await queryRunner.release();
    }
  }
}
