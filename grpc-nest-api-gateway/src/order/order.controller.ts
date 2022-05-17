import { Controller, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { AuthGuard, IGetUserAuthInfoRequest } from '../auth/auth.guard';
import { CreateOrderRequest, CreateOrderResponse, OrderServiceClient, ORDER_SERVICE_NAME } from './order.pb';

@Controller('order')
export class OrderController {
  private svc: OrderServiceClient;

  @Inject(ORDER_SERVICE_NAME)
  private readonly client: ClientGrpc;

  public onModuleInit(): void {
    this.svc = this.client.getService<OrderServiceClient>(ORDER_SERVICE_NAME);
  }

  @Post()
  @UseGuards(AuthGuard)
  public async createOrder(@Req() req: IGetUserAuthInfoRequest): Promise<Observable<CreateOrderResponse>> {
    const body: CreateOrderRequest = req.body;

    body.userId = <number> req.user;

    return this.svc.createOrder(body);
  }
}
