import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Connection } from 'typeorm';
import { Product } from './entity/product.entity';
import { StockDecreaseLog } from './entity/stock-decrease-log.entity';
import {
  CreateProductRequestDto,
  DecreaseStockRequestDto,
  FindOneRequestDto,
} from './product.dto';
import {
  CreateProductResponse,
  DecreaseStockResponse,
  FindOneResponse,
} from './product.pb';

@Injectable()
export class ProductService {
  @InjectRepository(Product)
  private readonly repository: Repository<Product>;

  @InjectRepository(StockDecreaseLog)
  private readonly decreaseLogRepository: Repository<StockDecreaseLog>;

  constructor(private readonly connection: Connection) {}

  public async findOne({ id }: FindOneRequestDto): Promise<FindOneResponse> {
    const product: Product = await this.repository.findOne({ where: { id } });
    if (!product) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['Product not found'],
        data: null,
      };
    }

    return {
      status: HttpStatus.OK,
      error: null,
      data: product,
    };
  }

  public async createProduct(
    payload: CreateProductRequestDto,
  ): Promise<CreateProductResponse> {
    const product: Product = new Product();

    product.name = payload.name;
    product.sku = payload.sku;
    product.stock = payload.stock;
    product.price = payload.price;

    const productEntity = await product.save();

    return {
      status: HttpStatus.CREATED,
      error: null,
      id: productEntity.id,
    };
  }

  public async decreaseStock({
    id,
    orderId,
  }: DecreaseStockRequestDto): Promise<DecreaseStockResponse> {
    const product: Product = await this.repository.findOne({
      select: ['id', 'stock'],
      where: {
        id,
      },
    });

    if (!product) {
      return {
        status: HttpStatus.NOT_FOUND,
        error: ['Product not found'],
      };
    }

    if (product.stock <= 0) {
      return {
        status: HttpStatus.BAD_REQUEST,
        error: ['Stock too low'],
      };
    }

    const wasStockDecreased: number = await this.decreaseLogRepository.count({
      where: { orderId },
    });
    if (wasStockDecreased) {
      // Idempotence
      return {
        status: HttpStatus.BAD_REQUEST,
        error: ['Stock already decreased'],
      };
    }

    const queryRunner = this.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await this.repository.update(product.id, {
        stock: product.stock - 1,
      });
      await this.decreaseLogRepository.insert({
        product,
        orderId,
      });

      await queryRunner.commitTransaction();

      return {
        status: HttpStatus.OK,
        error: null,
      };
    } catch (err) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }
}
