import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsRepository } from '../../repository/products.repository';
import { ProductsResolver } from './products.resolver';
import { ProductsService } from './products.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProductsRepository]),
    ],
    providers: [ProductsResolver, ProductsService]
})

export class ProductsModule {};